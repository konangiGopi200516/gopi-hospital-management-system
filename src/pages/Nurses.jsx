import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, Phone, Mail, ShieldCheck, UserPlus, X, MessageSquare, Edit, 
  Activity, Star, Clock, AlertCircle, Heart, User, MapPin, ChevronRight, CheckCircle2, DollarSign
} from 'lucide-react';
import { OTHER_PAYROLL } from '../data/mockData';
import { getStaff, updateStaff, addStaff, deleteStaff } from '../services/firebaseService';
import AddStaffModal from '../components/AddStaffModal';

const Nurses = () => {
  const [nurses, setNurses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNurse, setSelectedNurse] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    const fetchNurses = async () => {
      try {
        const staff = await getStaff();
        setNurses(staff.filter(emp => emp.category === 'Nurses'));
      } catch (error) {
        console.error("Failed to fetch nurses from Firebase:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNurses();
  }, []);

  const filteredNurses = useMemo(() => {
    return nurses.filter(nurse => {
      const matchesSearch = nurse.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            nurse.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            nurse.department.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [nurses, searchQuery]);

  const handleAddNurse = async (newNurseData) => {
    try {
      const addedNurse = await addStaff({ ...newNurseData, category: 'Nurses', basic: 30000, hra: 5000, medical: 2000, transport: 1000, bonus: 0, tax: 0, pf: 1500 });
      setNurses(prev => [addedNurse, ...prev]);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Failed to add nurse", error);
    }
  };

  const handleDeleteNurse = async (firebaseId, id) => {
    if (!window.confirm("Are you sure you want to delete this nurse?")) return;
    try {
      if (firebaseId) {
        await deleteStaff(firebaseId, 'Nurses');
      }
      setNurses(prev => prev.filter(nurse => {
        if (firebaseId && nurse.firebaseId === firebaseId) return false;
        if (id && nurse.id === id) return false;
        return true;
      }));
      setSelectedNurse(null);
    } catch (error) {
      console.error("Failed to delete nurse", error);
    }
  };

  const stats = useMemo(() => {
    let available = 0, leave = 0;
    nurses.forEach(n => {
      if (n.attendance === 'Present') available++;
      if (n.attendance === 'On Leave') leave++;
    });
    return { total: nurses.length, available, leave };
  }, [nurses]);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Present': return 'text-[#22C55E] bg-[#22C55E]/10 border-[#22C55E]/20';
      case 'On Leave': return 'text-[#FF4D6D] bg-[#FF4D6D]/10 border-[#FF4D6D]/20';
      case 'Absent': return 'text-[#FB923C] bg-[#FB923C]/10 border-[#FB923C]/20';
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
    }
  };

  const toggleAttendance = async (id, firebaseId) => {
    const nurse = nurses.find(n => n.id === id);
    if (!nurse) return;

    const nextStatus = nurse.attendance === 'Present' ? 'On Leave' : nurse.attendance === 'On Leave' ? 'Absent' : 'Present';
    
    // Update local state immediately for UI responsiveness
    setNurses(prev => prev.map(n => n.id === id ? { ...n, attendance: nextStatus } : n));
    if (selectedNurse?.id === id) {
       setSelectedNurse({ ...selectedNurse, attendance: nextStatus });
    }

    try {
      if (firebaseId) {
        await updateStaff(firebaseId, { attendance: nextStatus });
      }
    } catch (error) {
      console.error("Failed to update attendance in Firebase:", error);
      // Revert on failure
      setNurses(prev => prev.map(n => n.id === id ? { ...n, attendance: nurse.attendance } : n));
      if (selectedNurse?.id === id) {
         setSelectedNurse({ ...selectedNurse, attendance: nurse.attendance });
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#18E0FF]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-8 h-full flex flex-col relative font-sans">
      
      {/* Top Header & Analytics */}
      <div className="bg-[#131C33] border border-white/5 rounded-xl p-4 flex flex-col xl:flex-row xl:items-center justify-between gap-4 shadow-sm">
         <div className="flex flex-col">
           <h1 className="text-xl font-bold text-[#F8FAFC]">Nursing Staff Management</h1>
           <p className="text-[#94A3B8] text-xs mt-1">Enterprise directory for strictly assigned nursing staff (1 Nurse per Room).</p>
         </div>

         <div className="flex flex-wrap items-center gap-6 text-xs border-l border-white/5 pl-6">
           <button 
             onClick={() => setIsAddModalOpen(true)}
             className="bg-[#18E0FF]/10 text-[#18E0FF] border border-[#18E0FF]/20 px-4 py-2 rounded-lg font-bold uppercase tracking-widest text-xs hover:bg-[#18E0FF]/20 transition-colors mr-2"
           >
             + Add Nurse
           </button>
           <div className="flex flex-col"><span className="text-[#94A3B8] font-bold uppercase tracking-widest text-[9px] mb-1">Total Nurses</span><span className="font-bold text-[#F8FAFC] text-sm">{stats.total}</span></div>
           <div className="flex flex-col"><span className="text-[#94A3B8] font-bold uppercase tracking-widest text-[9px] mb-1">Available</span><span className="font-bold text-[#22C55E] text-sm">{stats.available}</span></div>
           <div className="flex flex-col"><span className="text-[#94A3B8] font-bold uppercase tracking-widest text-[9px] mb-1">On Leave</span><span className="font-bold text-[#FF4D6D] text-sm">{stats.leave}</span></div>
         </div>
      </div>

      <div className="flex-1 flex gap-4 h-[calc(100vh-200px)] min-h-[600px] overflow-hidden">
        
        {/* Center Panel: Enterprise Table */}
        <div className="flex-1 bg-[#131C33] border border-white/5 rounded-xl flex flex-col overflow-hidden shadow-sm">
          
          {/* Header Analytics */}
          <div className="p-4 border-b border-white/5 bg-[#0B1120]/50 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#F8FAFC] tracking-widest uppercase flex items-center gap-2">
                 Nurse Directory
              </h2>
              
              <div className="flex items-center gap-2">
                <div className="relative group w-64">
                  <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-[#94A3B8] group-focus-within:text-[#18E0FF]">
                    <Search size={12} />
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, ID, or department..."
                    className="w-full bg-[#0B1120] border border-white/5 text-[#F8FAFC] text-[10px] font-semibold px-2 py-2 pl-8 rounded-md outline-none focus:border-[#18E0FF] transition-colors"
                  />
                </div>
                <button className="bg-[#0B1120] border border-white/5 hover:bg-white/5 text-[#94A3B8] p-2 rounded-md transition-colors flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest">
                  <Filter size={12} /> Filters
                </button>
              </div>
            </div>
          </div>

          {/* Directory Table */}
          <div className="flex-1 overflow-x-auto overflow-y-auto custom-scrollbar bg-[#0B1120]/20 relative">
             <table className="w-full text-left border-collapse min-w-[1200px]">
                <thead className="sticky top-0 bg-[#0B1120] z-10">
                   <tr>
                      <th className="px-4 py-3 border-b border-white/5 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Nurse Info</th>
                      <th className="px-4 py-3 border-b border-white/5 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Assignment</th>
                      <th className="px-4 py-3 border-b border-white/5 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Experience</th>
                      <th className="px-4 py-3 border-b border-white/5 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Working Hours</th>
                      <th className="px-4 py-3 border-b border-white/5 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Contact</th>
                      <th className="px-4 py-3 border-b border-white/5 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest text-right">Action</th>
                   </tr>
                </thead>
                <tbody>
                    {filteredNurses.map((nurse) => (
                      <tr 
                        key={nurse.id} 
                        onClick={() => setSelectedNurse(nurse)}
                        className={`cursor-pointer transition-colors border-b border-white/5 last:border-0 ${selectedNurse?.id === nurse.id ? 'bg-[#18E0FF]/5' : 'hover:bg-[#131C33]/80'}`}
                      >
                         <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                               <img src={nurse.photo} alt={nurse.name} className="w-10 h-10 rounded object-cover border border-white/10" />
                               <div>
                                  <p className="text-sm font-bold text-[#F8FAFC]">{nurse.name}</p>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-[10px] font-mono text-[#18E0FF] bg-[#18E0FF]/10 px-1.5 py-0.5 rounded">{nurse.id}</span>
                                    <span className={`text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded border ${getStatusColor(nurse.attendance)}`}>{nurse.attendance}</span>
                                  </div>
                               </div>
                            </div>
                         </td>
                         <td className="px-4 py-3">
                            <p className="text-xs font-bold text-[#F8FAFC]">{nurse.department}</p>
                            <p className="text-[10px] text-[#94A3B8] uppercase tracking-widest mt-0.5">Assigned Ward</p>
                         </td>
                         <td className="px-4 py-3">
                            <p className="text-xs font-bold text-[#F8FAFC]">{nurse.designation}</p>
                            <p className="text-[10px] text-[#94A3B8] uppercase tracking-widest mt-0.5">{nurse.experience} Yrs</p>
                         </td>
                         <td className="px-4 py-3">
                            <p className="text-xs font-bold text-[#F8FAFC]">{nurse.workingHours}</p>
                            <p className="text-[10px] text-[#94A3B8] uppercase tracking-widest mt-0.5">Single Shift</p>
                         </td>
                         <td className="px-4 py-3">
                            <p className="text-xs font-semibold text-[#F8FAFC]">₹{nurse.basic.toLocaleString()}</p>
                            <p className="text-[10px] text-[#22C55E] uppercase font-bold tracking-widest mt-0.5">Basic Salary</p>
                         </td>
                         <td className="px-4 py-3 text-right">
                            <button className="text-[#94A3B8] hover:text-[#18E0FF] transition-colors p-1" title="View Profile">
                               <ChevronRight size={16} />
                            </button>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
             {filteredNurses.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-[#94A3B8]">
                   <UserPlus size={32} className="mb-3 opacity-50" />
                   <p className="text-sm font-bold text-[#F8FAFC]">No records found</p>
                </div>
             )}
          </div>
        </div>

        {/* Right Panel: Nurse Profile Slide-over */}
        <AnimatePresence>
          {selectedNurse && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="w-80 lg:w-[380px] bg-[#131C33] border border-white/5 rounded-xl flex flex-col shrink-0 overflow-hidden shadow-sm relative z-20"
            >
              <div className="p-4 border-b border-white/5 bg-[#0B1120]/50 flex justify-between items-center">
                <h3 className="text-sm font-bold text-[#F8FAFC]">Clinical Nurse Profile</h3>
                <button onClick={() => setSelectedNurse(null)} className="text-[#94A3B8] hover:text-[#FF4D6D] transition-colors">
                  <X size={16} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto custom-scrollbar pb-6">
                {/* Profile Header */}
                <div className="p-6 flex flex-col items-center text-center border-b border-white/5 bg-gradient-to-b from-[#18E0FF]/5 to-transparent relative">
                   <div className="absolute top-4 right-4">
                     <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded border ${getStatusColor(selectedNurse.attendance)}`}>{selectedNurse.attendance}</span>
                   </div>
                   <img src={selectedNurse.photo} alt={selectedNurse.name} className="w-24 h-24 rounded-2xl object-cover border-2 border-[#18E0FF]/30 shadow-[0_0_20px_rgba(24,224,255,0.15)] mb-4" />
                   <h2 className="text-xl font-bold text-[#F8FAFC]">{selectedNurse.name}</h2>
                   <p className="text-[10px] font-bold text-[#18E0FF] uppercase tracking-widest mt-1 mb-2">{selectedNurse.designation}</p>
                   <p className="text-xs text-[#94A3B8] font-mono bg-[#0B1120] px-2 py-1 rounded">{selectedNurse.id}</p>
                </div>

                {/* Assignment Highlight */}
                <div className="p-6 border-b border-white/5 bg-[#0B1120]/30">
                   <h4 className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-3">Primary Assignment</h4>
                   <div className="flex items-start gap-3 p-3 bg-[#131C33] border border-[#18E0FF]/20 rounded-lg shadow-[0_0_15px_rgba(24,224,255,0.03)]">
                      <div className="bg-[#18E0FF]/10 p-2 rounded-lg text-[#18E0FF]">
                         <MapPin size={20} />
                      </div>
                      <div>
                         <p className="text-sm font-bold text-[#F8FAFC]">{selectedNurse.department}</p>
                         <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mt-0.5">Hospital Ward</p>
                      </div>
                   </div>
                </div>

                {/* Quick Actions */}
                <div className="p-4 grid grid-cols-2 gap-2 border-b border-white/5">
                   <button onClick={() => toggleAttendance(selectedNurse.id, selectedNurse.firebaseId)} className="bg-[#18E0FF]/10 hover:bg-[#18E0FF]/20 text-[#18E0FF] border border-[#18E0FF]/20 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5">
                     <Activity size={12} /> Toggle Attendance
                   </button>
                   <button className="bg-[#0B1120] hover:bg-white/5 text-[#F8FAFC] border border-white/10 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5">
                     <Edit size={12} /> Transfer Room
                   </button>
                   <button className="bg-[#0B1120] hover:bg-white/5 text-[#F8FAFC] border border-white/10 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5">
                     <MessageSquare size={12} /> Message
                   </button>
                   <button onClick={() => handleDeleteNurse(selectedNurse.firebaseId, selectedNurse.id)} className="bg-[#FF4D6D]/10 hover:bg-[#FF4D6D]/20 text-[#FF4D6D] border border-[#FF4D6D]/20 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5">
                     <X size={12} /> Delete
                   </button>
                </div>

                {/* Professional Details & Salary */}
                <div className="p-6 space-y-4 border-b border-white/5">
                   <h4 className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-2">Professional & Payroll Info</h4>
                   <div className="space-y-3">
                     <div className="flex justify-between items-center text-xs">
                       <span className="font-semibold text-[#94A3B8]">Experience</span>
                       <span className="font-bold text-[#F8FAFC]">{selectedNurse.experience} Years</span>
                     </div>
                     <div className="flex justify-between items-center text-xs">
                       <span className="font-semibold text-[#94A3B8]">Working Hours</span>
                       <span className="font-bold text-[#F8FAFC]">{selectedNurse.workingHours} (Single Shift)</span>
                     </div>
                     <div className="flex justify-between items-center text-xs mt-4 pt-4 border-t border-white/5">
                       <span className="font-semibold text-[#94A3B8]">Basic Salary</span>
                       <span className="font-bold text-[#18E0FF]">₹{selectedNurse.basic.toLocaleString()}</span>
                     </div>
                     <div className="flex justify-between items-center text-xs">
                       <span className="font-semibold text-[#94A3B8]">HRA & Medical</span>
                       <span className="font-bold text-[#F8FAFC]">₹{selectedNurse.hra.toLocaleString()} + ₹{selectedNurse.medical.toLocaleString()}</span>
                     </div>
                   </div>
                </div>

                {/* Contact Information */}
                <div className="p-6 space-y-4">
                   <h4 className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-2">Contact Info</h4>
                   <div className="space-y-3">
                     <div className="flex justify-between items-center text-xs">
                       <span className="font-semibold text-[#94A3B8]">Phone</span>
                       <span className="font-bold text-[#F8FAFC]">{selectedNurse.mobile}</span>
                     </div>
                     <div className="flex justify-between items-center text-xs">
                       <span className="font-semibold text-[#94A3B8]">Email</span>
                       <span className="font-bold text-[#18E0FF] hover:underline cursor-pointer">{selectedNurse.email}</span>
                     </div>
                     <div className="flex justify-between items-center text-xs">
                       <span className="font-semibold text-[#FF4D6D]">Blood Group</span>
                       <span className="font-bold text-[#F8FAFC] bg-[#FF4D6D]/20 text-[#FF4D6D] px-2 py-0.5 rounded">O+</span>
                     </div>
                   </div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AddStaffModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAdd={handleAddNurse}
        category="Nurses"
      />
    </div>
  );
};

export default Nurses;
