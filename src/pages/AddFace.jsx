import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Camera, UserPlus, Save, AlertCircle, CheckCircle2 } from 'lucide-react';
import * as faceapi from 'face-api.js';
import { addEnrolledFace } from '../services/firebaseService';

const AddFace = () => {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' });
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [loadingText, setLoadingText] = useState('Loading Face API Models...');
  const [isScanning, setIsScanning] = useState(false);
  const [enrollDetection, setEnrollDetection] = useState(null);
  const [capturedFrames, setCapturedFrames] = useState([]);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const scanIntervalRef = useRef(null);

  // Load Face Models
  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = 'https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@master/weights';
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
        ]);
        setIsModelLoaded(true);
      } catch (err) {
        console.error(err);
        setError("Failed to load Face Recognition models. Check your connection.");
      }
    };
    loadModels();
  }, []);

  const startVideo = () => {
    if (!formData.name || !formData.phone || !formData.email) {
      setError("Please fill out all form fields before capturing face.");
      return;
    }
    setError(null);
    setIsScanning(true);
    setCapturedFrames([]);
    
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => {
        setError("Could not access webcam. Please allow permissions.");
        setIsScanning(false);
      });
  };

  const stopVideo = () => {
    setIsScanning(false);
    setEnrollDetection(null);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
  };

  useEffect(() => {
    return () => stopVideo();
  }, []);

  const handleVideoPlay = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const displaySize = { width: videoRef.current.videoWidth, height: videoRef.current.videoHeight };
    faceapi.matchDimensions(canvasRef.current, displaySize);

    scanIntervalRef.current = setInterval(async () => {
      if (!videoRef.current || videoRef.current.paused || videoRef.current.ended || !isScanning) return;

      const detection = await faceapi.detectSingleFace(videoRef.current)
        .withFaceLandmarks()
        .withFaceDescriptor();

      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      if (detection) {
        const resizedDetection = faceapi.resizeResults(detection, displaySize);
        faceapi.draw.drawDetections(canvasRef.current, resizedDetection);
        faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetection);
        
        setEnrollDetection(detection);
        
        // Auto-capture up to 8 frames for better accuracy
        setCapturedFrames(prev => {
          if (prev.length < 8) {
            return [...prev, detection.descriptor];
          }
          return prev;
        });
      } else {
        setEnrollDetection(null);
      }
    }, 200);
  };

  const handleEnroll = async () => {
    if (capturedFrames.length === 0) return;
    setIsEnrolling(true);
    setError(null);
    
    try {
      // Average the descriptors for better accuracy
      let averagedDescriptor = new Float32Array(128);
      capturedFrames.forEach(desc => {
        for (let i = 0; i < 128; i++) {
          averagedDescriptor[i] += desc[i];
        }
      });
      for (let i = 0; i < 128; i++) {
        averagedDescriptor[i] /= capturedFrames.length;
      }

      const descriptorArray = Array.from(averagedDescriptor);

      // Capture a face snapshot image from the video feed
      let faceImage = null;
      if (videoRef.current) {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = videoRef.current.videoWidth;
        tempCanvas.height = videoRef.current.videoHeight;
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.drawImage(videoRef.current, 0, 0);
        faceImage = tempCanvas.toDataURL('image/jpeg', 0.6);
      }

      // Save to Firebase
      await addEnrolledFace({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        faceDescriptor: descriptorArray,
        faceImage: faceImage,
        createdAt: new Date().toISOString()
      });

      setSuccess("Face Enrollment Completed Successfully.");
      setFormData({ name: '', phone: '', email: '' });
      stopVideo();
      setCapturedFrames([]);
      
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      console.error(err);
      setError("Failed to enroll face. Please try again.");
    }
    setIsEnrolling(false);
  };

  return (
    <div className="space-y-6 pb-8 min-h-[80vh] flex flex-col font-sans">
      <div className="bg-[#131C33] border border-white/5 rounded-xl p-6 flex flex-col justify-between gap-4 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-[#F8FAFC]">Face Enrollment</h1>
          <p className="text-[#94A3B8] text-sm mt-1">Register a new employee's face for automated attendance tracking.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        
        {/* Form Panel */}
        <div className="bg-[#131C33] border border-white/5 rounded-xl overflow-hidden shadow-sm flex flex-col p-6 space-y-6">
          <h3 className="text-lg font-bold text-[#F8FAFC]">Employee Details</h3>
          
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#94A3B8] uppercase tracking-widest">Full Name *</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-[#0B1120] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-[#F8FAFC] focus:border-[#18E0FF] outline-none"
                placeholder="John Doe"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#94A3B8] uppercase tracking-widest">Mobile Number *</label>
              <input 
                type="text" 
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                className="w-full bg-[#0B1120] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-[#F8FAFC] focus:border-[#18E0FF] outline-none"
                placeholder="+91..."
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#94A3B8] uppercase tracking-widest">Email Address *</label>
              <input 
                type="email" 
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full bg-[#0B1120] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-[#F8FAFC] focus:border-[#18E0FF] outline-none"
                placeholder="employee@visioncare.com"
              />
            </div>

            {!isScanning ? (
              <button 
                onClick={startVideo} 
                disabled={!isModelLoaded}
                className="w-full mt-4 bg-[#18E0FF] text-[#0B1120] font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-[#18E0FF]/90 transition-colors shadow-[0_0_15px_rgba(24,224,255,0.4)] disabled:opacity-50"
              >
                <Camera size={18} /> Capture Face
              </button>
            ) : (
              <button 
                onClick={stopVideo} 
                className="w-full mt-4 bg-[#0B1120] text-[#FF4D6D] border border-[#FF4D6D]/20 font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-[#FF4D6D]/10 transition-colors"
              >
                Cancel Capture
              </button>
            )}
          </div>
          
          <div className="mt-auto bg-[#0B1120] p-4 rounded-lg border border-white/5">
            <h4 className="text-[10px] font-bold text-[#18E0FF] uppercase tracking-widest mb-2 flex items-center gap-2"><AlertCircle size={12}/> Instructions</h4>
            <ul className="text-xs text-[#94A3B8] space-y-1.5 list-disc pl-4">
              <li>Look straight at the camera.</li>
              <li>Ensure your face is fully visible.</li>
              <li>Keep good lighting.</li>
            </ul>
          </div>
        </div>

        {/* Camera Panel */}
        <div className="lg:col-span-2 bg-[#131C33] border border-white/5 rounded-xl overflow-hidden shadow-sm flex flex-col min-h-[500px]">
          <div className="p-4 border-b border-white/5 bg-[#0B1120]/50 flex justify-between items-center">
            <h3 className="text-sm font-bold text-[#F8FAFC] uppercase tracking-widest flex items-center gap-2">
              <Camera size={16} className="text-[#94A3B8]" /> Live Camera Preview
            </h3>
            {error && <span className="text-xs font-bold text-[#FF4D6D]">{error}</span>}
            {success && <span className="text-xs font-bold text-[#22C55E] flex items-center gap-1"><CheckCircle2 size={14}/> {success}</span>}
            {!isModelLoaded && !error && !success && (
              <span className="text-xs font-bold text-[#FACC15] flex items-center gap-2">
                <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-[#FACC15]"></span> {loadingText}
              </span>
            )}
          </div>
          
          <div className="relative flex-1 bg-black flex flex-col items-center justify-center">
            {!isScanning && !success && (
               <div className="text-[#94A3B8] flex flex-col items-center gap-4">
                 <UserPlus size={64} className="opacity-20" />
                 <p className="text-sm font-semibold uppercase tracking-widest">Click "Capture Face" to begin.</p>
               </div>
            )}
            
            {success && (
               <div className="text-[#22C55E] flex flex-col items-center gap-4">
                 <CheckCircle2 size={64} className="opacity-80 drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
                 <p className="text-lg font-bold">{success}</p>
               </div>
            )}

            <video 
              ref={videoRef}
              autoPlay 
              muted 
              onPlay={handleVideoPlay}
              className={`absolute inset-0 w-full h-full object-cover ${!isScanning ? 'hidden' : ''}`}
            />
            <canvas 
              ref={canvasRef}
              className={`absolute inset-0 w-full h-full object-cover pointer-events-none ${!isScanning ? 'hidden' : ''}`}
            />
            
            {isScanning && (
              <div className="absolute bottom-6 left-0 w-full flex flex-col items-center z-10 px-6">
                <div className="w-full max-w-md bg-[#0B1120]/80 backdrop-blur-md rounded-xl p-4 border border-white/10 flex flex-col items-center gap-3">
                  <div className="flex justify-between w-full text-xs font-bold text-[#94A3B8] uppercase tracking-widest">
                    <span>Face Samples</span>
                    <span>{capturedFrames.length} / 8</span>
                  </div>
                  <div className="w-full bg-[#131C33] h-2 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#18E0FF] transition-all duration-300"
                      style={{ width: `${(capturedFrames.length / 8) * 100}%` }}
                    ></div>
                  </div>
                  
                  {capturedFrames.length >= 8 && (
                    <motion.button 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={handleEnroll}
                      disabled={isEnrolling}
                      className="w-full mt-2 bg-[#22C55E] text-[#0B1120] font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-[#22C55E]/90 transition-colors shadow-[0_0_15px_rgba(34,197,94,0.4)]"
                    >
                      {isEnrolling ? <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#0B1120]"></span> : <Save size={18} />}
                      {isEnrolling ? 'Saving...' : 'Complete Enrollment'}
                    </motion.button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFace;
