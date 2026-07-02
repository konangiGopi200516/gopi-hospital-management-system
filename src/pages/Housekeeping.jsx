import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getStaff, updateStaff, addStaff, deleteStaff } from '../services/firebaseService';
import AddStaffModal from '../components/AddStaffModal';
import { Search, X, Briefcase, Building2, Activity, Info, Phone, Mail, Trash2 } from 'lucide-react';

const Housekeeping = () => {
  const [housekeepers, setHousekeepers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const staff = await getStaff();
        setHousekeepers(staff.filter(emp => emp.category === 'Housekeeping'));
      } catch (error) {
        console.error("Failed to fetch housekeeping staff from Firebase:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStaff();
  }, []);

  const filteredStaff = useMemo(() => {
    return housekeepers.filter(staff => 
      staff.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      staff.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [housekeepers, searchQuery]);

  const handleAddHousekeeper = async (newStaffData) => {
    try {
      const addedStaff = await addStaff({ ...newStaffData, category: 'Housekeeping', basic: 15000, hra: 3000, medical: 1000, transport: 1000, bonus: 0, tax: 0, pf: 1000 });
      setHousekeepers(prev => [addedStaff, ...prev]);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Failed to add housekeeping staff", error);
    }
  };

  const handleDeleteHousekeeper = async (firebaseId, id) => {
    if (!window.confirm("Are you sure you want to delete this staff member?")) return;
    try {
      if (firebaseId) {
        await deleteStaff(firebaseId, 'Housekeeping');
      }
      setHousekeepers(prev => prev.filter(staff => staff.id !== id));
      setSelectedStaff(null);
    } catch (error) {
      console.error("Failed to delete housekeeping staff", error);
    }
  };

  const stats = useMemo(() => {
    let available = 0, leave = 0;
    housekeepers.forEach(n => {
      if (n.attendance === 'Present') available++;
      if (n.attendance === 'On Leave') leave++;
    });
    return { total: housekeepers.length, available, leave };
  }, [housekeepers]);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Present': return 'text-[#22C55E] bg-[#22C55E]/10 border-[#22C55E]/20';
      case 'On Leave': return 'text-[#FF4D6D] bg-[#FF4D6D]/10 border-[#FF4D6D]/20';
      case 'Absent': return 'text-[#FB923C] bg-[#FB923C]/10 border-[#FB923C]/20';
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
    }
  };

  const toggleAttendance = async (id, firebaseId) => {
    const staff = housekeepers.find(n => n.id === id);
    if (!staff) return;

    const nextStatus = staff.attendance === 'Present' ? 'On Leave' : staff.attendance === 'On Leave' ? 'Absent' : 'Present';
    
    // Update local state immediately
    setHousekeepers(prev => prev.map(n => n.id === id ? { ...n, attendance: nextStatus } : n));
    if (selectedStaff?.id === id) {
       setSelectedStaff({ ...selectedStaff, attendance: nextStatus });
    }

    try {
      if (firebaseId) {
        await updateStaff(firebaseId, { attendance: nextStatus });
      }
    } catch (error) {
      console.error("Failed to update attendance in Firebase:", error);
      setHousekeepers(prev => prev.map(n => n.id === id ? { ...n, attendance: staff.attendance } : n));
      if (selectedStaff?.id === id) {
         setSelectedStaff({ ...selectedStaff, attendance: staff.attendance });
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
    <div className="space-y-6 pb-8 h-full flex flex-col font-sans">
      <div className="bg-[#131C33] border border-white/5 rounded-xl p-6 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-[#F8FAFC] flex items-center gap-3">
            <Briefcase className="text-[#18E0FF]" size={24} /> 
            Housekeeping Staff
          </h1>
          <p className="text-[#94A3B8] text-sm mt-1">Manage and assign housekeeping staff for all wards and rooms.</p>
        </div>
        
        <div className="flex gap-3">
          <div className="relative group w-full sm:w-72">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#94A3B8] group-focus-within:text-[#18E0FF]">
              <Search size={16} />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, ID, or room..."
              className="w-full bg-[#0B1120] border border-white/5 text-[#F8FAFC] text-sm font-semibold px-4 py-2.5 pl-10 rounded-xl outline-none focus:border-[#18E0FF] transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 flex gap-6 h-[calc(100vh-200px)] min-h-[600px]">
        {/* Main List */}
        <div className="flex-1 bg-[#131C33] border border-white/5 rounded-xl flex flex-col overflow-hidden shadow-sm">
          <div className="p-4 border-b border-white/5 bg-[#0B1120]/50 flex justify-between items-center">
             <div className="flex gap-4 items-center">
               <h2 className="text-sm font-bold text-[#F8FAFC] tracking-widest uppercase">Housekeeping Directory</h2>
               <span className="px-3 py-1 bg-[#18E0FF]/10 text-[#18E0FF] border border-[#18E0FF]/20 rounded-lg text-xs font-bold uppercase tracking-widest">
                  {stats.total} Total
               </span>
             </div>
             
             <div className="flex gap-3 text-xs">
                <span className="text-[#22C55E] font-bold px-3 py-1 bg-[#22C55E]/10 rounded border border-[#22C55E]/20">Present: {stats.available}</span>
                <span className="text-[#FF4D6D] font-bold px-3 py-1 bg-[#FF4D6D]/10 rounded border border-[#FF4D6D]/20">Leave: {stats.leave}</span>
             </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-[#0B1120]/20">
             <div className="space-y-2">
                {filteredStaff.map(staff => (
                  <motion.div 
                    key={staff.id} 
                    onClick={() => setSelectedStaff(staff)}
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${selectedStaff?.id === staff.id ? 'bg-[#18E0FF]/5 border-[#18E0FF]/20' : 'bg-[#131C33] border-white/5 hover:border-white/10 hover:bg-[#131C33]/80'}`}
                  >
                     <div className="flex items-center gap-4 min-w-[250px]">
                        <img src={staff.photo} alt={staff.name} className="w-10 h-10 rounded object-cover border border-white/10" />
                        <div>
                           <p className="text-sm font-bold text-[#F8FAFC]">{staff.name}</p>
                           <p className="text-[10px] font-bold text-[#18E0FF] uppercase tracking-widest">{staff.designation}</p>
                        </div>
                     </div>
                     
                     <div className="flex items-center gap-1.5 min-w-[100px]">
                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded border ${getStatusColor(staff.attendance)}`}>{staff.attendance}</span>
                     </div>
                     
                     <div className="hidden lg:flex flex-col min-w-[150px]">
                        <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-0.5">Contact</span>
                        <span className="text-xs font-semibold text-[#F8FAFC]">{staff.phone}</span>
                        <span className="text-[10px] font-semibold text-[#18E0FF] truncate max-w-[150px]">{staff.email}</span>
                     </div>

                     <div className="hidden xl:flex flex-col min-w-[150px]">
                        <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-0.5">Assigned Room</span>
                        <span className="text-xs font-semibold text-[#F8FAFC] bg-[#0B1120] px-2 py-1 rounded inline-block w-max border border-white/5">{staff.department}</span>
                     </div>
                  </motion.div>
                ))}
             </div>
          </div>
        </div>

        {/* Profile Sidebar */}
        <AnimatePresence>
          {selectedStaff && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="w-80 bg-[#131C33] border border-white/5 rounded-xl flex flex-col shrink-0 overflow-hidden shadow-sm"
            >
              <div className="p-4 border-b border-white/5 bg-[#0B1120]/50 flex justify-between items-center relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-[#18E0FF]/10 rounded-full blur-3xl"></div>
                 <h3 className="text-sm font-bold text-[#F8FAFC] tracking-widest uppercase z-10 relative">Profile</h3>
                 <button onClick={() => setSelectedStaff(null)} className="text-[#94A3B8] hover:text-white transition-colors z-10 relative">
                    <X size={16} />
                 </button>
              </div>
              
              <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                <div className="text-center mb-6 relative">
                   <div className="w-24 h-24 mx-auto rounded-xl bg-gradient-to-tr from-[#18E0FF]/20 to-[#8B5CF6]/20 p-1 mb-4 shadow-[0_0_20px_rgba(24,224,255,0.1)]">
                     <img src={selectedStaff.photo} alt={selectedStaff.name} className="w-full h-full rounded-lg object-cover" />
                   </div>
                   <h2 className="text-xl font-bold text-[#F8FAFC]">{selectedStaff.name}</h2>
                   <p className="text-xs font-bold text-[#18E0FF] uppercase tracking-widest mt-1">{selectedStaff.designation}</p>
                   <span className="inline-block mt-3 px-3 py-1 bg-[#0B1120] border border-white/10 rounded-full text-[10px] font-bold text-[#F8FAFC] font-mono">
                     {selectedStaff.id}
                   </span>
                </div>

                <div className="space-y-4">
                   <div className="bg-[#0B1120] p-4 rounded-xl border border-white/5">
                      <div className="flex justify-between items-center mb-3">
                         <h4 className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest flex items-center gap-2">
                           <Building2 size={12} className="text-[#18E0FF]" /> Assignment & Payroll
                         </h4>
                         <button onClick={() => toggleAttendance(selectedStaff.id, selectedStaff.firebaseId)} className="bg-[#18E0FF]/10 hover:bg-[#18E0FF]/20 text-[#18E0FF] border border-[#18E0FF]/20 px-2 py-1 rounded text-[9px] font-bold uppercase tracking-widest transition-colors flex items-center gap-1">
                           <Activity size={10} /> Toggle Status
                         </button>
                      </div>
                      <div className="space-y-3">
                         <div>
                            <p className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-widest mb-1">Assigned Room</p>
                            <p className="text-sm font-semibold text-[#F8FAFC]">{selectedStaff.department}</p>
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                            <div>
                               <p className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-widest mb-1">Experience</p>
                               <p className="text-sm font-semibold text-[#F8FAFC]">{selectedStaff.experience} Years</p>
                            </div>
                            <div>
                               <p className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-widest mb-1">Shift</p>
                               <p className="text-sm font-semibold text-[#F8FAFC]">{selectedStaff.shift}</p>
                            </div>
                         </div>
                         <div className="pt-3 mt-3 border-t border-white/5">
                            <p className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-widest mb-1">Monthly Salary</p>
                            <p className="text-lg font-bold text-[#18E0FF]">₹{selectedStaff.basic.toLocaleString()}</p>
                         </div>
                      </div>
                   </div>

                   <div className="bg-[#0B1120] p-4 rounded-xl border border-white/5">
                      <h4 className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Info size={12} className="text-[#18E0FF]" /> Contact Info
                      </h4>
                      <div className="space-y-3">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[#131C33] flex items-center justify-center text-[#18E0FF] border border-white/5">
                               <Phone size={14} />
                            </div>
                            <div>
                               <p className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-widest">Phone</p>
                               <p className="text-sm font-semibold text-[#F8FAFC]">{selectedStaff.phone}</p>
                            </div>
                         </div>
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[#131C33] flex items-center justify-center text-[#18E0FF] border border-white/5">
                               <Mail size={14} />
                            </div>
                            <div>
                               <p className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-widest">Email</p>
                               <p className="text-[10px] font-semibold text-[#F8FAFC] truncate max-w-[200px]">{selectedStaff.email}</p>
                            </div>
                         </div>
                      </div>
                   </div>
                   
                   <div className="mt-4">
                      <button onClick={() => handleDeleteHousekeeper(selectedStaff.firebaseId, selectedStaff.id)} className="w-full bg-[#FF4D6D]/10 hover:bg-[#FF4D6D]/20 border border-[#FF4D6D]/20 text-[#FF4D6D] p-3 rounded-xl text-center cursor-pointer transition-colors flex items-center justify-center gap-2 group">
                         <Trash2 size={16} />
                         <span className="text-[10px] font-bold uppercase tracking-widest">Delete Staff Member</span>
                      </button>
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
        onAdd={handleAddHousekeeper}
        category="Housekeeping"
      />
    </div>
  );
};

export default Housekeeping;
