import React, { useState, useRef, useEffect } from 'react';
import { Icon } from './Icon';

const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};


interface VideoRecorderProps {
  onClose: () => void;
  onConfirm: (videoAsBase64: string) => void;
}

const AUDIO_CONSTRAINTS = {
  echoCancellation: true,
  noiseSuppression: true,
  autoGainControl: true,
};

export const VideoRecorder: React.FC<VideoRecorderProps> = ({ onClose, onConfirm }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(60);
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [currentDeviceIndex, setCurrentDeviceIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const countdownIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    const initCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: AUDIO_CONSTRAINTS });
        
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoInputs = devices.filter(device => device.kind === 'videoinput');
        setVideoDevices(videoInputs);

        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }

        const activeTrack = mediaStream.getVideoTracks()[0];
        const activeDeviceId = activeTrack.getSettings().deviceId;
        const initialIndex = videoInputs.findIndex(d => d.deviceId === activeDeviceId);
        if(initialIndex !== -1) {
            setCurrentDeviceIndex(initialIndex);
        }

      } catch (err) {
        console.error("Error accessing media devices.", err);
        setError("No se pudo acceder a la cámara o al micrófono. Revisa los permisos de tu navegador.");
      }
    };
    
    if (!recordedVideoUrl) {
      initCamera();
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, [recordedVideoUrl]);

  const handleSwitchCamera = async () => {
    if (isRecording || videoDevices.length < 2) return;

    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }

    const nextIndex = (currentDeviceIndex + 1) % videoDevices.length;
    setCurrentDeviceIndex(nextIndex);
    const nextDeviceId = videoDevices[nextIndex].deviceId;

    try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
            audio: AUDIO_CONSTRAINTS,
            video: { deviceId: { exact: nextDeviceId } }
        });
        setStream(mediaStream);
        if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
        }
    } catch (err) {
         console.error("Error switching camera.", err);
         setError("No se pudo cambiar de cámara.");
    }
  };

  const handleStartRecording = () => {
    if (stream) {
      recordedChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedVideoUrl(url);
      };

      mediaRecorder.start();
      setIsRecording(true);

      setCountdown(60);
      countdownIntervalRef.current = window.setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);

      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          handleStopRecording();
        }
      }, 60000);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
       if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
    }
  };

  const handleConfirm = async () => {
    if (recordedVideoUrl) {
        const blob = await fetch(recordedVideoUrl).then(r => r.blob());
        const base64 = await blobToBase64(blob);
        onConfirm(base64);
    }
  };

  const handleRetry = () => {
    setRecordedVideoUrl(null);
    setError(null);
    setCountdown(60);
  };
  
  return (
    <div className="fixed inset-0 bg-black z-[100] flex items-center justify-center">
      <div className="w-full h-full flex flex-col relative">
        {error ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-4 bg-content-bg rounded-lg max-w-sm mx-auto">
            <p className="text-red-500 font-semibold">{error}</p>
            <button onClick={onClose} className="mt-4 bg-primary text-white font-bold py-2 px-6 rounded-lg">Cerrar</button>
          </div>
        ) : (
          <>
            <video ref={videoRef} autoPlay muted={!recordedVideoUrl} controls={!!recordedVideoUrl} src={recordedVideoUrl || undefined} className="w-full h-full object-cover" playsInline></video>
            
            <div className="absolute inset-0 z-10">
                <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/75">
                    <Icon path="M6 18L18 6M6 6l12 12" className="w-6 h-6" />
                </button>
                
                {!isRecording && !recordedVideoUrl && videoDevices.length > 1 && (
                    <button
                        onClick={handleSwitchCamera}
                        className="absolute top-4 left-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/75"
                        aria-label="Cambiar cámara"
                    >
                        <Icon path="M20 11A8.1 8.1 0 004.5 9.5M4 5v4h4m-4 4a8.1 8.1 0 0015.5 1.5M20 19v-4h-4" className="w-6 h-6" />
                    </button>
                )}

                {isRecording && <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">REC {countdown}s</div>}

                <div className="absolute bottom-0 left-0 right-0 p-6 flex items-center justify-center space-x-4 bg-gradient-to-t from-black/60 to-transparent">
                    {recordedVideoUrl ? (
                        <>
                            <button onClick={handleRetry} className="bg-gray-200 text-black font-bold py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors">Grabar de Nuevo</button>
                            <button onClick={handleConfirm} className="bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors">Confirmar Video</button>
                        </>
                    ) : (
                        isRecording ? (
                            <button onClick={handleStopRecording} className="bg-red-500 text-white rounded-full p-4 flex items-center justify-center h-20 w-20">
                                <div className="w-8 h-8 bg-white rounded-sm"></div>
                            </button>
                        ) : (
                            <button 
                                onClick={handleStartRecording} 
                                className="bg-red-500 rounded-full h-20 w-20 border-4 border-white shadow-lg hover:bg-red-600 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black/50 focus:ring-white"
                                aria-label="Iniciar grabación"
                            >
                            </button>
                        )
                    )}
                </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};