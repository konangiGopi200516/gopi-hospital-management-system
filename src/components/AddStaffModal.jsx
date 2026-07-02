import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus } from 'lucide-react';

const AddStaffModal = ({ isOpen, onClose, onAdd, category }) => {
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    experience: '',
    phone: '',
    email: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newStaff = {
      id: `EMP-${category.substring(0, 3).toUpperCase()}-${Math.floor(Math.random() * 1000)}`,
      name: formData.name,
      category: category,
      department: formData.department || 'General',
      designation: category === 'Doctors' ? 'Consultant' : category === 'Nurses' ? 'Staff Nurse' : 'Housekeeper',
      experience: parseInt(formData.experience) || 0,
      phone: formData.phone || '+91 0000000000',
      email: formData.email || `${formData.name.toLowerCase().replace(/ /g, '.')}@visioncare.com`,
      mobile: formData.phone || '+91 0000000000',
      basic: category === 'Doctors' ? 80000 : 25000,
      status: category === 'Doctors' ? 'Available' : 'Paid',
      attendance: 'Present',
      shift: 'Morning',
      room: 'TBD',
      patientsQueue: 0,
      appointmentsToday: 0,
      photo: `https://randomuser.me/api/portraits/lego/${Math.floor(Math.random() * 9) + 1}.jpg`
    };
    onAdd(newStaff);
    setFormData({ name: '', department: '', experience: '', phone: '', email: '' });
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 font-sans"
      >
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-[#131C33] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
        >
          <div className="p-5 border-b border-white/5 flex justify-between items-center bg-[#0B1120]/50">
            <h2 className="text-lg font-bold text-[#F8FAFC]">Add New {category.slice(0, -1)}</h2>
            <button onClick={onClose} className="text-[#94A3B8] hover:text-[#FF4D6D] transition-colors">
              <X size={20} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#94A3B8] uppercase tracking-widest">Full Name</label>
              <input 
                required
                type="text" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-[#0B1120] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-[#F8FAFC] focus:border-[#18E0FF] outline-none"
                placeholder={category === 'Doctors' ? "Dr. John Doe" : "Jane Doe"}
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#94A3B8] uppercase tracking-widest">Department / Room</label>
              <input 
                required
                type="text" 
                value={formData.department}
                onChange={e => setFormData({...formData, department: e.target.value})}
                className="w-full bg-[#0B1120] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-[#F8FAFC] focus:border-[#18E0FF] outline-none"
                placeholder="e.g. Retina & Vitreous"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#94A3B8] uppercase tracking-widest">Experience (Yrs)</label>
                <input 
                  type="number" 
                  value={formData.experience}
                  onChange={e => setFormData({...formData, experience: e.target.value})}
                  className="w-full bg-[#0B1120] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-[#F8FAFC] focus:border-[#18E0FF] outline-none"
                  placeholder="5"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#94A3B8] uppercase tracking-widest">Phone Number</label>
                <input 
                  type="text" 
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-[#0B1120] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-[#F8FAFC] focus:border-[#18E0FF] outline-none"
                  placeholder="+91..."
                />
              </div>
            </div>

            <div className="pt-4">
              <button 
                type="submit"
                className="w-full bg-[#18E0FF] text-[#0B1120] font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-[#18E0FF]/90 transition-colors shadow-[0_0_15px_rgba(24,224,255,0.4)]"
              >
                <Plus size={18} /> Add {category.slice(0, -1)}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddStaffModal;
