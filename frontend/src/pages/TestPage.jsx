import { useState, useRef } from 'react'
import { ArrowRight } from 'lucide-react'

const TestPage = () => {
    const [file, setFile] = useState(null)
    const [dragActive, setDragActive] = useState(false)
    const [analyzing, setAnalyzing] = useState(false)
    const [result, setResult] = useState(null)
    const [error, setError] = useState(null)
    const fileInputRef = useRef(null)

    const handleDrag = (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }

    const handleDrop = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0])
        }
    }

    const handleChange = (e) => {
        e.preventDefault()
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0])
        }
    }

    const handleFile = async (selectedFile) => {
        setFile(selectedFile)
        setResult(null)
        setError(null)
        setAnalyzing(true)

        const formData = new FormData()
        formData.append('file', selectedFile)

        try {
            const response = await fetch('http://localhost:8000/analyze', {
                method: 'POST',
                body: formData,
            })
            const data = await response.json()

            if (data.status === 'success') {
                setResult(data.result)
            } else {
                setError(data.message || 'Error parsing analysis result.')
            }
        } catch (err) {
            setError('Connection to backend failed. Make sure FastAPI is running.')
        } finally {
            setAnalyzing(false)
        }
    }

    const resetState = () => {
        setFile(null)
        setResult(null)
        setError(null)
        setAnalyzing(false)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    return (
        <div className="pt-24 min-h-screen px-4 pb-10 flex flex-col items-center">
            <div className="max-w-3xl w-full text-center mb-10">
                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">Media Analysis Engine</h1>
                <p className="text-gray-400 text-lg">Upload your video or image to run it through the YUKTHA deepfake detection pipeline.</p>
            </div>

            <div className="glass-panel w-full max-w-2xl">
                {error && (
                    <div style={{ color: '#ef4444', marginBottom: '1rem', padding: '1rem', background: 'rgba(239,68,68,0.1)', borderRadius: '8px' }}>
                        {error}
                    </div>
                )}

                {!analyzing && !result && (
                    <div
                        className={`upload-zone ${dragActive ? "drag-active" : ""}`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current.click()}
                    >
                        <div className="upload-icon">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="17 8 12 3 7 8"></polyline>
                                <line x1="12" y1="3" x2="12" y2="15"></line>
                            </svg>
                        </div>
                        <p style={{ fontSize: '1.2rem', margin: '0 0 0.5rem 0' }}>Drag & Drop here</p>
                        <p style={{ color: '#818cf8', fontSize: '0.9rem', margin: 0 }}>or click to browse files</p>
                        <input
                            ref={fileInputRef}
                            type="file"
                            className="file-input"
                            onChange={handleChange}
                            accept="image/*,video/*"
                        />
                    </div>
                )}

                {analyzing && (
                    <div className="analyzing-container">
                        <div className="scanner"></div>
                        <h2 className="pulse-text">DEEP SCANNING MEDIA...</h2>
                        <p className="subtitle" style={{ marginTop: '0.5rem' }}>Analyzing spatial, motion, audio & physical anomalies.</p>
                    </div>
                )}

                {result && (
                    <div className="result-container">
                        <div className={`result-badge ${result.label === 'FAKE' ? 'result-fake' : 'result-real'}`}>
                            {result.label === 'FAKE' ? 'AI GENERATED' : 'AUTHENTIC MEDIA'}
                        </div>

                        <div style={{ marginTop: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ color: '#a1a1aa' }}>Confidence Score</span>
                                <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{result.confidence.toFixed(2)}%</span>
                            </div>

                            <div className="confidence-bar-bg">
                                <div
                                    className={`confidence-bar-fill ${result.label === 'FAKE' ? 'fake-fill' : 'real-fill'}`}
                                    style={{ width: `${result.confidence}%` }}
                                ></div>
                            </div>
                        </div>

                        <button className="reset-btn flex items-center justify-center gap-2" onClick={resetState}>
                            Analyze Another File <ArrowRight size={18} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default TestPage
