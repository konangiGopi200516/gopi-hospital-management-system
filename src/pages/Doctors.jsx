import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, MapPin, Phone, Mail, Clock, ShieldCheck, 
  UserPlus, Calendar, MoreVertical, X, Star, Award, 
  MessageSquare, Edit, Heart, Brain, Bone, Baby, Syringe, Eye,
  Stethoscope, Activity
} from 'lucide-react';
import { getStaff, updateStaff, addStaff, deleteStaff } from '../services/firebaseService';
import AddStaffModal from '../components/AddStaffModal';

const DEPARTMENTS = [
  { name: 'Retina & Vitreous', icon: Eye },
  { name: 'Cataract Services', icon: Eye },
  { name: 'LASIK & Refractive', icon: Eye },
  { name: 'Glaucoma Clinic', icon: Eye },
  { name: 'Cornea Services', icon: Eye },
  { name: 'Pediatric Ophthalmology', icon: Baby },
  { name: 'Neuro Ophthalmology', icon: Brain },
  { name: 'Oculoplasty', icon: Eye },
  { name: 'Eye Emergency', icon: Activity }
];

const TABS = [
  { id: 'consultants', label: '👨‍⚕️ Consultants' },
  { id: 'heads', label: '🏥 Department Heads' },
  { id: 'emergency', label: '🚑 Emergency Physicians' },
  { id: 'surgeons', label: '🩺 Surgeons' },
  { id: 'residents', label: '👩‍⚕️ Residents' },
  { id: 'specialists', label: '⭐ Specialists' },
];

const FIRST_NAMES = ['Rahul', 'Anjali', 'Vikram', 'Priya', 'Arjun', 'Neha', 'Rohan', 'Sneha', 'Karan', 'Pooja'];
const LAST_NAMES = ['Sharma', 'Gupta', 'Patel', 'Singh', 'Desai', 'Verma', 'Kumar', 'Joshi', 'Chauhan', 'Shah'];

const generateDoctors = (firebaseDoctors) => {
  return firebaseDoctors.map((doc, index) => {
    const exp = doc.experience || Math.floor(Math.random() * 20) + 5;
    const randStatus = Math.random();
    let status = 'Available';
    if (randStatus > 0.85) status = 'On Leave';
    else if (randStatus > 0.7) status = 'Emergency';
    else if (randStatus > 0.4) status = 'In Consultation';

    const gender = doc.photo && doc.photo.includes('women') ? 'women' : 'men';
    const picId = Math.floor(Math.random() * 90) + 1;

    return {
      id: doc.id,
      firebaseId: doc.firebaseId,
      name: doc.name,
      department: doc.specialty || doc.department || 'Retina & Vitreous',
      specialization: `Senior ${doc.specialty || doc.department || 'Eye'} Specialist`,
      category: exp > 15 ? 'heads' : (exp > 10 ? 'consultants' : (exp > 5 ? 'specialists' : 'residents')),
      qualification: exp > 15 ? 'MBBS, MS, Fellowship' : 'MBBS, MS',
      registrationNumber: `MCI-${Math.floor(10000 + Math.random() * 90000)}`,
      experience: exp,
      phone: `+91 ${Math.floor(6000000000 + Math.random() * 3999999999)}`,
      email: doc.email || doc.name.toLowerCase().replace(/ /g, '.') + '@visioncare.com',
      mobile: doc.mobile || `+91 ${Math.floor(6000000000 + Math.random() * 3999999999)}`,
      room: `Room ${Math.floor(100 + Math.random() * 400)}`,
      floor: `Floor ${Math.floor(1 + Math.random() * 5)}`,
      workingDays: 'Mon - Sat',
      workingHours: '09:00 AM - 05:00 PM',
      shift: exp % 2 === 0 ? 'Morning' : 'Evening',
      languages: 'English, Hindi, Telugu',
      salary: `₹${(exp * 1.5).toFixed(1)}L / month`,
      status,
      rating: (4 + Math.random()).toFixed(1),
      patientsQueue: Math.floor(Math.random() * 5),
      appointmentsToday: Math.floor(Math.random() * 15),
      photo: doc.photo || `https://randomuser.me/api/portraits/${gender}/${picId}.jpg`,
      bio: `${doc.name} is a highly regarded specialist with ${exp} years of clinical excellence.`
    };
  });
};

