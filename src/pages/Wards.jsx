import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BedDouble, CheckCircle2, UserPlus, FileText, AlertCircle, Map, Info, UserMinus, ShieldAlert, Sparkles, User, Stethoscope, Activity, ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';
import { HOSPITAL_DATA } from '../utils/hospitalData';

const generateInitialHospitalData = () => {
  return HOSPITAL_DATA.wards;
};

const Wards = () => {
  const [hospitalData, setHospitalData] = useState(generateInitialHospitalData());
  const [selectedFloorIndex, setSelectedFloorIndex] = useState(0);
  const [selectedBed, setSelectedBed] = useState(null);

  const updateBedState = (bed, newState, newPatient = null) => {
    setHospitalData(prev => {
      const newData = [...prev];
      newData[bed.floorIndex].rooms[bed.roomIndex].beds[bed.bedIndex] = {
        ...bed,
        state: newState,
        patient: newPatient
      };
      setSelectedBed(newData[bed.floorIndex].rooms[bed.roomIndex].beds[bed.bedIndex]);
      return newData;
    });
  };

  const manualAdmit = () => {
    if (!selectedBed) return;
    const patient = {
      id: `P${Math.floor(1000 + Math.random() * 9000)}`,
      name: ['Rahul Sharma', 'Anjali Gupta', 'Priya Singh', 'Vikram Desai', 'Arjun Patel', 'Neha Verma'][Math.floor(Math.random() * 6)],
      age: Math.floor(Math.random() * 50) + 20,
      disease: ['Cataract', 'Glaucoma', 'Post-Op', 'Retinal Detachment', 'Corneal Ulcer'][Math.floor(Math.random() * 5)],
      admitted: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
      expectedDischarge: new Date(Date.now() + 86400000 * 5).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
    };
    updateBedState(selectedBed, 'occupied', patient);
    toast.success(`Patient admitted to Bed ${selectedBed.id}`, {
      style: { background: '#141D31', border: '1px solid rgba(255,255,255,0.05)', color: '#F8FAFC' }
    });
  };

  const manualDischarge = () => {
    if (!selectedBed) return;
    updateBedState(selectedBed, 'housekeeping', null);
    toast.info(`Patient discharged. Bed ${selectedBed.id} requires housekeeping.`, {
      style: { background: '#141D31', border: '1px solid rgba(255,255,255,0.05)', color: '#F8FAFC' }
    });
  };

  const manualClean = () => {
    if (!selectedBed) return;
    updateBedState(selectedBed, 'available', null);
    toast.success(`Bed ${selectedBed.id} cleaned and available.`, {
      style: { background: '#141D31', border: '1px solid rgba(255,255,255,0.05)', color: '#F8FAFC' }
    });
  };

  const manualReserveER = () => {
    if (!selectedBed) return;
    updateBedState(selectedBed, 'emergency', null);
    toast.info(`Bed ${selectedBed.id} reserved for Emergency.`, {
      style: { background: '#141D31', border: '1px solid rgba(255,255,255,0.05)', color: '#F8FAFC' }
    });
  };

  const stats = useMemo(() => {
    let total = 0, available = 0, occupied = 0, emergency = 0, housekeeping = 0, maintenance = 0;
    hospitalData.forEach(floor => {
      floor.rooms.forEach(room => {
        room.beds.forEach(bed => {
          total++;
          if (bed.state === 'available') available++;
          if (bed.state === 'occupied') occupied++;
          if (bed.state === 'emergency') emergency++;
          if (bed.state === 'housekeeping') housekeeping++;
          if (bed.state === 'maintenance') maintenance++;
        });
      });
    });
    return { total, available, occupied, emergency, housekeeping, maintenance, occupancy: total > 0 ? ((occupied / total) * 100).toFixed(1) : 0 };
  }, [hospitalData]);

  const selectedFloor = hospitalData[selectedFloorIndex];

  const getBedColor = (state) => {
    switch(state) {
      case 'available': return 'bg-[#22C55E] border-[#22C55E]/30';
      case 'occupied': return 'bg-[#FF4D6D] border-[#FF4D6D]/30';
      case 'emergency': return 'bg-[#18E0FF] border-[#18E0FF]/30';
      case 'housekeeping': return 'bg-[#FACC15] border-[#FACC15]/30';
      default: return 'bg-gray-500 border-gray-500/30';
    }
  };

  const getBedTextColor = (state) => {
    switch(state) {
      case 'available': return 'text-[#22C55E]';
      case 'occupied': return 'text-[#FF4D6D]';
      case 'emergency': return 'text-[#18E0FF]';
      case 'housekeeping': return 'text-[#FACC15]';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="space-y-4 pb-8 h-full flex flex-col relative font-sans">
      
      {/* 1. TOP SUMMARY BAR */}
      <div className="bg-[#131C33] border border-white/5 rounded-xl p-4 flex flex-col xl:flex-row xl:items-center justify-between gap-4 shadow-sm">
         <div className="flex flex-col">
           <h1 className="text-xl font-bold text-[#F8FAFC]">Hospital Overview</h1>
           <p className="text-[#94A3B8] text-xs mt-1">Real-time bed tracking and department layout.</p>
         </div>

         <div className="flex flex-wrap items-center gap-6 text-xs border-l border-white/5 pl-6">
           <div className="flex flex-col"><span className="text-[#94A3B8] font-bold uppercase tracking-widest text-[9px] mb-1">Total Beds</span><span className="font-bold text-[#F8FAFC] text-sm">{stats.total}</span></div>
           <div className="flex flex-col"><span className="text-[#94A3B8] font-bold uppercase tracking-widest text-[9px] mb-1">Occupied</span><span className="font-bold text-[#FF4D6D] text-sm">{stats.occupied}</span></div>
           <div className="flex flex-col"><span className="text-[#94A3B8] font-bold uppercase tracking-widest text-[9px] mb-1">Available</span><span className="font-bold text-[#22C55E] text-sm">{stats.available}</span></div>
           <div className="flex flex-col"><span className="text-[#94A3B8] font-bold uppercase tracking-widest text-[9px] mb-1">Housekeeping</span><span className="font-bold text-[#FACC15] text-sm">{stats.housekeeping}</span></div>
           <div className="flex flex-col"><span className="text-[#94A3B8] font-bold uppercase tracking-widest text-[9px] mb-1">Emergency</span><span className="font-bold text-[#18E0FF] text-sm">{stats.emergency}</span></div>
           <div className="flex flex-col"><span className="text-[#94A3B8] font-bold uppercase tracking-widest text-[9px] mb-1">Reserved</span><span className="font-bold text-[#F8FAFC] text-sm">{stats.maintenance}</span></div>
           <div className="flex flex-col"><span className="text-[#94A3B8] font-bold uppercase tracking-widest text-[9px] mb-1">Occupancy</span><span className="font-bold text-[#18E0FF] text-sm">{stats.occupancy}%</span></div>
         </div>
      </div>

      {/* 2. MIDDLE: VISUAL FLOOR LAYOUT */}
      <div className="flex-1 flex gap-4 h-[calc(100vh-200px)] min-h-[600px] overflow-hidden">
        
        {/* Left: Floors */}
        <div className="w-64 bg-[#131C33] border border-white/5 rounded-xl flex flex-col shrink-0 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-white/5 bg-[#0B1120]/50">
            <h3 className="text-xs font-bold text-[#F8FAFC] uppercase tracking-widest">Departments</h3>
          </div>
          <div className="flex-1 p-3 space-y-2 overflow-y-auto custom-scrollbar">
            {hospitalData.map((floor, index) => (
              <button
                key={floor.floor}
                onClick={() => { setSelectedFloorIndex(index); setSelectedBed(null); }}
                className={`w-full text-left p-3 rounded-lg transition-all flex flex-col gap-1.5 border ${selectedFloorIndex === index ? 'bg-[#18E0FF]/5 border-[#18E0FF]/20 shadow-[0_0_15px_rgba(24,224,255,0.02)]' : 'border-transparent hover:bg-[#0B1120]/50'}`}
              >
                <div className="flex justify-between items-center w-full">
                   <span className={`text-xs font-bold flex items-center gap-2 ${selectedFloorIndex === index ? 'text-[#18E0FF]' : 'text-[#F8FAFC]'}`}>
                      {floor.dept}
                   </span>
                </div>
                <div className="flex justify-between items-center w-full">
                   <span className="text-[10px] font-bold text-[#94A3B8]">{floor.floor}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Center: Visual Room Layout */}
        <div className="flex-1 bg-[#131C33] border border-white/5 rounded-xl flex flex-col overflow-hidden shadow-sm">
          <div className="p-4 border-b border-white/5 bg-[#0B1120]/50 flex justify-between items-center">
            <h2 className="text-sm font-bold text-[#F8FAFC] tracking-widest uppercase flex items-center gap-2">
               {selectedFloor.floor} <span className="text-[#94A3B8]">|</span> {selectedFloor.dept} Ward
            </h2>
            <div className="flex gap-4">
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest"><span className="w-2 h-2 rounded bg-[#22C55E]"></span> Avail</span>
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest"><span className="w-2 h-2 rounded bg-[#FF4D6D]"></span> Occ</span>
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest"><span className="w-2 h-2 rounded bg-[#18E0FF]"></span> ER</span>
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest"><span className="w-2 h-2 rounded bg-[#FACC15]"></span> Clean</span>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 bg-[#0B1120]/30 custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {selectedFloor.rooms.map(room => {
                let rAvail = 0, rOcc = 0, rEmerg = 0, rClean = 0;
                room.beds.forEach(b => {
                  if (b.state === 'available') rAvail++;
                  if (b.state === 'occupied') rOcc++;
                  if (b.state === 'emergency') rEmerg++;
                  if (b.state === 'housekeeping') rClean++;
                });

                return (
                  <div key={room.id} className="bg-[#131C33] border border-white/5 rounded-xl flex flex-col shadow-sm">
                    {/* Room Header */}
                    <div className="p-4 border-b border-white/5 bg-[#0B1120]/20 flex justify-between items-center">
                       <div>
                          <span className="text-[10px] font-bold text-[#18E0FF] uppercase tracking-widest block mb-0.5">{selectedFloor.dept} Ward</span>
                          <span className="font-bold text-[#F8FAFC] text-sm">Room {room.id}</span>
                       </div>
                       <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest bg-[#0B1120] px-2 py-1 rounded">10 Beds</span>
                    </div>

                    {/* Beds Grid */}
                    <div className="p-4 border-b border-white/5">
                      <div className="grid grid-cols-5 gap-2">
                        {room.beds.map(bed => (
                          <motion.button
                            key={bed.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedBed(bed)}
                            className={`relative h-10 rounded border flex items-center justify-center transition-all ${getBedColor(bed.state)} ${selectedBed?.id === bed.id ? 'ring-2 ring-white ring-offset-2 ring-offset-[#131C33] z-10' : 'opacity-80 hover:opacity-100'}`}
                          >
                             <span className={`text-[10px] font-bold ${bed.state === 'available' || bed.state === 'housekeeping' ? 'text-black' : 'text-white'}`}>
                               {bed.id.replace('B', '')}
                             </span>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Room Stats & Staff */}
                    <div className="p-4 bg-[#0B1120]/10 grid grid-cols-2 gap-4">
                       <div className="flex flex-col gap-2 border-r border-white/5 pr-2">
                          <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest"><span className="text-[#94A3B8]">Available</span><span className="text-[#22C55E]">{rAvail}</span></div>
                          <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest"><span className="text-[#94A3B8]">Occupied</span><span className="text-[#FF4D6D]">{rOcc}</span></div>
                          <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest"><span className="text-[#94A3B8]">Emergency</span><span className="text-[#18E0FF]">{rEmerg}</span></div>
                          <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest"><span className="text-[#94A3B8]">Housekeeping</span><span className="text-[#FACC15]">{rClean}</span></div>
                       </div>
                       <div className="flex flex-col gap-3 justify-center">
                          <div>
                            <span className="text-[9px] font-bold text-[#94A3B8] uppercase tracking-widest flex items-center gap-1 mb-1"><User size={10} /> Assigned Nurse</span>
                            <div className="flex items-center gap-2">
                               <img src={room.assignedNurse.photo} alt={room.assignedNurse.name} className="w-8 h-8 rounded object-cover border border-white/10" />
                               <div className="flex flex-col gap-0.5">
                                 <span className="text-xs font-semibold text-[#F8FAFC] truncate block">{room.assignedNurse.name}</span>
                                 <span className="text-[9px] text-[#94A3B8] uppercase tracking-widest">{room.assignedNurse.experience} Yrs • {room.assignedNurse.workingHours}</span>
                                 <span className="text-[9px] text-[#18E0FF] font-bold uppercase tracking-widest">{room.assignedNurse.status}</span>
                               </div>
                            </div>
                          </div>
                          <div className="mt-1 border-t border-white/5 pt-2">
                            <span className="text-[9px] font-bold text-[#94A3B8] uppercase tracking-widest flex items-center gap-1 mb-0.5"><Stethoscope size={10} /> Doctor</span>
                            <span className="text-xs font-semibold text-[#F8FAFC] truncate block">{room.assignedDoctor}</span>
                          </div>
                       </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Bed Inspector Profile Panel */}
        <AnimatePresence>
          {selectedBed && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="w-80 lg:w-[340px] bg-[#131C33] border border-white/5 rounded-xl flex flex-col shrink-0 overflow-hidden shadow-sm"
            >
              <div className="p-4 border-b border-white/5 bg-[#0B1120]/50 flex justify-between items-center">
                <h3 className="text-sm font-bold text-[#F8FAFC]">Bed Management</h3>
                <button onClick={() => setSelectedBed(null)} className="text-[#94A3B8] hover:text-[#FF4D6D] transition-colors">
                  <X size={16} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                 {/* Bed Header */}
                 <div className="p-6 border-b border-white/5 flex flex-col items-center justify-center text-center bg-gradient-to-b from-white/5 to-transparent">
                    <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-1">Bed Number</span>
                    <h2 className="text-4xl font-bold text-[#F8FAFC] tracking-tight">{selectedBed.id}</h2>
                    <span className={`mt-3 px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${getStatusTextColor(selectedBed.state)} bg-[#0B1120] border border-white/5 shadow-sm`}>
                      Status: {selectedBed.state}
                    </span>
                 </div>

                 {selectedBed.patient ? (
                    <div className="p-6 space-y-5">
                       <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Patient</span>
                          <span className="text-sm font-bold text-[#F8FAFC] flex items-center gap-2">
                            {selectedBed.patient.name} 
                            <span className="text-[10px] bg-[#18E0FF]/10 text-[#18E0FF] px-2 py-0.5 rounded-full border border-[#18E0FF]/20">{selectedBed.patient.id}</span>
                          </span>
                       </div>

                       <div className="grid grid-cols-2 gap-4">
                          <div className="flex flex-col gap-1">
                             <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Disease</span>
                             <span className="text-xs font-semibold text-[#FF4D6D]">{selectedBed.patient.disease}</span>
                          </div>
                          <div className="flex flex-col gap-1">
                             <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Doctor</span>
                             <span className="text-xs font-semibold text-[#F8FAFC]">{hospitalData[selectedBed.floorIndex].rooms[selectedBed.roomIndex].assignedDoctor}</span>
                          </div>
                          <div className="flex flex-col gap-1">
                             <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Admitted</span>
                             <span className="text-xs font-semibold text-[#F8FAFC]">{selectedBed.patient.admitted}</span>
                          </div>
                          <div className="flex flex-col gap-1">
                             <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Discharge</span>
                             <span className="text-xs font-bold text-[#18E0FF]">{selectedBed.patient.expectedDischarge}</span>
                          </div>
                       </div>

                       <div className="bg-[#0B1120] p-4 rounded-xl border border-white/5 space-y-2 mt-2">
                          <div className="flex justify-between items-center">
                             <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Ward</span>
                             <span className="text-xs font-semibold text-[#F8FAFC]">{hospitalData[selectedBed.floorIndex].dept}</span>
                          </div>
                          <div className="flex justify-between items-center">
                             <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Room</span>
                             <span className="text-xs font-semibold text-[#F8FAFC]">{selectedBed.room}</span>
                          </div>
                          <div className="flex justify-between items-center">
                             <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Floor</span>
                             <span className="text-xs font-semibold text-[#F8FAFC]">{hospitalData[selectedBed.floorIndex].floor}</span>
                          </div>
                          <div className="pt-2 border-t border-white/5 space-y-2 mt-2">
                             <div className="flex justify-between items-center">
                                <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Nurse</span>
                                <div className="flex items-center gap-2">
                                  <img src={hospitalData[selectedBed.floorIndex].rooms[selectedBed.roomIndex].assignedNurse.photo} className="w-5 h-5 rounded object-cover" alt="" />
                                  <span className="text-xs font-semibold text-[#F8FAFC]">{hospitalData[selectedBed.floorIndex].rooms[selectedBed.roomIndex].assignedNurse.name}</span>
                                </div>
                             </div>
                             <div className="flex justify-between items-center">
                                <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Contact</span>
                                <span className="text-xs font-semibold text-[#94A3B8]">{hospitalData[selectedBed.floorIndex].rooms[selectedBed.roomIndex].assignedNurse.mobile}</span>
                             </div>
                             <div className="flex justify-between items-center">
                                <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Email</span>
                                <span className="text-xs font-semibold text-[#94A3B8] truncate w-32 text-right" title={hospitalData[selectedBed.floorIndex].rooms[selectedBed.roomIndex].assignedNurse.email}>{hospitalData[selectedBed.floorIndex].rooms[selectedBed.roomIndex].assignedNurse.email}</span>
                             </div>
                          </div>
                       </div>

                       <button onClick={manualDischarge} className="w-full bg-[#131C33] hover:bg-[#FF4D6D]/10 text-[#FF4D6D] border border-[#FF4D6D]/20 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 mt-4 shadow-sm">
                         <UserMinus size={14} /> Discharge Patient
                       </button>
                    </div>
                 ) : (
                    <div className="p-8 flex flex-col items-center justify-center text-center">
                       <CheckCircle2 size={40} className={`${getStatusTextColor(selectedBed.state)} mb-4`} />
                       <p className="font-bold text-[#F8FAFC] text-sm">
                         {selectedBed.state === 'available' ? 'Bed is clean and ready.' : 
                          selectedBed.state === 'emergency' ? 'Locked for incoming ER.' : 'Requires housekeeping.'}
                       </p>
                       
                       <div className="w-full space-y-3 mt-8">
                         {selectedBed.state === 'available' && (
                           <>
                             <button onClick={manualAdmit} className="w-full bg-[#22C55E]/10 hover:bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/20 px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2">
                                <UserPlus size={14} /> Assign Patient
                             </button>
                             <button onClick={manualReserveER} className="w-full bg-[#18E0FF]/10 hover:bg-[#18E0FF]/20 text-[#18E0FF] border border-[#18E0FF]/20 px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2">
                                <ShieldAlert size={14} /> Reserve ER
                             </button>
                           </>
                         )}
                         {selectedBed.state === 'housekeeping' && (
                           <button onClick={manualClean} className="w-full bg-[#FACC15]/10 hover:bg-[#FACC15]/20 text-[#FACC15] border border-[#FACC15]/20 px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2">
                              <Sparkles size={14} /> Mark as Clean
                           </button>
                         )}
                         {selectedBed.state === 'emergency' && (
                           <>
                             <button onClick={manualAdmit} className="w-full bg-[#FF4D6D]/10 hover:bg-[#FF4D6D]/20 text-[#FF4D6D] border border-[#FF4D6D]/20 px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2">
                                <UserPlus size={14} /> Admit ER Patient
                             </button>
                             <button onClick={manualClean} className="w-full bg-[#131C33] border border-white/5 hover:bg-white/5 text-[#94A3B8] px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2">
                                Release Reservation
                             </button>
                           </>
                         )}
                       </div>
                    </div>
                 )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3. BOTTOM SUMMARY TABLE */}
      <div className="bg-[#131C33] border border-white/5 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="border-b border-white/5 bg-[#0B1120]/50">
            <tr>
              <th className="px-6 py-4 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Floor</th>
              <th className="px-6 py-4 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Ward</th>
              <th className="px-6 py-4 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest text-right">Rooms</th>
              <th className="px-6 py-4 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest text-right">Beds</th>
              <th className="px-6 py-4 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest text-right">Available</th>
              <th className="px-6 py-4 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest text-right">Occupied</th>
              <th className="px-6 py-4 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest text-right">Emergency</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {hospitalData.map(floor => {
              let rTotal = 0, fAvail = 0, fOcc = 0, fEmerg = 0;
              floor.rooms.forEach(r => {
                r.beds.forEach(b => {
                  rTotal++;
                  if (b.state === 'available') fAvail++;
                  if (b.state === 'occupied') fOcc++;
                  if (b.state === 'emergency') fEmerg++;
                });
              });
              return (
                <tr key={floor.floor} className="hover:bg-[#0B1120]/30 transition-colors">
                  <td className="px-6 py-4 font-semibold text-xs text-[#F8FAFC]">{floor.floor}</td>
                  <td className="px-6 py-4 font-semibold text-xs text-[#18E0FF]">{floor.dept}</td>
                  <td className="px-6 py-4 font-mono text-xs text-[#94A3B8] text-right">{floor.rooms.length}</td>
                  <td className="px-6 py-4 font-mono text-xs text-[#94A3B8] text-right">{rTotal}</td>
                  <td className="px-6 py-4 font-mono text-xs text-[#22C55E] text-right">{fAvail}</td>
                  <td className="px-6 py-4 font-mono text-xs text-[#FF4D6D] text-right">{fOcc}</td>
                  <td className="px-6 py-4 font-mono text-xs text-[#18E0FF] text-right">{fEmerg}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Wards;
