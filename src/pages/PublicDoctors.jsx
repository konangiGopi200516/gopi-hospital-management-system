import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Stethoscope, Mail, Phone, Search, Filter } from 'lucide-react';
import { allDoctors, services } from '../data/mockData';

const getInitials = (name) => {
  const parts = name.replace('Dr. ', '').split(' ');
  return parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : parts[0][0].toUpperCase();
};

const PublicDoctors = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [activeRequests, setActiveRequests] = useState({});

  useEffect(() => {
    const checkRealRequests = async () => {
      try {
        const { getAppointments } = await import('../services/firebaseService');
        const stored = await getAppointments();
        const active = {};
        stored.forEach(req => {
          if (req.status === 'pending' && req.docId) {
            active[req.docId] = true;
          }
        });
        setActiveRequests(active);
      } catch (err) {
        console.error("Failed to fetch active requests:", err);
      }
    };

    checkRealRequests();
    const interval = setInterval(checkRealRequests, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleDoctorAccept = async (docId) => {
    try {
      const { getAppointments, updateAppointmentStatus } = await import('../services/firebaseService');
      const stored = await getAppointments();
      const request = stored.find(req => req.docId === docId && req.status === 'pending');
      
      if (request) {
        if (request.firebaseId) {
          await updateAppointmentStatus(request.firebaseId, 'accepted');
        }
        
        // Optional email mock logic
        try {
          fetch('http://localhost:3001/api/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request)
          });
        } catch (e) {}
        
        setActiveRequests(prev => ({ ...prev, [docId]: false }));
        alert('Appointment accepted! Confirmation email sent to the patient.');
      }
    } catch (error) {
      console.error("Failed to process acceptance", error);
      alert(`Failed to accept appointment. Please try again.`);
    }
  };

  const filteredDoctors = useMemo(() => {
    return allDoctors.filter(doc => {
      const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            doc.specialty.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDept = selectedDept === 'All' || doc.specialty === selectedDept;
      return matchesSearch && matchesDept;
    });
  }, [searchQuery, selectedDept]);

  // Group by department
  const groupedDoctors = useMemo(() => {
    const groups = {};
    filteredDoctors.forEach(doc => {
      if (!groups[doc.specialty]) {
        groups[doc.specialty] = [];
      }
      groups[doc.specialty].push(doc);
    });
    return groups;
  }, [filteredDoctors]);

  return (
    <div className="py-12 bg-[#0B1120] min-h-screen relative">
      <div className="container mx-auto px-6 relative z-10 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#F8FAFC]">Doctors Directory</h1>
          <p className="text-[#94A3B8] max-w-2xl mx-auto text-lg">Full searchable roster of all our expert doctors.</p>
        </div>
        
        {/* Search & Filter Bar */}
        <div className="bg-[#141D31] p-4 rounded-2xl border border-white/5 shadow-xl flex flex-col md:flex-row gap-4 mb-12">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={20} />
            <input 
              type="text" 
              placeholder="Search doctors by name or department..."
              className="w-full bg-[#0B1120] border border-white/5 rounded-xl pl-12 pr-4 py-3 text-[#F8FAFC] focus:outline-none focus:border-[#18E0FF]/50 transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="relative min-w-[250px]">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={20} />
            <select 
              className="w-full bg-[#0B1120] border border-white/5 rounded-xl pl-12 pr-4 py-3 text-[#F8FAFC] focus:outline-none focus:border-[#18E0FF]/50 transition-colors appearance-none"
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
            >
              <option value="All">All Departments</option>
              {services.map(s => (
                <option key={s.title} value={s.title}>{s.title}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Grouped Doctors List */}
        {Object.keys(groupedDoctors).length === 0 ? (
          <div className="text-center py-20 text-[#94A3B8]">
            <p className="text-xl font-bold mb-2">No doctors found</p>
            <p>Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {Object.entries(groupedDoctors).map(([dept, doctors]) => (
              <div key={dept} className="flex flex-col">
                <h3 className="text-2xl font-bold text-[#F8FAFC] mb-6 flex items-center gap-3">
                  <span className="w-2 h-8 rounded-full bg-[#18E0FF]"></span>
                  {dept}
                  <span className="text-sm font-semibold text-[#94A3B8] ml-2 px-3 py-1 bg-[#141D31] rounded-full border border-white/5 shadow-inner">
                    {doctors.length} Doctor{doctors.length !== 1 ? 's' : ''}
                  </span>
                </h3>
                
                <div className="flex flex-col border-t border-white/5 bg-[#141D31]/30 rounded-2xl overflow-hidden shadow-lg border border-white/5">
                  {doctors.map((doc, index) => (
                    <motion.div 
                      key={doc.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (index % 10) * 0.05 }}
                      className="flex flex-col md:flex-row md:items-center justify-between p-6 border-b border-white/5 hover:bg-[#141D31]/80 transition-colors gap-6"
                    >
                      <div className="flex items-center gap-6 md:w-1/3">
                        <img 
                          src={doc.photo} 
                          alt={doc.name} 
                          className="hidden sm:block w-14 h-14 rounded-full border-2 border-white/10 object-cover shrink-0 group-hover:border-[#18E0FF]/50 transition-colors"
                        />
                        <div>
                          <h4 className="text-xl font-bold text-[#F8FAFC]">{doc.name}</h4>
                          <p className="text-sm font-semibold text-[#18E0FF] uppercase tracking-widest mt-1">{doc.specialty}</p>
                        </div>
                      </div>
                      <div className="flex flex-col md:items-center justify-center gap-1.5 text-sm text-[#94A3B8] md:w-1/3">
                        <div className="flex items-center gap-2 w-fit"><Mail size={14} /> {doc.email}</div>
                        <div className="flex items-center gap-2 w-fit"><Phone size={14} /> {doc.mobile}</div>
                      </div>
                      <div className="flex justify-start md:justify-end md:w-1/3">
                        <button 
                          onClick={() => handleDoctorAccept(doc.id)}
                          className={`text-sm font-bold px-6 py-3 rounded-xl transition-all uppercase tracking-widest text-center whitespace-nowrap ${
                            activeRequests[doc.id]
                              ? 'bg-[#FF296D]/10 border border-[#FF296D] text-[#FF296D] shadow-[0_0_15px_rgba(255,41,109,0.3)] hover:bg-[#FF296D]/20 animate-pulse'
                              : 'bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] hover:border-[#22C55E] hover:bg-[#22C55E]/20'
                          }`}
                        >
                          Accept Request
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicDoctors;
