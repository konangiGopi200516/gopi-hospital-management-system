import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Target, Award, Users, Microscope, Activity, Eye, Stethoscope, ChevronRight, CheckCircle2, Bed, Glasses, ClipboardList } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  const facilities = [
    {
      title: "Advanced Operation Theatres",
      description: "Equipped with Alcon Centurion vision systems and Zeiss LUMERA surgical microscopes for ultra-precise ophthalmic surgeries.",
      image: "/images/operation_theatre.png",
      icon: Activity,
      features: ["Robotic-assisted surgery", "HEPA-filtered sterile environment", "Real-time vitals monitoring"]
    },
    {
      title: "High-Tech Diagnostics",
      description: "State-of-the-art imaging center with the latest Optical Coherence Tomography (OCT) and corneal topography machines.",
      image: "/images/diagnostic_room.png",
      icon: Microscope,
      features: ["3D Retinal Mapping", "Non-invasive angiography", "AI-powered diagnostics"]
    },
    {
      title: "Outpatient Department (OPD)",
      description: "Spacious and comfortable consultation rooms ensuring a smooth, personalized, and efficient patient experience from entry to diagnosis.",
      image: "/images/outpatient_dept.png",
      icon: ClipboardList,
      features: ["Expert Consultations", "Minimal Wait Times", "Digitized Health Records"]
    },
    {
      title: "Pharmacy & Optical Store",
      description: "In-house premium optical store offering a wide range of designer frames, advanced lenses, and comprehensive pharmacy services.",
      image: "/images/optical_store.png",
      icon: Glasses,
      features: ["Premium Contact Lenses", "Designer Frames", "Fully-Stocked Pharmacy"]
    },
    {
      title: "Specialized Wards",
      description: "Luxurious, sanitized, and comfortable inpatient recovery wards ensuring the highest standard of post-operative care and observation.",
      image: "/images/specialized_ward.png",
      icon: Bed,
      features: ["Private Recovery Suites", "24/7 Specialized Nursing", "Nutritionally Curated Meals"]
    }
  ];

  return (
    <div className="bg-[#0B1120] min-h-screen text-[#F8FAFC]">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#18E0FF]/10 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#3B82F6]/10 blur-[100px] rounded-full"></div>
        </div>

        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[#18E0FF] text-sm font-medium mb-6"
              >
                <Award size={16} />
                <span>Award-Winning Eye Care Center</span>
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl lg:text-7xl font-bold mb-6 leading-tight"
              >
                Visionary Care, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#18E0FF] to-[#3B82F6]">
                  Crystal Clear Results.
                </span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-[#94A3B8] text-lg lg:text-xl leading-relaxed mb-8 max-w-xl"
              >
                VisionCare has been at the forefront of ophthalmic excellence for over two decades. We blend profound medical expertise with cutting-edge technology to protect, restore, and enhance your most precious sense.
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap items-center gap-4"
              >
                <Link to="/book-appointment" className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#18E0FF] to-[#0A91AB] text-[#0B1120] font-bold text-lg hover:shadow-[0_0_30px_rgba(24,224,255,0.3)] transition-all flex items-center gap-2 group">
                  Book Consultation
                  <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/doctors" className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-semibold text-lg hover:bg-white/10 transition-all">
                  Meet Our Experts
                </Link>
              </motion.div>
            </div>
            <div className="lg:w-1/2 relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="relative z-10 rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(24,224,255,0.15)]"
              >
                <img src="/images/about_hospital_main.jpg" alt="VisionCare Modern Interior and Exterior" className="w-full h-auto object-cover" />
                {/* Overlay highlight */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-transparent to-transparent opacity-60"></div>
              </motion.div>

            </div>
          </div>
        </div>
      </section>

      {/* World Class Facilities Section */}
      <section className="py-24 bg-[#0B1120] relative border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6">World-Class <span className="text-[#18E0FF]">Facilities</span></h2>
            <p className="text-[#94A3B8] text-lg">
              Experience the pinnacle of ophthalmic care. Our hospital is equipped with next-generation technology to ensure precise diagnostics and flawless surgical outcomes.
            </p>
          </div>

          <div className="space-y-24">
            {facilities.map((facility, idx) => (
              <div key={idx} className={`flex flex-col ${idx % 2 !== 0 ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-16`}>
                <motion.div 
                  initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                  className="lg:w-1/2"
                >
                  <div className="relative group rounded-3xl overflow-hidden border border-white/10">
                    <div className="absolute inset-0 bg-[#18E0FF]/20 group-hover:bg-transparent transition-colors duration-500 z-10 mix-blend-overlay"></div>
                    <img src={facility.image} alt={facility.title} className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700" />
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="lg:w-1/2"
                >
                  <div className="w-16 h-16 rounded-2xl bg-[#18E0FF]/10 flex items-center justify-center text-[#18E0FF] mb-6">
                    <facility.icon size={32} />
                  </div>
                  <h3 className="text-3xl font-bold mb-4">{facility.title}</h3>
                  <p className="text-[#94A3B8] text-lg leading-relaxed mb-8">
                    {facility.description}
                  </p>
                  <ul className="space-y-4">
                    {facility.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-3">
                        <CheckCircle2 className="text-[#18E0FF]" size={20} />
                        <span className="text-white font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values / Specialties */}
      <section className="py-24 bg-[#141D31]/50 border-y border-white/5 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[400px] bg-[#18E0FF]/5 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Our Core Pillars</h2>
            <p className="text-[#94A3B8] text-lg max-w-2xl mx-auto">The foundation of our excellence lies in our unwavering commitment to patient care and medical innovation.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Stethoscope, title: "Clinical Excellence", desc: "Highest standards of surgical and medical care delivered by veteran specialists." },
              { icon: Eye, title: "Comprehensive Care", desc: "From routine checkups to complex retinal surgeries under one roof." },
              { icon: Users, title: "Patient Centricity", desc: "Compassionate, personalized care tailored to individual patient needs." },
              { icon: ShieldCheck, title: "Safety First", desc: "Strict adherence to international safety and hygiene protocols." }
            ].map((val, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-[#0B1120] p-8 rounded-2xl border border-white/5 hover:border-[#18E0FF]/40 hover:-translate-y-2 transition-all duration-300 group"
              >
                <div className="w-14 h-14 rounded-xl bg-[#18E0FF]/10 group-hover:bg-[#18E0FF] flex items-center justify-center text-[#18E0FF] group-hover:text-[#0B1120] mb-6 transition-colors duration-300">
                  <val.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-[#F8FAFC] mb-3">{val.title}</h3>
                <p className="text-[#94A3B8] text-sm leading-relaxed">{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


    </div>
  );
};

export default About;
