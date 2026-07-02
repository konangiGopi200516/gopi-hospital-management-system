import React, { useState, useRef, useEffect } from 'react';
import { X, Send, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_KEY = import.meta.env.VITE_GROQ_API_KEY;

export default function VisionAIChat({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am Vision AI, your intelligent hospital management assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setMessages([
        { role: 'assistant', content: 'Hello! I am Vision AI, your intelligent hospital management assistant. How can I help you today?' }
      ]);
      setInput('');
      setLoading(false);
    }
  }, [isOpen]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Fetch live Firebase data
      const { getPatients, getStaff, getAppointments, getFaceAttendanceLog } = await import('../services/firebaseService');
      const { HOSPITAL_DATA } = await import('../utils/hospitalData');

      const [patients, staff, appointments, attendanceLogs] = await Promise.all([
        getPatients(),
        getStaff(),
        getAppointments(),
        getFaceAttendanceLog()
      ]);

      // Categorize staff
      const doctors   = staff.filter(s => s.category === 'Doctors').map(s => ({ name: s.name, specialty: s.specialty, attendance: s.attendance }));
      const nurses    = staff.filter(s => s.category === 'Nurses').map(s => ({ name: s.name, role: s.role, attendance: s.attendance, shift: s.shift }));
      const housekeep = staff.filter(s => s.category === 'Housekeeping').map(s => ({ name: s.name, role: s.role, attendance: s.attendance }));

      // Sanitize patients (no contact info)
      const sanitizedPatients = patients.map(p => ({
        id: p.id, name: p.name, status: p.status,
        disease: p.disease, doctor: p.doctor, room: p.room,
        admissionDate: p.admissionDate
      }));

      // Bed/ward stats from static hospital structure
      const wards = HOSPITAL_DATA.wards;
      const wardSummary = wards.map(w => {
        let total = 0, available = 0, occupied = 0, emergency = 0, housekeeping = 0;
        w.rooms.forEach(r => r.beds.forEach(b => {
          total++;
          if (b.state === 'available') available++;
          else if (b.state === 'occupied') occupied++;
          else if (b.state === 'emergency') emergency++;
          else if (b.state === 'housekeeping') housekeeping++;
        }));
        return { floor: w.floor, dept: w.dept, rooms: w.rooms.length, totalBeds: total, available, occupied, emergency, housekeeping };
      });
      const totalBeds = wardSummary.reduce((a, w) => a + w.totalBeds, 0);
      const totalAvailable = wardSummary.reduce((a, w) => a + w.available, 0);
      const totalOccupied = wardSummary.reduce((a, w) => a + w.occupied, 0);

      // Appointment breakdown
      const apptByStatus = appointments.reduce((acc, a) => { acc[a.status] = (acc[a.status] || 0) + 1; return acc; }, {});

      // Today's attendance
      const today = new Date().toISOString().split('T')[0];
      const todayLogs = attendanceLogs.filter(l => l.date === today || l.timestamp?.startsWith(today));

      const systemPrompt = `You are Vision AI, the official intelligent assistant for the VisionCare Eye Hospital Management System.
You have COMPLETE real-time knowledge of the hospital. Answer all questions accurately using the data below.
NEVER mention passwords. Be concise, professional and helpful.
IMPORTANT: Do NOT mention or report doctor availability counts per department (such as "7 Doctors, 4 Avail" per specialty). That information is not your data to share.

=== HOSPITAL OVERVIEW ===
Name: VisionCare Eye Hospital Management System
Speciality: Ophthalmology (Eye Care)
Admin Login: username is 'admin' (password is confidential)
Modules: Dashboard, Patients, Clinical Staff (Doctors), Nurses, Housekeeping, Recovery & Observation Wards, Appointments, Eye Diagnostics (Lab), Pharmacy & Optical Store, Vision & Diagnostic Reports, Payroll & Salary, Attendance, Face Enrollment, Face Attendance, System Settings

=== LIVE PATIENT DATA ===
Total Patients: ${sanitizedPatients.length}
Admitted: ${sanitizedPatients.filter(p => p.status === 'Admitted').length}
Critical: ${sanitizedPatients.filter(p => p.status === 'Critical').length}
Discharged: ${sanitizedPatients.filter(p => p.status === 'Discharged').length}
Patient List: ${JSON.stringify(sanitizedPatients)}

=== LIVE STAFF DATA ===
Total Doctors: ${doctors.length} | Present: ${doctors.filter(d => d.attendance !== 'Absent').length} | Absent: ${doctors.filter(d => d.attendance === 'Absent').length}
Doctors: ${JSON.stringify(doctors)}
Total Nurses: ${nurses.length}
Nurses: ${JSON.stringify(nurses)}
Total Housekeeping: ${housekeep.length}
Housekeeping Staff: ${JSON.stringify(housekeep)}

=== LIVE APPOINTMENTS ===
Total Appointments: ${appointments.length}
By Status: ${JSON.stringify(apptByStatus)}

=== WARD & BED DATA (Recovery & Observation Wards) ===
Total Beds in Hospital: ${totalBeds}
Available Beds: ${totalAvailable}
Occupied Beds: ${totalOccupied}
Ward Summary by Floor:
${wardSummary.map(w => `  - ${w.floor} | ${w.dept} | ${w.rooms} Rooms | ${w.totalBeds} Beds | ${w.available} Available | ${w.occupied} Occupied | ${w.emergency} ER | ${w.housekeeping} Housekeeping`).join('\n')}
Floors & Departments:
  - Ground Floor: Eye Emergency Ward (Prefix: ER)
  - First Floor: Recovery & Observation (Prefix: REC)
  - Second Floor: Retina & Vitreous (Prefix: RET)
  - Third Floor: Cataract Services (Prefix: CAT)
  - Fourth Floor: Eye Surgery Theatre / ICU (Prefix: OT)
Each floor has 5 rooms with 10 beds each (50 beds/floor, 250 total beds).
Each room has 1 assigned nurse and 1 assigned doctor.

=== ATTENDANCE (Face Recognition System) ===
Today's Face Attendance Logs (${today}): ${todayLogs.length} check-ins recorded
Staff enrolled in face recognition system: Available via Face Enrollment module

=== PAYROLL & SALARY ===
Payroll is managed per category: Doctors receive specialty-based salaries; Nurses and Housekeeping receive role-based salaries.
Payroll module shows: Name, Role, Salary, Bank details (admins only).

=== SYSTEM SETTINGS ===
Hospital settings include: Hospital name, contact info, address, email SMTP configuration for appointment notifications (via Node.js backend on port 3001).

=== TECH STACK ===
Frontend: React + Vite, TailwindCSS
Database: Firebase Realtime Database
AI: Groq LLaMA 3.1 (you!)
Backend: Node.js/Express for email notifications`;

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages.filter(m => m.role !== 'system'),
            userMessage
          ]
        })
      });

      const data = await response.json();
      if (data.error) {
        console.error("Groq API Error:", data.error);
        throw new Error(data.error.message || 'API Error');
      }
      if (data.choices && data.choices[0]) {
        setMessages(prev => [...prev, data.choices[0].message]);
      } else {
        throw new Error('Invalid response');
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error: ' + error.message }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-6 right-6 w-96 h-[500px] bg-[#0B1120] border border-[#18E0FF]/30 rounded-2xl shadow-[0_0_30px_rgba(24,224,255,0.15)] flex flex-col overflow-hidden z-[100]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-[#141D31] border-b border-white/5">
            <div className="flex items-center gap-3">
              <img src="/images/custom_ai_logo.png" alt="AI" className="w-8 h-8 rounded-full shadow-[0_0_10px_rgba(24,224,255,0.4)]" />
              <div>
                <h3 className="text-sm font-bold text-[#F8FAFC]">Vision AI</h3>
                <p className="text-[10px] text-[#18E0FF] font-semibold uppercase tracking-widest flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#18E0FF] animate-pulse"></span> Online
                </p>
              </div>
            </div>
            <button onClick={onClose} className="text-[#94A3B8] hover:text-white transition-colors bg-white/5 p-1.5 rounded-lg">
              <X size={16} />
            </button>
          </div>

          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-[#3B82F6]' : 'bg-[#18E0FF]/10 border border-[#18E0FF]/30'}`}>
                  {msg.role === 'user' ? <User size={14} className="text-white" /> : <img src="/images/custom_ai_logo.png" alt="AI" className="w-5 h-5 rounded-full" />}
                </div>
                <div className={`p-3 rounded-2xl max-w-[75%] text-sm shadow-sm ${msg.role === 'user' ? 'bg-[#3B82F6] text-white rounded-tr-sm' : 'bg-[#141D31] text-[#F8FAFC] border border-white/5 rounded-tl-sm'}`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-[#18E0FF]/10 border border-[#18E0FF]/30 flex items-center justify-center shrink-0">
                  <img src="/images/custom_ai_logo.png" alt="AI" className="w-5 h-5 rounded-full animate-pulse" />
                </div>
                <div className="p-3 rounded-2xl bg-[#141D31] text-[#94A3B8] border border-white/5 rounded-tl-sm text-sm flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-[#94A3B8] rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-[#94A3B8] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  <span className="w-1.5 h-1.5 bg-[#94A3B8] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-4 bg-[#141D31] border-t border-white/5 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Vision AI..."
              className="flex-1 bg-[#0B1120] border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#18E0FF]/50 transition-colors"
            />
            <button 
              type="submit" 
              disabled={loading || !input.trim()}
              className="bg-[#18E0FF] hover:bg-[#18E0FF]/80 disabled:opacity-50 text-[#0B1120] w-10 h-10 rounded-xl flex items-center justify-center transition-colors shadow-[0_0_10px_rgba(24,224,255,0.2)]"
            >
              <Send size={16} className="ml-1" />
            </button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