const ClinicalStaff = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDept, setSelectedDept] = useState(DEPARTMENTS[0].name);
  const [selectedTab, setSelectedTab] = useState(TABS[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const staff = await getStaff();
        const firebaseDoctors = staff.filter(emp => emp.category === 'Doctors');
        setDoctors(generateDoctors(firebaseDoctors));
      } catch (error) {
        console.error("Failed to fetch doctors from Firebase:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const assignPatient = async () => {
    if (!selectedDoctor) return;
    
    setDoctors(prevDoctors => 
      prevDoctors.map(doc => {
        if (doc.id === selectedDoctor.id) {
          const updatedDoc = { ...doc, patientsQueue: doc.patientsQueue + 1 };
          setSelectedDoctor(updatedDoc); // update the selected doctor view
          return updatedDoc;
        }
        return doc;
      })
    );
  };

  const handleAddDoctor = async (newDocData) => {
    try {
      const addedDoc = await addStaff({ ...newDocData, category: 'Doctors' });
      setDoctors(prev => [addedDoc, ...prev]);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Failed to add doctor", error);
    }
  };

  const handleDeleteDoctor = async (firebaseId, id) => {
    if (!window.confirm("Are you sure you want to delete this doctor?")) return;
    try {
      if (firebaseId) {
        await deleteStaff(firebaseId, 'Doctors');
      }
      setDoctors(prev => prev.filter(doc => doc.id !== id));
      setSelectedDoctor(null);
    } catch (error) {
      console.error("Failed to delete doctor", error);
    }
  };

  const filteredDoctors = useMemo(() => {
    return doctors.filter(doc => {
      const matchesDept = doc.department === selectedDept;
      const matchesTab = selectedTab === 'consultants' ? true : doc.category === selectedTab; // Simplified for demo
      const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            doc.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesDept && matchesSearch;
    });
  }, [doctors, selectedDept, selectedTab, searchQuery]);



  const stats = useMemo(() => {
    let available = 0, busy = 0, leave = 0, emergency = 0, patients = 0, appts = 0;
    doctors.forEach(d => {
      if (d.status === 'Available') available++;
      if (d.status === 'In Consultation') busy++;
      if (d.status === 'On Leave') leave++;
      if (d.status === 'Emergency') emergency++;
      patients += d.patientsQueue;
      appts += d.appointmentsToday;
    });
    return { total: doctors.length, available, busy, leave, emergency, patients, appts };
  }, [doctors]);

  const deptStats = useMemo(() => {
    let available = 0, busy = 0, emergency = 0, patients = 0;
    const deptDocs = doctors.filter(d => d.department === selectedDept);
    deptDocs.forEach(d => {
      if (d.status === 'Available') available++;
      if (d.status === 'In Consultation') busy++;
      if (d.status === 'Emergency') emergency++;
      patients += d.patientsQueue;
    });
    const head = deptDocs.find(d => d.experience > 15)?.name || 'Dr. Vikram Patel';
    return { total: deptDocs.length, head, available, busy, emergency, patients };
  }, [doctors, selectedDept]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#18E0FF]"></div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'Available': return 'text-[#22C55E]';
      case 'In Consultation': return 'text-[#FACC15]';
      case 'Emergency': return 'text-[#FF4D6D]';
      case 'On Leave': return 'text-[#94A3B8]';
      default: return 'text-gray-500';
    }
  };

  const getStatusDot = (status) => {
    switch(status) {
      case 'Available': return 'bg-[#22C55E] shadow-[0_0_8px_rgba(34,197,94,0.6)]';
      case 'In Consultation': return 'bg-[#FACC15] shadow-[0_0_8px_rgba(250,204,21,0.6)]';
      case 'Emergency': return 'bg-[#FF4D6D] shadow-[0_0_8px_rgba(255,77,109,0.6)] animate-pulse';
      case 'On Leave': return 'bg-[#94A3B8]';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-4 pb-8 h-full flex flex-col relative font-sans">
      
      {/* Top Header & Analytics */}
      <div className="bg-[#131C33] border border-white/5 rounded-xl p-4 flex flex-col xl:flex-row xl:items-center justify-between gap-4 shadow-sm">
         <div className="flex flex-col">
           <h1 className="text-xl font-bold text-[#F8FAFC]">Clinical Staff Management</h1>
           <p className="text-[#94A3B8] text-xs mt-1">Enterprise directory and scheduling.</p>
         </div>

         <div className="flex flex-wrap items-center gap-6 text-xs border-l border-white/5 pl-6">
           <button 
             onClick={() => setIsAddModalOpen(true)}
             className="bg-[#18E0FF]/10 text-[#18E0FF] border border-[#18E0FF]/20 px-4 py-2 rounded-lg font-bold uppercase tracking-widest text-xs hover:bg-[#18E0FF]/20 transition-colors mr-2"
           >
             + Add Doctor
           </button>
           <div className="flex flex-col"><span className="text-[#94A3B8] font-bold uppercase tracking-widest text-[9px] mb-1">Total Doctors</span><span className="font-bold text-[#F8FAFC] text-sm">{stats.total}</span></div>
           <div className="flex flex-col"><span className="text-[#94A3B8] font-bold uppercase tracking-widest text-[9px] mb-1">Available</span><span className="font-bold text-[#22C55E] text-sm">{stats.available}</span></div>
           <div className="flex flex-col"><span className="text-[#94A3B8] font-bold uppercase tracking-widest text-[9px] mb-1">Busy</span><span className="font-bold text-[#FACC15] text-sm">{stats.busy}</span></div>
           <div className="flex flex-col"><span className="text-[#94A3B8] font-bold uppercase tracking-widest text-[9px] mb-1">Emergency</span><span className="font-bold text-[#FF4D6D] text-sm">{stats.emergency}</span></div>
           <div className="flex flex-col"><span className="text-[#94A3B8] font-bold uppercase tracking-widest text-[9px] mb-1">On Leave</span><span className="font-bold text-[#94A3B8] text-sm">{stats.leave}</span></div>
           <div className="flex flex-col"><span className="text-[#94A3B8] font-bold uppercase tracking-widest text-[9px] mb-1">Patients Today</span><span className="font-bold text-[#F8FAFC] text-sm">{stats.patients}</span></div>
           <div className="flex flex-col"><span className="text-[#94A3B8] font-bold uppercase tracking-widest text-[9px] mb-1">Appointments</span><span className="font-bold text-[#18E0FF] text-sm">{stats.appts}</span></div>
         </div>
      </div>

      {/* Categories Tabs */}
      <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-2">
         {TABS.map(tab => (
           <button 
             key={tab.id}
             onClick={() => setSelectedTab(tab.id)}
             className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${selectedTab === tab.id ? 'bg-[#18E0FF]/10 text-[#18E0FF] border border-[#18E0FF]/20 shadow-[0_0_10px_rgba(24,224,255,0.05)]' : 'bg-[#131C33] text-[#94A3B8] border border-white/5 hover:text-[#F8FAFC]'}`}
           >
             {tab.label}
           </button>
         ))}
      </div>

      <div className="flex-1 flex gap-4 h-[calc(100vh-220px)] min-h-[600px] overflow-hidden">
        
        {/* Left Panel: Departments */}
        <div className="w-64 bg-[#131C33] border border-white/5 rounded-xl flex flex-col shrink-0 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-white/5 bg-[#0B1120]/50">
            <h3 className="text-xs font-bold text-[#F8FAFC] uppercase tracking-widest">Departments</h3>
            <div className="relative mt-3 group">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#94A3B8] group-focus-within:text-[#18E0FF]">
                <Search size={14} />
              </span>
              <input
                type="text"
                placeholder="Search dept..."
                className="w-full bg-[#0B1120] border border-white/5 text-[#F8FAFC] text-xs font-semibold px-3 py-2 pl-9 rounded-lg outline-none focus:border-[#18E0FF] transition-colors"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
            {DEPARTMENTS.map(dept => {
              const count = doctors.filter(d => d.department === dept.name).length;
              const availCount = doctors.filter(d => d.department === dept.name && d.status === 'Available').length;
              const isSelected = selectedDept === dept.name;
              const Icon = dept.icon;
              return (
                <button
                  key={dept.name}
                  onClick={() => { setSelectedDept(dept.name); setSelectedDoctor(null); }}
                  className={`w-full text-left p-3 rounded-lg transition-all flex flex-col gap-2 border ${isSelected ? 'bg-[#18E0FF]/5 border-[#18E0FF]/20 shadow-[0_0_15px_rgba(24,224,255,0.02)]' : 'border-transparent hover:bg-[#0B1120]/50'}`}
                >
                  <div className="flex justify-between items-center w-full">
                     <span className={`text-xs font-bold flex items-center gap-2 ${isSelected ? 'text-[#18E0FF]' : 'text-[#F8FAFC]'}`}>
                        <Icon size={14} className={isSelected ? 'text-[#18E0FF]' : 'text-[#94A3B8]'} />
                        {dept.name}
                     </span>
                  </div>
                  <div className="flex justify-between items-center w-full">
                     <span className="text-[10px] font-bold text-[#94A3B8]">{count} Doctors</span>
                     <span className="text-[10px] font-bold text-[#22C55E] flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]"></span> {availCount} Avail</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Center Panel: Compact Doctor Directory */}
        <div className="flex-1 bg-[#131C33] border border-white/5 rounded-xl flex flex-col overflow-hidden shadow-sm">
          
          {/* Department Header Analytics */}
          <div className="p-4 border-b border-white/5 bg-[#0B1120]/50 flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-bold text-[#F8FAFC] tracking-widest uppercase flex items-center gap-2">
                 {selectedDept} <span className="text-[#94A3B8]">|</span> Directory
              </h2>
              <div className="flex items-center gap-3 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">
                <span className="text-[#F8FAFC]">Head: <span className="text-[#18E0FF]">{deptStats.head}</span></span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-5 text-[10px] font-bold uppercase tracking-widest">
                 <span className="text-[#94A3B8]">Docs: <span className="text-[#F8FAFC]">{deptStats.total}</span></span>
                 <span className="text-[#94A3B8]">Avail: <span className="text-[#22C55E]">{deptStats.available}</span></span>
                 <span className="text-[#94A3B8]">Busy: <span className="text-[#FACC15]">{deptStats.busy}</span></span>
                 <span className="text-[#94A3B8]">Queue: <span className="text-[#F8FAFC]">{deptStats.patients}</span></span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="relative group w-48">
                  <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-[#94A3B8] group-focus-within:text-[#18E0FF]">
                    <Search size={12} />
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search doctor..."
                    className="w-full bg-[#0B1120] border border-white/5 text-[#F8FAFC] text-[10px] font-semibold px-2 py-1.5 pl-8 rounded-md outline-none focus:border-[#18E0FF] transition-colors"
                  />
                </div>
                <button className="bg-[#0B1120] border border-white/5 hover:bg-white/5 text-[#94A3B8] p-1.5 rounded-md transition-colors">
                  <Filter size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Directory List */}
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-[#0B1120]/20">
             <div className="space-y-2">
                {filteredDoctors.map(doc => (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => setSelectedDoctor(doc)}
                    key={doc.id} 
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${selectedDoctor?.id === doc.id ? 'bg-[#18E0FF]/5 border-[#18E0FF]/20' : 'bg-[#131C33] border-white/5 hover:border-white/10 hover:bg-[#131C33]/80'}`}
                  >
                     <div className="flex items-center gap-4 min-w-[250px]">
                        <img src={doc.photo} alt={doc.name} className="w-10 h-10 rounded object-cover border border-white/10" />
                        <div>
                           <p className="text-sm font-bold text-[#F8FAFC]">{doc.name}</p>
                           <p className="text-[10px] font-bold text-[#18E0FF] uppercase tracking-widest">{doc.specialization}</p>
                        </div>
                     </div>
                     
                     <div className="flex items-center gap-1.5 min-w-[100px]">
                        <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(doc.status)}`}></span>
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${getStatusColor(doc.status)}`}>{doc.status}</span>
                     </div>
                     
                     <div className="hidden lg:flex flex-col min-w-[150px]">
                        <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-0.5">Contact Details</span>
                        <span className="text-xs font-semibold text-[#F8FAFC]">{doc.mobile}</span>
                        <span className="text-[10px] font-semibold text-[#18E0FF] truncate max-w-[150px]">{doc.email}</span>
                     </div>

                     <div className="hidden xl:flex flex-col min-w-[100px]">
                        <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-0.5">Salary</span>
                        <span className="text-xs font-bold text-[#22C55E]">{doc.salary}</span>
                     </div>

                     <div className="flex flex-col items-end min-w-[80px]">
                        <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-0.5">Queue</span>
                        <span className="text-xs font-bold text-[#F8FAFC] bg-[#0B1120] px-2 py-0.5 rounded">{doc.patientsQueue} Pts</span>
                     </div>
                  </motion.div>
                ))}
                {filteredDoctors.length === 0 && (
                  <div className="text-center py-10 opacity-50">
                     <p className="text-sm font-bold text-[#F8FAFC]">No doctors match current criteria.</p>
                  </div>
                )}
             </div>
          </div>
        </div>

        {/* Right Panel: Doctor Profile (Only visible when clicked) */}
        <AnimatePresence>
          {selectedDoctor && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="w-80 lg:w-[380px] bg-[#131C33] border border-white/5 rounded-xl flex flex-col shrink-0 overflow-hidden shadow-sm"
            >
            <div className="p-4 border-b border-white/5 bg-[#0B1120]/50 flex justify-between items-center">
              <h3 className="text-sm font-bold text-[#F8FAFC]">Doctor Profile</h3>
              <button onClick={() => setSelectedDoctor(null)} className="text-[#94A3B8] hover:text-[#FF4D6D] transition-colors">
                <X size={16} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar pb-6">
              {/* Profile Header */}
              <div className="p-6 flex flex-col items-center text-center border-b border-white/5 bg-gradient-to-b from-[#18E0FF]/5 to-transparent">
                 <img src={selectedDoctor.photo} alt={selectedDoctor.name} className="w-24 h-24 rounded-2xl object-cover border-2 border-[#18E0FF]/30 shadow-[0_0_20px_rgba(24,224,255,0.15)] mb-4" />
                 <h2 className="text-xl font-bold text-[#F8FAFC]">{selectedDoctor.name}</h2>
                 <p className="text-[10px] font-bold text-[#18E0FF] uppercase tracking-widest mt-1 mb-2">{selectedDoctor.specialization}</p>
                 <div className="flex gap-2 text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">
                   <span className="bg-[#0B1120] border border-white/5 px-2 py-1 rounded">{selectedDoctor.qualification}</span>
                   <span className="bg-[#0B1120] border border-white/5 px-2 py-1 rounded">{selectedDoctor.experience} Yrs Exp</span>
                 </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 grid grid-cols-2 gap-2 border-b border-white/5">
                 <button onClick={assignPatient} className="bg-[#18E0FF]/10 hover:bg-[#18E0FF]/20 text-[#18E0FF] border border-[#18E0FF]/20 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5">
                   <UserPlus size={12} /> Assign Pt
                 </button>
                 <button className="bg-[#0B1120] hover:bg-white/5 text-[#F8FAFC] border border-white/10 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5">
                   <MessageSquare size={12} /> Message
                 </button>
                 <button className="bg-[#0B1120] hover:bg-white/5 text-[#F8FAFC] border border-white/10 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5">
                   <Phone size={12} /> Call
                 </button>
                 <button onClick={() => handleDeleteDoctor(selectedDoctor.firebaseId, selectedDoctor.id)} className="bg-[#FF4D6D]/10 hover:bg-[#FF4D6D]/20 text-[#FF4D6D] border border-[#FF4D6D]/20 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5">
                   <X size={12} /> Delete
                 </button>
              </div>

              {/* Status & Workload */}
              <div className="p-6 border-b border-white/5 space-y-4">
                 <h4 className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-3">Current Status</h4>
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <span className={`w-2 h-2 rounded-full ${getStatusDot(selectedDoctor.status)}`}></span>
                       <span className={`text-xs font-bold uppercase tracking-widest ${getStatusColor(selectedDoctor.status)}`}>{selectedDoctor.status}</span>
                    </div>
                    <span className="text-xs font-semibold text-[#F8FAFC] bg-[#0B1120] px-2 py-1 rounded">{selectedDoctor.room}</span>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="bg-[#0B1120] border border-white/5 p-3 rounded-lg text-center">
                       <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-1">Queue</p>
                       <p className="text-xl font-bold text-[#F8FAFC]">{selectedDoctor.patientsQueue}</p>
                    </div>
                    <div className="bg-[#0B1120] border border-white/5 p-3 rounded-lg text-center">
                       <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-1">Today Appts</p>
                       <p className="text-xl font-bold text-[#F8FAFC]">{selectedDoctor.appointmentsToday}</p>
                    </div>
                 </div>
              </div>

              {/* Professional Details */}
              <div className="p-6 space-y-4">
                 <h4 className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-2">Professional Info</h4>
                 
                 <div className="space-y-3">
                   <div className="flex justify-between items-center text-xs">
                     <span className="font-semibold text-[#94A3B8]">License</span>
                     <span className="font-bold text-[#F8FAFC]">{selectedDoctor.registrationNumber}</span>
                   </div>
                   <div className="flex justify-between items-center text-xs">
                     <span className="font-semibold text-[#94A3B8]">Shift</span>
                     <span className="font-bold text-[#F8FAFC]">{selectedDoctor.workingHours} ({selectedDoctor.shift})</span>
                   </div>
                   <div className="flex justify-between items-center text-xs">
                     <span className="font-semibold text-[#94A3B8]">Languages</span>
                     <span className="font-bold text-[#F8FAFC]">{selectedDoctor.languages}</span>
                   </div>
                   <div className="flex justify-between items-center text-xs">
                     <span className="font-semibold text-[#94A3B8]">Rating</span>
                     <span className="font-bold text-[#FACC15] flex items-center gap-1"><Star size={10} className="fill-[#FACC15]" /> {selectedDoctor.rating}</span>
                   </div>
                 </div>

                 <h4 className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mt-6 mb-2">Biography</h4>
                 <p className="text-xs text-[#94A3B8] leading-relaxed">
                   {selectedDoctor.bio}
                 </p>
              </div>

            </div>
          </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AddStaffModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAdd={handleAddDoctor}
        category="Doctors"
      />
    </div>
  );
};

export default ClinicalStaff;
