import os
import torch
import torch.nn as nn
import numpy as np
import cv2
import librosa
import subprocess
from transformers import Wav2Vec2Processor, Wav2Vec2Model
from insightface.app import FaceAnalysis
import timm

# -------------------- CONFIG ------------------------------
CKPT_DIR = r"c:\Users\Koushik Gaddam\OneDrive\Desktop\Major Project\dfdc_train_ckpts-20260227T164113Z-1-001\dfdc_train_ckpts"
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
FP16 = True if DEVICE == "cuda" else False

MAX_FRAMES = 32
AUDIO_SR = 16000
MIN_FACE = 40

print("Using device:", DEVICE)

# ==========================================================
# ---------------- MODEL ARCHITECTURE ----------------------
# ==========================================================

SPATIAL_DIM = 1792
MOTION_DIM  = 512
AUDIO_DIM   = 1536
PHYS_DIM    = 8

def make_mlp(in_dim, hidden=512, embed_dim=128, dropout=0.3):
    return nn.Sequential(
        nn.Linear(in_dim, hidden),
        nn.BatchNorm1d(hidden),
        nn.ReLU(inplace=True),
        nn.Dropout(dropout),
        nn.Linear(hidden, embed_dim),
        nn.ReLU(inplace=True)
    )

class FaceEncoder(nn.Module):
    def __init__(self, in_dim, embed_dim=128):
        super().__init__()
        self.enc = make_mlp(in_dim, hidden=512, embed_dim=embed_dim)
        self.classifier = nn.Linear(embed_dim, 1)
    def forward(self, x):
        emb = self.enc(x)
        logit = self.classifier(emb).squeeze(1)
        return logit, emb

class MotionEncoder(nn.Module):
    def __init__(self, in_dim, embed_dim=128):
        super().__init__()
        self.enc = make_mlp(in_dim, hidden=512, embed_dim=embed_dim)
        self.classifier = nn.Linear(embed_dim, 1)
    def forward(self, x):
        emb = self.enc(x)
        logit = self.classifier(emb).squeeze(1)
        return logit, emb

class AudioEncoder(nn.Module):
    def __init__(self, in_dim, embed_dim=128):
        super().__init__()
        self.enc = make_mlp(in_dim, hidden=512, embed_dim=embed_dim)
        self.classifier = nn.Linear(embed_dim, 1)
    def forward(self, x):
        emb = self.enc(x)
        logit = self.classifier(emb).squeeze(1)
        return logit, emb

class PhysEncoder(nn.Module):
    def __init__(self, in_dim, embed_dim=64):
        super().__init__()
        self.enc = make_mlp(in_dim, hidden=256, embed_dim=embed_dim)
        self.classifier = nn.Linear(embed_dim, 1)
    def forward(self, x):
        emb = self.enc(x)
        logit = self.classifier(emb).squeeze(1)
        return logit, emb

class FusionHead(nn.Module):
    def __init__(self):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(128+128+128+64, 512),
            nn.BatchNorm1d(512),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(512,128),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(128,1)
        )
    def forward(self,x):
        return self.net(x).squeeze(1)

# Initialize and load models
face_enc  = FaceEncoder(SPATIAL_DIM,128).to(DEVICE)
motion_enc= MotionEncoder(MOTION_DIM,128).to(DEVICE)
audio_enc = AudioEncoder(AUDIO_DIM,128).to(DEVICE)
phys_enc  = PhysEncoder(PHYS_DIM,64).to(DEVICE)
fusion    = FusionHead().to(DEVICE)

face_enc.load_state_dict(torch.load(os.path.join(CKPT_DIR, "face_best.pth"), map_location=DEVICE))
motion_enc.load_state_dict(torch.load(os.path.join(CKPT_DIR, "motion_best.pth"), map_location=DEVICE))
audio_enc.load_state_dict(torch.load(os.path.join(CKPT_DIR, "audio_best.pth"), map_location=DEVICE))
phys_enc.load_state_dict(torch.load(os.path.join(CKPT_DIR, "phys_best.pth"), map_location=DEVICE))
fusion.load_state_dict(torch.load(os.path.join(CKPT_DIR, "fusion_best.pth"), map_location=DEVICE))

face_enc.eval()
motion_enc.eval()
audio_enc.eval()
phys_enc.eval()
fusion.eval()

print("✅ Custom Models Loaded Successfully")

# Feature extractors
face_app = FaceAnalysis(name='buffalo_l')
face_app.prepare(ctx_id=0 if DEVICE=="cuda" else -1)

spatial_model = timm.create_model('efficientnet_b4', pretrained=True, num_classes=0)
spatial_model.eval().to(DEVICE)
if FP16: spatial_model.half()

wav_proc = Wav2Vec2Processor.from_pretrained('facebook/wav2vec2-base-960h')
wav_model = Wav2Vec2Model.from_pretrained('facebook/wav2vec2-base-960h')
wav_model.eval().to(DEVICE)
if FP16: wav_model.half()

print("✅ Feature Extractors Loaded Successfully")

