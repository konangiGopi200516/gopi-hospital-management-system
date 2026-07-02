import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Search, CheckCircle, Clock } from 'lucide-react';
import { getAppointments, updateAppointmentStatus } from '../services/firebaseService';

const AdminAppointments = () => {
  const [requests, setRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadRequests = async () => {
      try {
        const data = await getAppointments();
        setRequests(data);
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
      }
    };
    
    loadRequests();
    const dataTimer = setInterval(loadRequests, 5000);
    return () => clearInterval(dataTimer);
  }, []);

  const handleAcceptRequest = async (reqId, firebaseId) => {
    const request = requests.find(r => r.firebaseId === firebaseId || r.id === reqId);
    
    if (request && request.status === 'pending') {
      try {
        // Try to update on Firebase
        if (firebaseId) {
          await updateAppointmentStatus(firebaseId, 'accepted');
        }
        
        // Mock email logic
        try {
          const response = await fetch('http://localhost:3001/api/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request)
          });
          const data = await response.json();
          if (!response.ok || !data.success) {
            throw new Error(data.error || 'Failed to send email from server');
          }
          alert('Appointment accepted! Confirmation email sent to the patient.');
        } catch (emailError) {
          console.error("Failed to send email", emailError);
          alert(`Failed to send confirmation email. However, the appointment has been accepted.`);
        }
        
        // Update local state immediately
        const updated = requests.map(r => r.firebaseId === firebaseId || r.id === reqId ? { ...r, status: 'accepted' } : r);
        setRequests(updated);

      } catch (error) {
        console.error("Failed to accept appointment", error);
        alert("Failed to accept appointment. Please try again.");
      }
    }
  };

  const filteredRequests = requests.filter(req => 
    (req.patient || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
    (req.phone || '').includes(searchQuery) ||
    (req.doc || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-8 font-sans h-full flex flex-col">
      <div className="bg-[#131C33] border border-white/5 rounded-xl p-6 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-[#F8FAFC] flex items-center gap-3">
            <Calendar className="text-[#18E0FF]" size={24} /> 
            Appointment Management
          </h1>
          <p className="text-[#94A3B8] text-sm mt-1">Review and manage all outpatient scheduling requests.</p>
        </div>
        
        <div className="relative group w-full sm:w-72">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#94A3B8] group-focus-within:text-[#18E0FF]">
            <Search size={16} />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by patient, phone, or doctor..."
            className="w-full bg-[#0B1120] border border-white/5 text-[#F8FAFC] text-sm font-semibold px-4 py-2.5 pl-10 rounded-xl outline-none focus:border-[#18E0FF] transition-colors"
          />
        </div>
      </div>

      <div className="flex-1 bg-[#131C33] border border-white/5 rounded-xl flex flex-col overflow-hidden shadow-sm">
        <div className="p-4 border-b border-white/5 bg-[#0B1120]/50 flex justify-between items-center">
          <h2 className="text-sm font-bold text-[#F8FAFC] tracking-widest uppercase">All Requests</h2>
          <div className="flex gap-4 text-xs font-bold uppercase tracking-widest">
            <span className="text-[#94A3B8]">Total: <span className="text-[#F8FAFC]">{requests.length}</span></span>
            <span className="text-[#94A3B8]">Pending: <span className="text-[#FACC15]">{requests.filter(r => r.status === 'pending').length}</span></span>
          </div>
        </div>

        <div className="flex-1 overflow-auto custom-scrollbar p-4">
          <div className="space-y-3">
            {filteredRequests.length > 0 ? filteredRequests.map(req => (
              <div key={req.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-[#0B1120]/50 border border-white/5 rounded-xl hover:bg-[#0B1120] transition-colors gap-4">
                <div className="flex items-center gap-4 min-w-[200px]">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${req.status === 'pending' ? 'bg-[#FACC15]/10 text-[#FACC15]' : 'bg-[#22C55E]/10 text-[#22C55E]'}`}>
                    {req.status === 'pending' ? <Clock size={24} /> : <CheckCircle size={24} />}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#F8FAFC]">{req.patient}</h3>
                    <p className="text-xs text-[#94A3B8] font-semibold">{req.phone}</p>
                  </div>
                </div>

                <div className="flex flex-col min-w-[150px]">
                  <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-0.5">Assigned To</span>
                  <span className="text-sm font-semibold text-[#18E0FF]">{req.doc}</span>
                  <span className="text-xs font-semibold text-[#94A3B8]">{req.dept}</span>
                </div>

                <div className="flex flex-col min-w-[150px]">
                  <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-0.5">Schedule</span>
                  <span className="text-sm font-semibold text-[#F8FAFC]">{req.date}</span>
                  <span className="text-xs font-semibold text-[#94A3B8]">{req.time}</span>
                </div>

                <div className="flex items-center justify-end min-w-[150px]">
                  {req.status === 'pending' ? (
                    <button 
                      onClick={() => handleAcceptRequest(req.id, req.firebaseId)}
                      className="w-full md:w-auto px-6 py-2.5 bg-[#18E0FF]/10 hover:bg-[#18E0FF]/20 text-[#18E0FF] border border-[#18E0FF]/20 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-[0_0_10px_rgba(24,224,255,0.1)]"
                    >
                      Accept
                    </button>
                  ) : (
                    <div className="w-full md:w-auto px-6 py-2.5 bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                      <CheckCircle size={14} /> Accepted
                    </div>
                  )}
                </div>
              </div>
            )) : (
              <div className="text-center py-20 text-[#94A3B8]">
                <Calendar size={48} className="mx-auto mb-4 opacity-20" />
                <p className="text-lg font-bold text-[#F8FAFC]">No requests found.</p>
                <p className="text-sm mt-1">There are no appointments matching your search.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAppointments;
