import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { allDoctors } from '../data/mockData';
import { addPatient, getPatients } from '../services/firebaseService';

export const defaultPatients = [];

const wardBeds = {
  'Day Care': Array.from({ length: 15 }, (_, i) => `DC-${String(i + 1).padStart(2, '0')}`),
  'General Eye': Array.from({ length: 30 }, (_, i) => `GE-${String(i + 1).padStart(2, '0')}`),
  'Retina': Array.from({ length: 12 }, (_, i) => `RET-${String(i + 1).padStart(2, '0')}`),
  'Cornea': Array.from({ length: 12 }, (_, i) => `COR-${String(i + 1).padStart(2, '0')}`),
  'Pediatric Eye': Array.from({ length: 10 }, (_, i) => `PED-${String(i + 1).padStart(2, '0')}`),
  'Ophthalmic ICU': Array.from({ length: 6 }, (_, i) => `ICU-${String(i + 1).padStart(2, '0')}`)
};

const Receptionist = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('receptionist_auth') === 'true';
  });
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '', age: '', gender: 'M', bloodGroup: 'O+', doctor: '', ward: 'Day Care', bed: '', phone: '', problem: ''
  });
  const [successMsg, setSuccessMsg] = useState('');

  const handleAuth = (e) => {
    e.preventDefault();
    if (accessCode === '2300031854') {
      setIsAuthenticated(true);
      localStorage.setItem('receptionist_auth', 'true');
      setError('');
    } else {
      setError('Invalid Access Code. Please try again.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('receptionist_auth');
    setAccessCode('');
  };

  const handleAddPatient = async (e) => {
    e.preventDefault();
    
    // Fallback ID generation in case getPatients fails
    let patientCount = 0;
    try {
      const stored = await getPatients();
      patientCount = stored.length;
    } catch (err) {
      console.warn("Could not fetch patients for ID generation, using random fallback");
      patientCount = Math.floor(Math.random() * 1000);
    }

    const newPatient = {
      id: `PT-${1042 + patientCount}`,
      ...formData,
      status: 'Admitted',
      admissionDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit' })
    };
    
    try {
      await addPatient(newPatient);
      // Also update localStorage as a backup cache if needed
      const localStored = JSON.parse(localStorage.getItem('visionCare_patients')) || [];
      localStorage.setItem('visionCare_patients', JSON.stringify([newPatient, ...localStored]));
      
      setSuccessMsg(`Success! Patient ${formData.name} added with ID: ${newPatient.id}`);
      setTimeout(() => setSuccessMsg(''), 8000);
      
      setFormData({ name: '', age: '', gender: 'M', bloodGroup: 'O+', doctor: '', ward: 'Day Care', bed: '', phone: '', problem: '' });
    } catch (error) {
      console.error("Error adding patient to Firebase:", error);
      alert("Failed to add patient. Please check your connection.");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="py-24 bg-[#0B1120] min-h-[calc(100vh-80px)] flex items-center justify-center p-6 relative">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#18E0FF]/10 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#8B5CF6]/10 rounded-full blur-[100px] pointer-events-none"></div>
        </div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-[#141D31]/80 backdrop-blur-xl rounded-3xl border border-white/5 shadow-2xl p-8 text-center relative z-10"
        >
          <div className="w-16 h-16 bg-[#18E0FF]/10 rounded-2xl mx-auto flex items-center justify-center mb-6 border border-[#18E0FF]/20 shadow-[0_0_15px_rgba(24,224,255,0.2)]">
            <span className="text-[#18E0FF] font-bold text-2xl">🔒</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Receptionist Access</h2>
          <p className="text-[#94A3B8] mb-8 text-sm">Please enter your authorized security code.</p>
          
          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <input 
                type="password"
                placeholder="Enter Access Code"
                className="w-full bg-[#0B1120] border border-white/5 rounded-xl px-4 py-4 text-[#F8FAFC] focus:outline-none focus:border-[#18E0FF]/50 transition-colors text-center tracking-widest text-lg"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                autoFocus
              />
              {error && <p className="text-[#FF296D] text-sm mt-3 font-semibold">{error}</p>}
            </div>
            <button type="submit" className="w-full py-4 bg-gradient-to-r from-[#18E0FF] to-[#00B4D8] hover:from-[#00B4D8] hover:to-[#0096B4] text-[#0B1120] font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(24,224,255,0.3)] uppercase tracking-widest mt-2">
              Unlock Portal
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-6 relative">
      {/* Background Decor */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#18E0FF]/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#8B5CF6]/10 rounded-full blur-[100px] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="w-full max-w-3xl bg-[#141D31]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative z-10"
      >
        <div className="flex items-start justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-[#F8FAFC] mb-2">Receptionist Portal</h2>
            <p className="text-[#94A3B8]">Quickly admit new patients and assign doctors to the system.</p>
          </div>
          <button 
            onClick={handleLogout}
            className="px-4 py-2 bg-[#FF296D]/10 text-[#FF296D] border border-[#FF296D]/20 rounded-lg hover:bg-[#FF296D]/20 transition-colors font-bold text-sm tracking-wider uppercase shrink-0"
          >
            Lock Portal
          </button>
        </div>

        {successMsg && (
          <div className="mb-6 p-4 bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E] rounded-xl flex items-center justify-between shadow-[0_0_15px_rgba(34,197,94,0.1)]">
            <span className="font-bold tracking-wide">{successMsg}</span>
            <button onClick={() => setSuccessMsg('')} className="text-[#22C55E] hover:text-white transition-colors text-xl font-bold leading-none">
              &times;
            </button>
          </div>
        )}

        <form onSubmit={handleAddPatient} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-[#94A3B8] mb-2">Patient Full Name</label>
              <input required type="text" className="w-full bg-[#0B1120] border border-white/5 rounded-xl px-4 py-3 text-[#F8FAFC] focus:outline-none focus:border-[#18E0FF]/50 transition-colors" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. John Doe" />
            </div>
            
            <div className="grid grid-cols-2 gap-4 md:col-span-1">
              <div>
                <label className="block text-sm font-semibold text-[#94A3B8] mb-2">Age</label>
                <input required type="number" min="0" max="150" className="w-full bg-[#0B1120] border border-white/5 rounded-xl px-4 py-3 text-[#F8FAFC] focus:outline-none focus:border-[#18E0FF]/50 transition-colors" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} placeholder="Years" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#94A3B8] mb-2">Gender</label>
                <select required className="w-full bg-[#0B1120] border border-white/5 rounded-xl px-4 py-3 text-[#F8FAFC] focus:outline-none focus:border-[#18E0FF]/50 transition-colors appearance-none" value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-[#94A3B8] mb-2">Blood Group</label>
              <select required className="w-full bg-[#0B1120] border border-white/5 rounded-xl px-4 py-3 text-[#F8FAFC] focus:outline-none focus:border-[#18E0FF]/50 transition-colors appearance-none" value={formData.bloodGroup} onChange={e => setFormData({...formData, bloodGroup: e.target.value})}>
                <option value="O+">O+</option><option value="O-">O-</option><option value="A+">A+</option><option value="A-">A-</option>
                <option value="B+">B+</option><option value="B-">B-</option><option value="AB+">AB+</option><option value="AB-">AB-</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-[#94A3B8] mb-2">Contact Phone</label>
              <input required type="text" className="w-full bg-[#0B1120] border border-white/5 rounded-xl px-4 py-3 text-[#F8FAFC] focus:outline-none focus:border-[#18E0FF]/50 transition-colors" placeholder="+1 (555) 000-0000" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>

            <div className="md:col-span-2 pt-6 border-t border-white/5 mt-2">
              <h4 className="text-sm font-bold text-[#F8FAFC] uppercase tracking-widest mb-6">Medical Details & Assignment</h4>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-[#94A3B8] mb-2">Chief Complaint / Problem</label>
              <textarea required className="w-full bg-[#0B1120] border border-white/5 rounded-xl px-4 py-3 text-[#F8FAFC] focus:outline-none focus:border-[#18E0FF]/50 transition-colors" rows="2" placeholder="Describe the patient's symptoms or problem..." value={formData.problem} onChange={e => setFormData({...formData, problem: e.target.value})}></textarea>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-[#94A3B8] mb-2">Assign Doctor</label>
              <select required className="w-full bg-[#0B1120] border border-white/5 rounded-xl px-4 py-3 text-[#F8FAFC] focus:outline-none focus:border-[#18E0FF]/50 transition-colors appearance-none" value={formData.doctor} onChange={e => setFormData({...formData, doctor: e.target.value})}>
                <option value="">Select an available doctor</option>
                {allDoctors.map(doc => (
                  <option key={doc.id} value={doc.name}>{doc.name} - {doc.specialty}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#94A3B8] mb-2">Admit to Ward</label>
              <select required className="w-full bg-[#0B1120] border border-white/5 rounded-xl px-4 py-3 text-[#F8FAFC] focus:outline-none focus:border-[#18E0FF]/50 transition-colors appearance-none" value={formData.ward} onChange={e => setFormData({...formData, ward: e.target.value, bed: ''})}>
                <option value="Day Care">Day Care / Recovery</option>
                <option value="General Eye">General Eye Ward</option>
                <option value="Retina">Retina Ward</option>
                <option value="Cornea">Cornea Ward</option>
                <option value="Pediatric Eye">Pediatric Eye Ward</option>
                <option value="Ophthalmic ICU">Ophthalmic ICU</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#94A3B8] mb-2">Bed Number</label>
              <select required className="w-full bg-[#0B1120] border border-white/5 rounded-xl px-4 py-3 text-[#F8FAFC] focus:outline-none focus:border-[#18E0FF]/50 transition-colors appearance-none" value={formData.bed} onChange={e => setFormData({...formData, bed: e.target.value})}>
                <option value="">Select a bed</option>
                {wardBeds[formData.ward]?.map(bed => (
                  <option key={bed} value={bed}>{bed}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-8">
            <button type="submit" className="w-full py-4 bg-gradient-to-r from-[#18E0FF] to-[#00B4D8] hover:from-[#00B4D8] hover:to-[#0096B4] text-[#0B1120] font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(24,224,255,0.3)] uppercase tracking-widest">
              Admit Patient
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Receptionist;
