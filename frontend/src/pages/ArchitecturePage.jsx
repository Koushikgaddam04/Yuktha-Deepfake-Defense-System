import React from 'react';
import { Share2, Lock, GitMerge, Cpu } from 'lucide-react';

const ArchitecturePage = () => {
    return (
        <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 pb-20">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
                        System Architecture
                    </h1>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                        Independent audio and video pipelines with decision-level, learning-based fusion and confidence calibration.
                    </p>
                </div>

                {/* Feature Gaps Addressed Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
                    <div className="bg-[#0d1021]/80 backdrop-blur-md rounded-3xl p-8 border border-white/10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Share2 size={100} />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4">True Multi-Modal Fusion</h3>
                        <p className="text-gray-300 leading-relaxed">
                            Unlike methods relying on simple averaging, we use independent pipelines with decision-level learning-based fusion. The Fusion MLP model adaptively calibrates trust between different modalities.
                        </p>
                    </div>

                    <div className="bg-[#0d1021]/80 backdrop-blur-md rounded-3xl p-8 border border-white/10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                            <GitMerge size={100} />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4">Robust Lip-Sync Mapping</h3>
                        <p className="text-gray-300 leading-relaxed">
                            Most standard systems ignore talk-head deepfakes. YUKTHA utilizes lightweight lip motion correlation with optional escalation to SyncNet / AV-HuBERT for high-precision phoneme-lip alignment.
                        </p>
                    </div>

                    <div className="bg-[#0d1021]/80 backdrop-blur-md rounded-3xl p-8 border border-white/10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Cpu size={100} />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4">Cross-Verification</h3>
                        <p className="text-gray-300 leading-relaxed">
                            We employ explicit audio-video cross verification through joint score fusion. This allows us to detect partially manipulated media where only audio or only visual features have been faked.
                        </p>
                    </div>

                    <div className="bg-[#0d1021]/80 backdrop-blur-md rounded-3xl p-8 border border-white/10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Lock size={100} />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4">Explainable Outcomes</h3>
                        <p className="text-gray-300 leading-relaxed">
                            Moving past black-box predictions, YUKTHA provides comprehensive interpretability using audio heatmaps, visual Grad-CAM overlays, and timeline plots.
                        </p>
                    </div>
                </div>

                {/* Since we don't have the actual UML diagram imagery, we'll represent them abstractly or as placeholders */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-10 text-center">
                    <h3 className="text-3xl font-bold text-white mb-6">UML & Flow Diagrams</h3>
                    <p className="text-gray-400 mb-10 max-w-2xl mx-auto">
                        Our project design encapsulates comprehensive Class, Sequence, State, Component, Use Case, Activity, and Deployment architectures to ensure robustness and modular scalability.
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {['Class', 'Sequence', 'State', 'Component', 'Use Case', 'Activity', 'Deployment', 'Flow'].map((type) => (
                            <div key={type} className="bg-[#0d1021]/60 py-8 px-4 rounded-2xl border border-white/5 hover:border-indigo-500/50 transition-colors">
                                <span className="text-gray-300 font-medium">{type} Diagram</span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ArchitecturePage;
