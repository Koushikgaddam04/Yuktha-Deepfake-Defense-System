import React from 'react';
import {
    FileSearch, Video, CheckCircle, Eye, Activity, Clock,
    Mic, HeartPulse, MessageSquare, Network, BarChart4, PieChart, Send, ShieldAlert
} from 'lucide-react';

const ModuleCard = ({ title, purpose, desc, technologies, icon, isCore }) => (
    <div className={`p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-2
    ${isCore ? 'bg-indigo-900/20 border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.15)] hover:shadow-[0_0_30px_rgba(99,102,241,0.25)]'
            : 'bg-white/5 border-white/10 hover:bg-white/10'}
  `}>
        <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-xl ${isCore ? 'bg-indigo-500/20 text-indigo-400' : 'bg-white/10 text-gray-300'}`}>
                {icon}
            </div>
            {isCore && (
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    CORE MODULE
                </span>
            )}
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-sm font-medium text-indigo-300 mb-3">{purpose}</p>
        <ul className="text-sm text-gray-400 space-y-2 mb-4 list-disc pl-4">
            {desc.map((item, idx) => (
                <li key={idx} className="leading-relaxed">{item}</li>
            ))}
        </ul>

        {technologies && (
            <div className="mt-auto pt-4 border-t border-white/10">
                <p className="text-xs text-gray-500 font-medium mb-2">TECHNOLOGIES</p>
                <div className="flex flex-wrap gap-2">
                    {technologies.map(tech => (
                        <span key={tech} className="px-2 py-1 text-xs rounded-md bg-white/5 text-gray-300 border border-white/10">
                            {tech}
                        </span>
                    ))}
                </div>
            </div>
        )}
    </div>
);

const KnowMorePage = () => {
    const modules = [
        {
            title: "Input Handler & Validation",
            purpose: "Handle and validate incoming media.",
            desc: ["Accepts video/audio uploads", "Validates size, duration, codec", "Routes to correct pipeline"],
            technologies: ["FastAPI", "FFmpeg", "OpenCV"],
            icon: <FileSearch size={24} />,
            isCore: false
        },
        {
            title: "Unified Preprocessing Engine",
            purpose: "Prepare multimedia data for analysis.",
            desc: ["Video frame extraction (15–30 FPS)", "Audio extraction", "Frame normalization"],
            technologies: ["OpenCV", "FFmpeg", "NumPy"],
            icon: <CheckCircle size={24} />,
            isCore: false
        },
        {
            title: "Face Processing Module",
            purpose: "Detect and isolate facial regions.",
            desc: ["Face detection (MTCNN)", "Landmark detection", "Face alignment & tracking"],
            technologies: ["MTCNN", "Dlib", "OpenCV"],
            icon: <Video size={24} />,
            isCore: false
        },
        {
            title: "Spatial Forensics (Core)",
            purpose: "Detect visual manipulation artifacts.",
            desc: ["Extracts spatial features", "Detects texture inconsistencies"],
            technologies: ["EfficientNet-B4 CNN"],
            icon: <Eye size={24} />,
            isCore: true
        },
        {
            title: "Frequency Forensics Module",
            purpose: "Identify invisible manipulation artifacts.",
            desc: ["FFT transformation & DCT analysis", "Frequency band anomaly detection"],
            technologies: ["NumPy FFT", "SciPy DCT"],
            icon: <Activity size={24} />,
            isCore: false
        },
        {
            title: "Temporal Consistency Module",
            purpose: "Detect unnatural motion patterns.",
            desc: ["Capture motion consistency", "Detect frame transition anomalies"],
            technologies: ["Temporal Convolutional Network"],
            icon: <Clock size={24} />,
            isCore: true
        },
        {
            title: "Audio Authenticity Module",
            purpose: "Detect synthetic or manipulated speech.",
            desc: ["Extract MFCC & Mel spectrogram", "Detect vocoder artifacts"],
            technologies: ["CNN + Audio TCN"],
            icon: <Mic size={24} />,
            isCore: true
        },
        {
            title: "Physiological Signal Analyzer",
            purpose: "Validate biological realism of subject.",
            desc: ["Blink detection & frequency", "Heart-rate (rPPG) signal estimation"],
            icon: <HeartPulse size={24} />,
            isCore: false
        },
        {
            title: "Lip-Sync Verification",
            purpose: "Verify audio-visual consistency.",
            desc: ["Lip motion vs audio energy correlation", "Precise phoneme-lip alignment (Triggered)"],
            technologies: ["SyncNet", "AV-HuBERT"],
            icon: <MessageSquare size={24} />,
            isCore: false
        },
        {
            title: "Multi-Signal Fusion Engine",
            purpose: "Combine evidence into unified decision.",
            desc: ["Aggregate modality scores", "Learn modality importance weights"],
            technologies: ["MLP Fusion Network", "XGBoost"],
            icon: <Network size={24} />,
            isCore: true
        },
        {
            title: "Confidence Calibration Module",
            purpose: "Generate reliable probability estimates.",
            desc: ["Probability calibration", "Threshold decision logic"],
            technologies: ["Temperature scaling", "Logistic calibration"],
            icon: <BarChart4 size={24} />,
            isCore: false
        },
        {
            title: "Explainability & Report Engine",
            purpose: "Provide interpretable evidence.",
            desc: ["Spatial/Audio heatmaps", "Blink timeline plots", "Confidence breakdown charts"],
            icon: <PieChart size={24} />,
            isCore: false
        },
        {
            title: "Output Delivery Layer",
            purpose: "Deliver results to client systems.",
            desc: ["JSON API response", "Evidence linking", "Dashboard visualization"],
            technologies: ["FastAPI", "Object Storage"],
            icon: <Send size={24} />,
            isCore: false
        },
        {
            title: "Deployment & Monitoring",
            purpose: "Enable production-ready deployment.",
            desc: ["Container orchestration", "Auto-scaling", "Drift detection"],
            technologies: ["Kubernetes", "Prometheus", "Grafana"],
            icon: <ShieldAlert size={24} />,
            isCore: false
        }
    ];

    return (
        <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 pb-20">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
                        System Modules
                    </h1>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                        Explore the 14 distinct modules that power the YUKTHA deepfake detection pipeline.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {modules.map((mod, idx) => (
                        <ModuleCard key={idx} {...mod} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default KnowMorePage;
