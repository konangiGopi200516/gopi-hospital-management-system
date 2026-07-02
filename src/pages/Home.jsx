import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, ShieldCheck, Activity, Users, ChevronRight, Stethoscope, Clock, MapPin, Phone, ArrowRight, Scan, Droplet, Mail, X } from 'lucide-react';
import { motion, useAnimation } from 'framer-motion';

import { services, stats, allDoctors, getDoctorsForDept } from '../data/mockData';

const getInitials = (name) => {
  const parts = name.replace('Dr. ', '').split(' ');
  return parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : parts[0][0].toUpperCase();
};

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#0B1120] min-h-screen text-[#F8FAFC] font-sans selection:bg-[#18E0FF]/30">
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 lg:pt-28 lg:pb-24 overflow-hidden">
        {/* Parallax Background */}
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 transform scale-105 motion-safe:animate-[pulse_20s_ease-in-out_infinite_alternate]"
            style={{ 
              backgroundImage: 'url("/images/hero-bg.jpg")',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B1120]/80 via-[#0B1120]/60 to-[#0B1120]"></div>
          
          {/* Animated Orbs */}
          <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-[#18E0FF]/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>
          <div className="absolute bottom-[10%] right-[10%] w-[600px] h-[600px] bg-[#3B82F6]/10 rounded-full blur-[150px] mix-blend-screen pointer-events-none"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center max-w-4xl">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#141D31]/80 border border-white/10 text-xs font-bold uppercase tracking-widest text-[#18E0FF] mb-8 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#18E0FF] shadow-[0_0_10px_rgba(24,224,255,0.8)] animate-pulse"></span>
              Advanced Ophthalmology Center
            </div>
            <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] mb-6 tracking-tight">
              Protecting Your Vision with <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#18E0FF] to-[#3B82F6]">
                Advanced Eye Care
              </span>
            </h1>
            <p className="text-lg md:text-xl text-[#94A3B8] mb-12 max-w-2xl mx-auto leading-relaxed">
              Experience world-class eye care with state-of-the-art diagnostics, LASIK, and microscopic surgeries. We see the world through your eyes.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => navigate('/appointments/book')}
                className="w-full sm:w-auto btn-primary px-8 py-4 rounded-xl font-bold text-sm tracking-widest uppercase flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(24,224,255,0.3)]"
              >
                Schedule
              </button>
              <button className="w-full sm:w-auto bg-[#FF296D]/10 hover:bg-[#FF296D]/20 text-[#FF296D] border border-[#FF296D]/20 transition-all duration-300 px-8 py-4 rounded-xl font-bold text-sm tracking-widest uppercase flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,41,109,0.15)]">
                <Activity size={16} /> Emergency Eye Care
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="departments" className="py-24 bg-[#0B1120] relative border-t border-white/5">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Specialized Eye <span className="text-[#18E0FF]">Departments</span></h2>
            <p className="text-[#94A3B8] text-lg max-w-2xl mx-auto">Comprehensive, world-class ophthalmology services under one roof.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={() => navigate('/departments')}
                className="relative p-8 rounded-3xl group hover:-translate-y-2 border border-white/5 hover:border-[#18E0FF]/40 transition-all duration-500 cursor-pointer overflow-hidden shadow-lg min-h-[320px] flex flex-col justify-end"
              >
                {/* Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${service.image})` }}
                />
                
                {/* Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-[#0B1120]/80 to-[#0B1120]/30"></div>
                <div className="absolute inset-0 bg-[#18E0FF]/0 group-hover:bg-[#18E0FF]/20 transition-colors duration-500 mix-blend-overlay"></div>
                
                <div className="relative z-10 mt-auto">
                  <div className="w-14 h-14 rounded-2xl bg-[#18E0FF]/20 backdrop-blur-md flex items-center justify-center text-[#18E0FF] group-hover:bg-[#18E0FF] group-hover:text-[#0B1120] mb-4 transition-colors duration-300 shadow-[0_0_15px_rgba(24,224,255,0.2)] border border-[#18E0FF]/30">
                    <service.icon size={28} />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-[#F8FAFC] group-hover:text-white transition-colors drop-shadow-md">{service.title}</h3>
                  <div className="flex flex-wrap items-center gap-2 text-sm font-semibold mb-4 w-full">
                    <div className="flex items-center gap-1.5 text-[#F8FAFC] bg-black/50 px-3 py-1 rounded-full backdrop-blur-md border border-white/10 shadow-lg">
                      <Stethoscope size={14} className="text-[#18E0FF]" />
                      <span>{service.total} Doctors</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#F8FAFC] bg-black/50 px-3 py-1 rounded-full backdrop-blur-md border border-white/10 shadow-lg">
                      <Users size={14} className="text-[#22C55E]" />
                      <span className="text-[#22C55E]">{service.avail} Avail</span>
                    </div>
                  </div>
                  <div className="flex items-center text-[#18E0FF] text-sm font-bold uppercase tracking-widest gap-2 opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg">
                    Explore <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Doctors Section */}
      <section id="doctors" className="py-24 bg-[#141D31]/30 relative border-t border-white/5">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#3B82F6]/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3B82F6]/10 border border-[#3B82F6]/20 text-[10px] font-bold uppercase tracking-widest text-[#3B82F6] mb-4">
                <Stethoscope size={12} />
                Clinical Excellence
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">
                Our Expert <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#18E0FF] to-[#3B82F6] drop-shadow-sm">Doctors</span>
              </h2>
              <p className="text-[#94A3B8] text-lg leading-relaxed">
                Meet our dedicated team of experienced eye care specialists across all departments, committed to preserving your vision.
              </p>
            </div>
            <button 
              onClick={() => navigate('/doctors')}
              className="px-8 py-4 bg-white/5 text-white border border-white/10 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-white/10 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
            >
              View Full Directory <ArrowRight size={16} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {allDoctors.slice(0, 4).map((doc, index) => (
              <motion.div 
                key={doc.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#0B1120] p-8 rounded-3xl border border-white/5 hover:border-[#3B82F6]/40 transition-all duration-300 group flex flex-col justify-between shadow-xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#3B82F6]/10 blur-[50px] rounded-full group-hover:bg-[#18E0FF]/20 transition-colors duration-500"></div>
                
                <div className="relative z-10">
                  <div className="flex flex-col items-center text-center mb-8">
                    <img 
                      src={doc.photo} 
                      alt={doc.name} 
                      className="w-24 h-24 rounded-full border-2 border-white/10 object-cover mb-4 group-hover:border-[#3B82F6]/50 transition-colors shadow-lg"
                    />
                    <h4 className="text-2xl font-bold text-[#F8FAFC] group-hover:text-[#18E0FF] transition-colors">{doc.name}</h4>
                    <p className="text-xs font-bold text-[#3B82F6] uppercase tracking-[0.15em] mt-2">{doc.specialty}</p>
                  </div>
                  
                  <div className="flex flex-col gap-3 mb-8">
                    <div className="flex items-center gap-3 text-sm text-[#94A3B8] bg-white/5 p-3 rounded-xl border border-white/5">
                      <Mail size={16} className="text-[#18E0FF]" />
                      <span className="truncate">{doc.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-[#94A3B8] bg-white/5 p-3 rounded-xl border border-white/5">
                      <Phone size={16} className="text-[#22C55E]" />
                      <span>{doc.mobile}</span>
                    </div>
                  </div>
                  

                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-24 bg-[#0B1120] relative border-t border-white/5 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-[300px] bg-[#18E0FF]/5 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {stats.map((stat, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-[#94A3B8] group-hover:from-[#18E0FF] group-hover:to-[#3B82F6] transition-all duration-500 mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] group-hover:drop-shadow-[0_0_20px_rgba(24,224,255,0.4)]">
                  {stat.value}
                </div>
                <div className="text-sm font-bold text-[#94A3B8] uppercase tracking-[0.2em]">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
