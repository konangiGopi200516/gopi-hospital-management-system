import React from 'react';
import { motion } from 'framer-motion';
import { Scan, Droplet, Eye, ShieldCheck, Activity, Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Services = () => {
  const navigate = useNavigate();
  
  const servicesList = [
    { title: 'Cataract Surgery', icon: Droplet, desc: 'Advanced micro-incision cataract surgery with premium IOL implantation.' },
    { title: 'LASIK & Refractive', icon: Scan, desc: 'Bladeless custom LASIK and SMILE procedures for spectacle removal.' },
    { title: 'Retinal Treatments', icon: Activity, desc: 'Comprehensive management of diabetic retinopathy and macular degeneration.' },
    { title: 'Glaucoma Care', icon: Eye, desc: 'Early detection and advanced surgical management of glaucoma.' },
    { title: 'Corneal Transplants', icon: ShieldCheck, desc: 'Expert corneal grafting and keratoconus management.' },
    { title: 'Neuro Ophthalmology', icon: Brain, desc: 'Diagnosis and treatment of complex visual neurological disorders.' },
  ];

  return (
    <div className="py-20 bg-[#0B1120] min-h-screen">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#F8FAFC]">Clinical Services</h1>
          <p className="text-[#94A3B8] max-w-2xl mx-auto text-lg">Comprehensive eye care solutions utilizing the latest medical advancements.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesList.map((service, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-[#141D31] p-8 rounded-2xl border border-white/5 hover:border-[#18E0FF]/30 transition-all hover:-translate-y-1 group"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#0B1120] border border-white/5 flex items-center justify-center text-[#18E0FF] mb-6 group-hover:scale-110 transition-transform">
                <service.icon size={32} />
              </div>
              <h3 className="text-xl font-bold text-[#F8FAFC] mb-3">{service.title}</h3>
              <p className="text-[#94A3B8] text-sm leading-relaxed mb-6">{service.desc}</p>
              
              <button 
                onClick={() => navigate('/appointments/book')}
                className="text-sm font-bold text-[#18E0FF] uppercase tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all"
              >
                Book Consultation <span className="text-lg">→</span>
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
