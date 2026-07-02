import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, CheckCircle2, UserCheck, AlertCircle, ScanFace } from 'lucide-react';
import * as faceapi from 'face-api.js';
import { getEnrolledFaces, addFaceAttendanceLog } from '../services/firebaseService';

const FaceAttendance = () => {
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [loadingText, setLoadingText] = useState('Loading Face API Models...');
  const [isScanning, setIsScanning] = useState(false);
  const [labeledFaceDescriptors, setLabeledFaceDescriptors] = useState(null);
  const [attendanceLog, setAttendanceLog] = useState([]);
  const [error, setError] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const scanIntervalRef = useRef(null);

  // 1. Load Models & Enrolled Faces
  useEffect(() => {
    const loadData = async () => {
      try {
        const MODEL_URL = 'https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@master/weights';
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
        ]);
        
        setLoadingText('Fetching Enrolled Faces...');
        const faces = await getEnrolledFaces();
        
        const descriptors = faces.map(face => {
           if (face.faceDescriptor) {
             return new faceapi.LabeledFaceDescriptors(
               JSON.stringify({ name: face.name, phone: face.phone, email: face.email }), 
               [new Float32Array(face.faceDescriptor)]
             );
           }
           return null;
        }).filter(d => d !== null);

        if (descriptors.length > 0) {
          setLabeledFaceDescriptors(descriptors);
        } else {
           console.warn("No enrolled faces found in the database.");
        }
        
        setIsModelLoaded(true);
        startVideo(); // Automatically start video
      } catch (err) {
        console.error("Error loading models/faces:", err);
        setError("System initialization failed. Check connection.");
      }
    };
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2. Video Control
  const startVideo = () => {
    setIsScanning(true);
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => {
        console.error("Error accessing webcam:", err);
        setError("Could not access webcam.");
        setIsScanning(false);
      });
  };

  const stopVideo = () => {
    setIsScanning(false);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
  };

  useEffect(() => {
    return () => stopVideo();
  }, []);

  // 3. Handle Video Play & Realtime Recognition
  const handleVideoPlay = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const displaySize = { width: videoRef.current.videoWidth, height: videoRef.current.videoHeight };
    faceapi.matchDimensions(canvasRef.current, displaySize);

    const faceMatcher = labeledFaceDescriptors 
       ? new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6)
       : null;

    scanIntervalRef.current = setInterval(async () => {
      if (!videoRef.current || videoRef.current.paused || videoRef.current.ended) return;

      const detections = await faceapi.detectAllFaces(videoRef.current)
        .withFaceLandmarks()
        .withFaceDescriptors();

      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
      faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);

      if (faceMatcher) {
        const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor));
        results.forEach((result, i) => {
          const box = resizedDetections[i].detection.box;
          
          let displayName = 'Unknown Person - Attendance Not Marked.';
          
          if (result.label !== 'unknown') {
            try {
              const data = JSON.parse(result.label);
              displayName = data.name;
              logAttendance(data, result.distance);
            } catch(e) {}
          } else {
             // Log unknown attempt
             logUnknown();
          }

          const drawBox = new faceapi.draw.DrawBox(box, { label: displayName });
          drawBox.draw(canvasRef.current);
        });
      } else {
        resizedDetections.forEach((d) => {
          const box = d.detection.box;
          const drawBox = new faceapi.draw.DrawBox(box, { label: 'Unknown Person - Attendance Not Marked.' });
          drawBox.draw(canvasRef.current);
        });
      }
    }, 500);
  };

  const logUnknown = () => {
    setAttendanceLog(prev => {
      const lastEntry = prev[0];
      if (lastEntry && lastEntry.name === 'Unknown Person' && (new Date() - lastEntry.time) < 5000) {
        return prev;
      }
      return [{ 
         name: 'Unknown Person', 
         status: 'Unknown Person - Attendance Not Marked.', 
         time: new Date(), 
         success: false 
      }, ...prev].slice(0, 50);
    });
  };

  const logAttendance = async (userData, distance) => {
    const today = new Date().toISOString().split('T')[0];
    const confidenceScore = ((1 - distance) * 100).toFixed(2);

    setAttendanceLog(prev => {
      // Prevent duplicate entry for same person today
      const alreadyLoggedToday = prev.some(entry => entry.name === userData.name && entry.date === today && entry.success);
      if (alreadyLoggedToday) return prev;

      const newEntry = { 
        name: userData.name,
        phone: userData.phone,
        email: userData.email,
        date: today,
        time: new Date(),
        status: 'Present',
        confidenceScore: `${confidenceScore}%`,
        success: true,
        message: 'Face Recognized Successfully.'
      };

      // Push to Firebase asynchronously
      addFaceAttendanceLog({
        fullName: userData.name,
        mobileNumber: userData.phone,
        email: userData.email,
        checkInTime: newEntry.time.toISOString(),
        status: 'Present',
        date: today,
        confidenceScore: newEntry.confidenceScore,
        timestamp: new Date().toISOString()
      }).catch(err => console.error("Failed to log attendance to database:", err));

      return [newEntry, ...prev].slice(0, 50);
    });
  };

  return (
    <div className="space-y-6 pb-8 min-h-screen font-sans flex flex-col">
      {/* Header */}
      <div className="bg-[#131C33] border border-white/5 rounded-xl p-6 flex flex-col xl:flex-row xl:items-center justify-between gap-4 shadow-sm">
         <div className="flex flex-col">
           <h1 className="text-xl font-bold text-[#F8FAFC] flex items-center gap-3">
             <ScanFace className="text-[#18E0FF]" size={24} />
             Face Attendance Scanner
           </h1>
           <p className="text-[#94A3B8] text-sm mt-1">Automatic real-time face detection and attendance logging.</p>
         </div>
      </div>

      {error && (
        <div className="bg-[#FF4D6D]/10 border border-[#FF4D6D]/20 text-[#FF4D6D] p-4 rounded-xl flex items-center gap-3">
          <AlertCircle size={20} />
          <p className="text-sm font-semibold">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        {/* Scanner Window */}
        <div className="lg:col-span-2 bg-[#131C33] border border-white/5 rounded-xl overflow-hidden shadow-sm flex flex-col min-h-[500px]">
          <div className="p-4 border-b border-white/5 bg-[#0B1120]/50 flex justify-between items-center">
            <h3 className="text-sm font-bold text-[#F8FAFC] uppercase tracking-widest flex items-center gap-2">
              <Camera size={16} className="text-[#94A3B8]" /> Live Camera Feed
            </h3>
            <div className="flex items-center gap-4">
              {!isModelLoaded && (
                <span className="text-xs font-bold text-[#FACC15] flex items-center gap-2">
                  <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-[#FACC15]"></span> {loadingText}
                </span>
              )}
              {isModelLoaded && !isScanning && (
                <span className="text-xs font-bold text-[#94A3B8]">Camera Offline</span>
              )}
              {isModelLoaded && isScanning && (
                <span className="text-xs font-bold text-[#22C55E] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse"></span> Scanning...
                </span>
              )}
              {isModelLoaded && (
                <button
                  onClick={isScanning ? stopVideo : startVideo}
                  className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${
                    isScanning 
                      ? 'bg-[#FF4D6D]/10 text-[#FF4D6D] hover:bg-[#FF4D6D]/20 border border-[#FF4D6D]/20' 
                      : 'bg-[#18E0FF]/10 text-[#18E0FF] hover:bg-[#18E0FF]/20 border border-[#18E0FF]/20'
                  }`}
                >
                  {isScanning ? 'STOP SCANNER' : 'START SCANNER'}
                </button>
              )}
            </div>
          </div>
          
          <div className="relative flex-1 bg-black flex items-center justify-center">
            {!isScanning && isModelLoaded && (
               <div className="text-[#94A3B8] flex flex-col items-center gap-4">
                 <ScanFace size={64} className="opacity-20" />
                 <p className="text-sm font-semibold uppercase tracking-widest">Scanner is offline.</p>
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
          </div>
        </div>

        {/* Live Attendance Log */}
        <div className="bg-[#131C33] border border-white/5 rounded-xl overflow-hidden shadow-sm flex flex-col h-full max-h-[700px]">
          <div className="p-4 border-b border-white/5 bg-[#0B1120]/50">
            <h3 className="text-sm font-bold text-[#F8FAFC] uppercase tracking-widest flex items-center gap-2">
              <UserCheck size={16} className="text-[#18E0FF]" /> Attendance Record
            </h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-3">
            <AnimatePresence>
              {attendanceLog.map((log, index) => (
                <motion.div
                  key={`${log.name}-${log.time.getTime()}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`bg-[#0B1120] border p-4 rounded-lg flex items-start gap-4 ${log.success ? 'border-[#22C55E]/20 shadow-[0_0_15px_rgba(34,197,94,0.05)]' : 'border-[#FF4D6D]/20 shadow-[0_0_15px_rgba(255,77,109,0.05)]'}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${log.success ? 'bg-[#22C55E]/10 text-[#22C55E]' : 'bg-[#FF4D6D]/10 text-[#FF4D6D]'}`}>
                     {log.success ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-bold truncate ${log.success ? 'text-[#F8FAFC]' : 'text-[#FF4D6D]'}`}>{log.name}</p>
                    {log.success ? (
                      <>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#22C55E] mt-0.5">{log.message}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-[10px] text-[#94A3B8] bg-white/5 px-1.5 py-0.5 rounded">Status: {log.status}</span>
                          <span className="text-[10px] text-[#94A3B8] bg-white/5 px-1.5 py-0.5 rounded">Score: {log.confidenceScore}</span>
                        </div>
                      </>
                    ) : (
                      <p className="text-[10px] font-bold text-[#FF4D6D] mt-0.5">{log.status}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold text-[#94A3B8]">{log.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {attendanceLog.length === 0 && (
               <div className="h-full flex flex-col items-center justify-center text-[#94A3B8] opacity-50 space-y-3 min-h-[200px]">
                 <UserCheck size={48} />
                 <p className="text-xs font-bold uppercase tracking-widest text-center">Waiting for scans...</p>
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaceAttendance;
