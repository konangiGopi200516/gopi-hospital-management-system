import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Stethoscope, Users, Mail, Phone, X } from 'lucide-react';
import { services, getDoctorsForDept } from '../data/mockData';

const getInitials = (name) => {
  const parts = name.replace('Dr. ', '').split(' ');
  return parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : parts[0][0].toUpperCase();
};

const PublicDepartments = () => {
  const navigate = useNavigate();
  const [selectedDept, setSelectedDept] = useState(null);

  return (
    <div className="py-12 bg-[#0B1120] relative">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#F8FAFC]">Eye Departments</h1>
          <p className="text-[#94A3B8] max-w-2xl mx-auto text-lg">Comprehensive ophthalmology services and specialized care units.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedDept(service)}
              className="bg-[#141D31] rounded-3xl group hover:-translate-y-2 border border-white/5 hover:border-[#18E0FF]/40 transition-all duration-500 cursor-pointer overflow-hidden shadow-lg flex flex-col"
            >
              {/* Image Section */}
              <div className="relative h-56 overflow-hidden">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${service.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141D31] to-transparent"></div>
              </div>
              
              {/* Content Section */}
              <div className="relative p-6 pt-0 flex flex-col flex-1">
                <div className="w-14 h-14 rounded-2xl bg-[#0B1120] flex items-center justify-center text-[#18E0FF] mb-4 shadow-xl -mt-7 relative z-10 border border-white/5 group-hover:border-[#18E0FF]/40 transition-colors">
                  <service.icon size={28} />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-[#F8FAFC] group-hover:text-[#18E0FF] transition-colors">{service.title}</h3>
                
                <p className="text-[#94A3B8] text-sm mb-6 flex-1 line-clamp-2">
                  {service.description}
                </p>
                
                <div className="flex items-center text-[#18E0FF] text-sm font-bold uppercase tracking-widest gap-2 mt-auto pt-4 border-t border-white/5">
                  View Department <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedDept && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-[#0B1120]/80 backdrop-blur-sm"
            onClick={() => setSelectedDept(null)}
          >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl max-h-[90vh] bg-[#0B1120] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Modal Header with Image */}
            <div className="relative h-64 shrink-0 border-b border-white/5">
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${selectedDept.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-[#0B1120]/80 to-transparent"></div>
              
              <button 
                onClick={() => setSelectedDept(null)}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-xl bg-black/50 border border-white/10 flex items-center justify-center text-white hover:bg-black/80 transition-colors backdrop-blur-md"
              >
                <X size={20} />
              </button>

              <div className="absolute bottom-0 left-0 w-full p-6 sm:p-8 flex items-end gap-6">
                <div className="hidden sm:flex w-20 h-20 rounded-2xl bg-[#18E0FF]/20 backdrop-blur-md items-center justify-center text-[#18E0FF] border border-[#18E0FF]/30 shadow-[0_0_20px_rgba(24,224,255,0.2)] shrink-0">
                  <selectedDept.icon size={40} />
                </div>
                <div className="flex-1">
                  <h3 className="text-3xl font-bold text-white mb-2">{selectedDept.title}</h3>
                  <p className="text-[#18E0FF] text-sm font-semibold uppercase tracking-widest mb-3">
                    {selectedDept.total} Dedicated Specialists
                  </p>
                  <p className="text-[#94A3B8] text-sm sm:text-base max-w-2xl leading-relaxed mb-4">
                    {selectedDept.description}
                  </p>
                  
                  {selectedDept.conditions && (
                    <div className="flex flex-wrap gap-2">
                      {selectedDept.conditions.map((condition, idx) => (
                        <span key={idx} className="px-3 py-1 bg-[#18E0FF]/10 text-[#18E0FF] border border-[#18E0FF]/20 rounded-full text-xs font-bold tracking-wider">
                          {condition}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 custom-scrollbar bg-[#0B1120]">
              <h4 className="text-xl font-bold mb-6 text-white border-b border-white/5 pb-4">Department Roster</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getDoctorsForDept(selectedDept).map((doc) => (
                  <div key={doc.id} className="p-5 rounded-xl bg-[#141D31] border border-white/5 flex flex-col gap-4 group hover:border-[#18E0FF]/30 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-4">
                        <img 
                          src={doc.photo} 
                          alt={doc.name} 
                          className="w-12 h-12 rounded-full border-2 border-white/10 object-cover shrink-0"
                        />
                        <div>
                          <h4 className="font-bold text-[#F8FAFC] text-lg">{doc.name}</h4>
                          <p className="text-xs font-bold text-[#18E0FF] uppercase tracking-widest">{selectedDept.title}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-[#94A3B8]">
                      <div className="flex items-center gap-3">
                        <Mail size={16} className="text-[#94A3B8]" />
                        <span>{doc.email}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone size={16} className="text-[#94A3B8]" />
                        <span>{doc.mobile}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PublicDepartments;
