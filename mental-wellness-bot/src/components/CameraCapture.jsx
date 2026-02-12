import { useState, useRef, useEffect } from 'react'
import './CameraCapture.css'

function CameraCapture({ isOpen, onClose, onCapture }) {
    const [stream, setStream] = useState(null)
    const [capturedImage, setCapturedImage] = useState(null)
    const [error, setError] = useState(null)
    const videoRef = useRef(null)
    const canvasRef = useRef(null)

    // Start camera when modal opens
    useEffect(() => {
        if (isOpen && !capturedImage) {
            startCamera()
        }

        return () => {
            stopCamera()
        }
    }, [isOpen])

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user', width: 1280, height: 720 },
                audio: false
            })
            setStream(mediaStream)
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream
            }
            setError(null)
        } catch (err) {
            console.error('Camera access error:', err)
            setError('Unable to access camera. Please check permissions.')
        }
    }

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop())
            setStream(null)
        }
    }

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current
            const canvas = canvasRef.current
            canvas.width = video.videoWidth
            canvas.height = video.videoHeight
            const ctx = canvas.getContext('2d')
            ctx.drawImage(video, 0, 0)

            const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9)
            setCapturedImage(imageDataUrl)
            stopCamera()
        }
    }

    const retakePhoto = () => {
        setCapturedImage(null)
        startCamera()
    }

    const confirmPhoto = () => {
        if (capturedImage) {
            // Convert data URL to File object
            fetch(capturedImage)
                .then(res => res.blob())
                .then(blob => {
                    const file = new File([blob], `camera-${Date.now()}.jpg`, { type: 'image/jpeg' })
                    onCapture(file)
                    handleClose()
                })
        }
    }

    const handleClose = () => {
        stopCamera()
        setCapturedImage(null)
        setError(null)
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className="camera-modal-overlay" onClick={handleClose}>
            <div className="camera-modal glass-elevated" onClick={(e) => e.stopPropagation()}>
                <div className="camera-header">
                    <h2 className="camera-title">Take Photo</h2>
                    <button className="camera-close-btn" onClick={handleClose}>
                        ×
                    </button>
                </div>

                <div className="camera-content">
                    {error ? (
                        <div className="camera-error">
                            <div className="error-icon">!</div>
                            <p>{error}</p>
                            <button className="btn btn-primary" onClick={startCamera}>
                                Try Again
                            </button>
                        </div>
                    ) : capturedImage ? (
                        <img src={capturedImage} alt="Captured" className="captured-image" />
                    ) : (
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            className="camera-video"
                        />
                    )}
                    <canvas ref={canvasRef} style={{ display: 'none' }} />
                </div>

                <div className="camera-controls">
                    {!error && !capturedImage && (
                        <button className="btn btn-capture" onClick={capturePhoto}>
                            <div className="capture-ring">
                                <div className="capture-inner"></div>
                            </div>
                            <span>Capture</span>
                        </button>
                    )}
                    {capturedImage && (
                        <>
                            <button className="btn btn-outline" onClick={retakePhoto}>
                                Retake
                            </button>
                            <button className="btn btn-primary" onClick={confirmPhoto}>
                                Confirm
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default CameraCapture
