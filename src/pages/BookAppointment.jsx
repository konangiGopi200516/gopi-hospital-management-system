import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, Phone, Mail, Clock, CheckCircle } from 'lucide-react';
import { services, allDoctors } from '../data/mockData';
import { getStaff, addAppointment } from '../services/firebaseService';

const BookAppointment = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    department: '',
    doctorId: '',
    date: '',
    time: '',
    patientName: '',
    phone: '',
    email: '',
    symptoms: '',
  });
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const staff = await getStaff();
        const firebaseDoctors = staff.filter(emp => emp.category === 'Doctors');
        
        // Merge mock doctors and firebase doctors to ensure the dropdown always has options
        const mergedDoctors = [...allDoctors];
        
        firebaseDoctors.forEach(fDoc => {
          if (!mergedDoctors.find(m => m.name === fDoc.name)) {
            mergedDoctors.push(fDoc);
          }
        });
        
        setDoctors(mergedDoctors);
      } catch (error) {
        console.error("Failed to fetch doctors:", error);
        setDoctors(allDoctors);
      }
    };
    fetchDoctors();
  }, []);

  const availableDoctors = formData.department 
    ? doctors.filter(d => d.department === formData.department || d.specialty === formData.department)
    : doctors;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const docObj = doctors.find(d => d.id === formData.doctorId || d.firebaseId === formData.doctorId);
    const docName = docObj ? docObj.name : 'Unknown Doctor';
    
    const newRequest = {
      patient: formData.patientName,
      phone: formData.phone,
      email: formData.email,
      dept: formData.department,
      docId: formData.doctorId,
      doc: docName,
      docEmail: docObj ? docObj.email : '',
      date: formData.date,
      time: formData.time,
      symptoms: formData.symptoms,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    try {
      await addAppointment(newRequest);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert("Failed to book appointment. Please try again.");
    }
  };

  if (isSubmitted) {
    return (
      <div className="py-20 bg-[#0B1120] min-h-[80vh] flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-[#141D31] p-8 rounded-2xl border border-[#22C55E]/30 text-center"
        >
          <div className="w-20 h-20 bg-[#22C55E]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-[#22C55E]" />
          </div>
          <h2 className="text-2xl font-bold text-[#F8FAFC] mb-4">Request Submitted!</h2>
          <p className="text-[#94A3B8] mb-8">
            Your appointment request has been sent to the doctor. You will receive a confirmation once the doctor accepts your OP request.
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="w-full btn-primary py-3 rounded-xl font-bold tracking-widest uppercase text-sm"
          >
            Return to Home
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="py-20 bg-[#0B1120] min-h-screen">
      <div className="container mx-auto px-6 max-w-3xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#F8FAFC] mb-4">Schedule</h1>
          <p className="text-[#94A3B8]">Request an outpatient consultation. The selected doctor will review and accept your request.</p>
        </div>

        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="bg-[#141D31] border border-white/5 p-8 rounded-2xl shadow-2xl space-y-6"
        >
          {/* Department & Doctor */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-[#94A3B8] mb-2 uppercase tracking-wider">Department</label>
              <select 
                required
                className="w-full bg-[#0B1120] border border-white/10 rounded-xl px-4 py-3 text-[#F8FAFC] focus:outline-none focus:border-[#18E0FF]/50 transition-colors"
                value={formData.department}
                onChange={(e) => setFormData({...formData, department: e.target.value, doctorId: ''})}
              >
                <option value="">Select Department</option>
                {services.map(s => (
                  <option key={s.title} value={s.title}>{s.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-[#94A3B8] mb-2 uppercase tracking-wider">Select Doctor</label>
              <select 
                required
                disabled={!formData.department}
                className="w-full bg-[#0B1120] border border-white/10 rounded-xl px-4 py-3 text-[#F8FAFC] focus:outline-none focus:border-[#18E0FF]/50 transition-colors disabled:opacity-50"
                value={formData.doctorId}
                onChange={(e) => setFormData({...formData, doctorId: e.target.value})}
              >
                <option value="">Choose a Doctor</option>
                {availableDoctors.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-[#94A3B8] mb-2 uppercase tracking-wider">Preferred Date</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={18} />
                <input 
                  type="date" 
                  required
                  className="w-full bg-[#0B1120] border border-white/10 rounded-xl pl-12 pr-4 py-3 text-[#F8FAFC] focus:outline-none focus:border-[#18E0FF]/50 transition-colors"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-[#94A3B8] mb-2 uppercase tracking-wider">Preferred Time</label>
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={18} />
                <input 
                  type="time" 
                  required
                  className="w-full bg-[#0B1120] border border-white/10 rounded-xl pl-12 pr-4 py-3 text-[#F8FAFC] focus:outline-none focus:border-[#18E0FF]/50 transition-colors"
                  value={formData.time}
                  onChange={(e) => setFormData({...formData, time: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* Patient Details */}
          <div className="space-y-6 pt-4 border-t border-white/5">
            <div>
              <label className="block text-sm font-bold text-[#94A3B8] mb-2 uppercase tracking-wider">Patient Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={18} />
                <input 
                  type="text" 
                  required
                  placeholder="John Doe"
                  className="w-full bg-[#0B1120] border border-white/10 rounded-xl pl-12 pr-4 py-3 text-[#F8FAFC] focus:outline-none focus:border-[#18E0FF]/50 transition-colors"
                  value={formData.patientName}
                  onChange={(e) => setFormData({...formData, patientName: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-[#94A3B8] mb-2 uppercase tracking-wider">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={18} />
                  <input 
                    type="tel" 
                    required
                    placeholder="+1 (555) 000-0000"
                    className="w-full bg-[#0B1120] border border-white/10 rounded-xl pl-12 pr-4 py-3 text-[#F8FAFC] focus:outline-none focus:border-[#18E0FF]/50 transition-colors"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-[#94A3B8] mb-2 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={18} />
                  <input 
                    type="email" 
                    required
                    placeholder="john@example.com"
                    className="w-full bg-[#0B1120] border border-white/10 rounded-xl pl-12 pr-4 py-3 text-[#F8FAFC] focus:outline-none focus:border-[#18E0FF]/50 transition-colors"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#94A3B8] mb-2 uppercase tracking-wider">Symptoms / Reason for Visit</label>
              <textarea 
                required
                rows="3"
                placeholder="Briefly describe your symptoms..."
                className="w-full bg-[#0B1120] border border-white/10 rounded-xl px-4 py-3 text-[#F8FAFC] focus:outline-none focus:border-[#18E0FF]/50 transition-colors resize-none"
                value={formData.symptoms}
                onChange={(e) => setFormData({...formData, symptoms: e.target.value})}
              ></textarea>
            </div>
          </div>

          <div className="pt-6">
            <button type="submit" className="w-full btn-primary py-4 rounded-xl font-bold tracking-widest uppercase text-sm">
              Submit Appointment Request
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default BookAppointment;