def read_frames(video, max_frames=MAX_FRAMES):
    cap = cv2.VideoCapture(video)
    total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    
    if total <= 0:
        # Might be an image or invalid format
        cap.release()
        img = cv2.imread(video)
        if img is not None:
            frames = [cv2.cvtColor(img, cv2.COLOR_BGR2RGB)] * max_frames
            return frames
        return []

    # Safe handling for very short videos
    actual_frames = min(max_frames, total)
    if actual_frames <= 0:
        actual_frames = 1
        
    indices = np.linspace(0, total-1, actual_frames, dtype=int)
    frames=[]
    i=0; idx_set=set(indices)
    while cap.isOpened():
        ok,f = cap.read()
        if not ok: break
        if i in idx_set:
            frames.append(cv2.cvtColor(f,cv2.COLOR_BGR2RGB))
        i+=1
    cap.release()
    
    # Pad to minimum required frames if needed by repeating the last frame
    if len(frames) > 0 and len(frames) < 3:
        while len(frames) < 3:
            frames.append(frames[-1])
            
    return frames

@torch.no_grad()
def extract_features(video_path):
    frames = read_frames(video_path)
    if len(frames) < 3:
        raise RuntimeError("Too few frames or invalid file.")

    # ----- SPATIAL -----
    spatial_feats=[]
    for frame in frames:
        faces=face_app.get(frame)
        if not faces: continue
        f=faces[0]
        x1,y1,x2,y2=map(int,f.bbox)
        # Ensure bounds
        y1 = max(0, y1); y2 = min(frame.shape[0], y2)
        x1 = max(0, x1); x2 = min(frame.shape[1], x2)
        crop=frame[y1:y2,x1:x2]
        if crop.size==0: continue
        img=cv2.resize(crop,(224,224))
        img=torch.from_numpy(img).permute(2,0,1).float()/255.0
        if FP16: img=img.half()
        img=img.unsqueeze(0).to(DEVICE)
        feat=spatial_model(img)
        spatial_feats.append(feat.squeeze(0).cpu())
    if spatial_feats:
        spatial=torch.stack(spatial_feats).mean(0)
    else:
        spatial=torch.zeros(SPATIAL_DIM)

    # ----- MOTION -----
    motion=[]
    prev=None
    for f in frames:
        g=cv2.cvtColor(f,cv2.COLOR_RGB2GRAY)
        if prev is None:
            motion.append(torch.zeros(256))
        else:
            diff=cv2.absdiff(prev,g)
            motion.append(torch.tensor(diff.mean()).repeat(256))
        prev=g
    motion=torch.stack(motion)
    motion=torch.cat([motion.mean(0),motion.std(0)])

    # ----- AUDIO -----
    try:
        tmp_wav = os.path.abspath("temp_audio.wav")
        cmd = [
            "ffmpeg", "-y",
            "-i", video_path,
            "-vn",
            "-ac", "1",
            "-ar", "16000",
            tmp_wav
        ]
        result = subprocess.run(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )

        if result.returncode != 0 or not os.path.exists(tmp_wav):
            print("⚠️ ffmpeg audio extraction failed or no audio. Using zero audio features.")
            audio = torch.zeros(AUDIO_DIM)
        else:
            y, _ = librosa.load(tmp_wav, sr=16000)
            if os.path.exists(tmp_wav):
                os.remove(tmp_wav)

            if len(y) == 0:
                print("⚠️ Empty audio detected. Using zero audio features.")
                audio = torch.zeros(AUDIO_DIM)
            else:
                inp = wav_proc(
                    y,
                    sampling_rate=16000,
                    return_tensors='pt',
                    padding=True
                ).input_values.to(DEVICE)

                if FP16:
                    try: inp = inp.half()
                    except: pass

                with torch.no_grad():
                    emb = wav_model(inp).last_hidden_state.mean(1).cpu()

                audio = emb.repeat(len(frames),1)
                audio = torch.cat([audio.mean(0), audio.std(0)])

    except Exception as e:
        print("⚠️ Audio extraction crashed:", str(e))
        audio = torch.zeros(AUDIO_DIM)

    # ----- PHYS -----
    phys=torch.zeros(PHYS_DIM)

    return spatial.float(),motion.float(),audio.float(),phys.float()

def predict(video_path: str):
    try:
        spatial,motion,audio,phys = extract_features(video_path)
    except Exception as e:
        return {"error": str(e)}

    # Check for empty vectors (zeros) because that causes bad FAKE predictions
    spatial_norm = float(spatial.norm().item())
    motion_norm = float(motion.norm().item())
    audio_norm = float(audio.norm().item())
    phys_norm = float(phys.norm().item())
    
    print(f"DEBUG NORMS -> Spatial: {spatial_norm:.2f}, Motion: {motion_norm:.2f}, Audio: {audio_norm:.2f}, Phys: {phys_norm:.2f}")

    with torch.no_grad():
        spatial = spatial.unsqueeze(0).to(DEVICE)
        motion  = motion.unsqueeze(0).to(DEVICE)
        audio   = audio.unsqueeze(0).to(DEVICE)
        phys    = phys.unsqueeze(0).to(DEVICE)

        _,f_emb = face_enc(spatial)
        _,m_emb = motion_enc(motion)
        _,a_emb = audio_enc(audio)
        _,p_emb = phys_enc(phys)

        emb_cat = torch.cat([f_emb,m_emb,a_emb,p_emb],dim=1)
        logit   = fusion(emb_cat)
        prob    = torch.sigmoid(logit).item()
        
    if prob > 0.5:
        label = "FAKE"
        confidence = prob
    else:
        label = "REAL"
        confidence = 1 - prob
        
    return {
        "label": label,
        "confidence": confidence,
        "probability": prob,
        "debug": {
            "spatial_norm": spatial_norm,
            "motion_norm": motion_norm,
            "audio_norm": audio_norm,
            "phys_norm": phys_norm
        }
    }
