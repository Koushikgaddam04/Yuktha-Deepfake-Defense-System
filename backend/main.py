from fastapi import FastAPI, UploadFile, File, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import tempfile
import uuid
import uuid
from inference import predict

app = FastAPI(title="AI Detection API")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all origins for dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "AI Detection API is running"}

def cleanup_file(path: str):
    if os.path.exists(path):
        try:
            os.remove(path)
        except Exception as e:
            print(f"Error cleaning up file {path}: {e}")

@app.post("/analyze")
async def analyze_media(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    # Create a unique temp file
    ext = os.path.splitext(file.filename)[1]
    temp_filename = f"temp_{uuid.uuid4().hex}{ext}"
    
    try:
        contents = await file.read()
        with open(temp_filename, "wb") as f:
            f.write(contents)
            
        print(f"Processing uploaded file: {file.filename}")
        
        # Run inference
        # In a real production setup you might want to run this in a thread pool
        # since it's blocking CPU/GPU bound torch code
        result = predict(temp_filename)
        
        # Cleanup later
        background_tasks.add_task(cleanup_file, temp_filename)
        
        if "error" in result:
            return {"status": "error", "message": result["error"]}
            
        return {
            "status": "success",
            "result": {
                "label": result["label"],
                "confidence": result["confidence"] * 100, # Convert to percentage
                "probability": result["probability"]
            }
        }
    except Exception as e:
        cleanup_file(temp_filename)
        return {"status": "error", "message": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
