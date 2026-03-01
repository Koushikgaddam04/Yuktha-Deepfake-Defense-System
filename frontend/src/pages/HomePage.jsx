import React, { useState, useEffect } from 'react';
import { ArrowRight, ShieldCheck, Video, Activity, Eye, AudioLines, FileCheck2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            title: "The Deepfake Threat",
            desc: "Deepfake media generated using advanced generative models poses a serious threat to digital trust, enabling misinformation, identity fraud, and social manipulation.",
            icon: <Video className="w-16 h-16 text-rose-500 mb-4" />
        },
        {
            title: "Current Limitations",
            desc: "Existing detection approaches are largely model-centric, focusing on either audio or video in isolation, lacking explainability and real-world deployment readiness.",
            icon: <Activity className="w-16 h-16 text-amber-500 mb-4" />
        },
        {
            title: "The YUKTHA Solution",
            desc: "A lean, multimodal deepfake detection system integrating spatial, temporal, audio, frequency, physiological, and lip-sync cues through a robust learning-based fusion framework.",
            icon: <ShieldCheck className="w-16 h-16 text-emerald-500 mb-4" />
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 flex flex-col items-center">

            {/* Hero Section */}
            <div className="text-center max-w-4xl mx-auto mt-16 mb-20">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-sm font-medium mb-8 animate-fade-in">
                    <ShieldCheck size={16} /> Authentic Digital Content Verification
                </div>
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500">
                        YUKTHA
                    </span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                    Advanced Multi-Modal AI System for robust detection of synthetic media and deepfakes.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        to="/test"
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-2xl shadow-[0_0_30px_rgba(79,70,229,0.4)] transition-all hover:scale-105"
                    >
                        Start Scanning <ArrowRight size={20} />
                    </Link>
                    <Link
                        to="/architecture"
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-medium text-indigo-300 bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl transition-all"
                    >
                        View Architecture
                    </Link>
                </div>
            </div>

            {/* Problem Statement Carousel */}
            <div className="w-full max-w-5xl mx-auto mb-24 relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>

                <div className="relative bg-[#0d1021]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 overflow-hidden min-h-[400px] flex items-center justify-center">

                    <div className="flex transition-transform duration-700 ease-in-out w-full" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                        {slides.map((slide, index) => (
                            <div key={index} className="w-full flex-shrink-0 px-4 md:px-12 text-center flex flex-col items-center">
                                {slide.icon}
                                <h2 className="text-3xl font-bold text-white mb-6">{slide.title}</h2>
                                <p className="text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto">{slide.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* Carousel Controls */}
                    <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3">
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${currentSlide === index ? 'bg-indigo-500 w-8' : 'bg-white/20 hover:bg-white/40'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Feature Highlights Grid */}
            <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                    <Eye className="w-10 h-10 text-blue-400 mb-4" />
                    <h3 className="text-xl font-semibold mb-2 text-white">Spatial Forensics</h3>
                    <p className="text-gray-400">Detects subtle pixel-level blending artifacts and texture anomalies using EfficientNet-B4.</p>
                </div>
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                    <AudioLines className="w-10 h-10 text-purple-400 mb-4" />
                    <h3 className="text-xl font-semibold mb-2 text-white">Audio Authenticity</h3>
                    <p className="text-gray-400">Identifies synthetic speech and vocoder artifacts via MFCC and Mel-spectrogram analysis.</p>
                </div>
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                    <FileCheck2 className="w-10 h-10 text-green-400 mb-4" />
                    <h3 className="text-xl font-semibold mb-2 text-white">Explainable Reports</h3>
                    <p className="text-gray-400">Provides forensic interpretability through Grad-CAM heatmaps and confidence breakdowns.</p>
                </div>
            </div>

        </div>
    );
};

export default HomePage;
