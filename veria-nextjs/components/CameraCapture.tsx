'use client';

import { useState, useRef, useEffect } from 'react';

interface CameraCaptureProps {
    isOpen: boolean;
    onClose: () => void;
    onCapture: (file: File) => void;
}

export default function CameraCapture({ isOpen, onClose, onCapture }: CameraCaptureProps) {
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Start camera when modal opens
    useEffect(() => {
        if (isOpen && !capturedImage) {
            startCamera();
        }
        return () => {
            stopCamera();
        };
    }, [isOpen]);

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user', width: 1280, height: 720 },
                audio: false
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
            setError(null);
        } catch (err) {
            console.error('Camera access error:', err);
            setError('Unable to access camera. Please check permissions.');
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(video, 0, 0);
                const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9);
                setCapturedImage(imageDataUrl);
                stopCamera();
            }
        }
    };

    const retakePhoto = () => {
        setCapturedImage(null);
        startCamera();
    };

    const confirmPhoto = () => {
        if (capturedImage) {
            fetch(capturedImage)
                .then(res => res.blob())
                .then(blob => {
                    const file = new File([blob], `camera-${Date.now()}.jpg`, { type: 'image/jpeg' });
                    onCapture(file);
                    handleClose();
                });
        }
    };

    const handleClose = () => {
        stopCamera();
        setCapturedImage(null);
        setError(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={handleClose}>
            <div
                className="relative w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden glass-card"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                    <h2 className="text-lg font-semibold text-white">Take Photo</h2>
                    <button onClick={handleClose} className="text-gray-400 hover:text-white transition-colors text-2xl">
                        ×
                    </button>
                </div>

                <div className="relative aspect-video bg-black flex items-center justify-center">
                    {error ? (
                        <div className="text-center p-6">
                            <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center mx-auto mb-4 text-2xl">!</div>
                            <p className="text-red-400 mb-4">{error}</p>
                            <button onClick={startCamera} className="bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-gray-200">
                                Try Again
                            </button>
                        </div>
                    ) : capturedImage ? (
                        <img src={capturedImage} alt="Captured" className="w-full h-full object-contain" />
                    ) : (
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            className="w-full h-full object-cover transform scale-x-[-1]"
                        />
                    )}
                    <canvas ref={canvasRef} className="hidden" />
                </div>

                <div className="p-6 flex items-center justify-center gap-4 bg-zinc-900/50">
                    {!error && !capturedImage && (
                        <button
                            onClick={capturePhoto}
                            className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center hover:bg-white/10 transition-colors"
                        >
                            <div className="w-12 h-12 bg-white rounded-full"></div>
                        </button>
                    )}

                    {capturedImage && (
                        <>
                            <button onClick={retakePhoto} className="px-6 py-2 rounded-xl border border-white/20 text-white hover:bg-white/10 transition-colors">
                                Retake
                            </button>
                            <button onClick={confirmPhoto} className="px-6 py-2 rounded-xl bg-purple-600 text-white hover:bg-purple-500 transition-colors shadow-lg shadow-purple-500/20">
                                Confirm
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
