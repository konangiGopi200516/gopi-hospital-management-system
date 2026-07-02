import React from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { Eye, ShieldCheck, Activity, Users, ChevronRight, Stethoscope, Clock, MapPin, Phone, ArrowRight, Scan, Droplet, Mail, X } from 'lucide-react';

const PublicLayout = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#0B1120] min-h-screen text-[#F8FAFC] font-sans selection:bg-[#18E0FF]/30 flex flex-col">
      {/* Sticky Navigation */}
      <header className="fixed top-0 w-full bg-[#0B1120]/80 backdrop-blur-xl border-b border-white/5 z-50 transition-all duration-300">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="bg-[#141D31] border border-[#18E0FF]/20 p-2.5 rounded-xl shadow-[0_0_15px_rgba(24,224,255,0.15)]">
              <Eye size={24} className="text-[#18E0FF] icon-glow" />
            </div>
            <span className="text-xl font-bold tracking-tight text-[#F8FAFC]">
              VisionCare <span className="text-[#18E0FF]">Eye Hospital</span>
            </span>
          </Link>
          <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-[#94A3B8]">
            <Link to="/" className="hover:text-[#F8FAFC] transition-colors">Home</Link>
            <Link to="/about" className="hover:text-[#F8FAFC] transition-colors">About Hospital</Link>
            <Link to="/departments" className="hover:text-[#F8FAFC] transition-colors">Eye Departments</Link>
            <Link to="/doctors" className="hover:text-[#F8FAFC] transition-colors">Doctors</Link>
            <Link to="/services" className="hover:text-[#F8FAFC] transition-colors">Services</Link>
            <Link to="/receptionist" className="hover:text-[#F8FAFC] transition-colors">Receptionist</Link>
            <Link to="/patient-portal" className="hover:text-[#F8FAFC] transition-colors">Patient</Link>
          </nav>
          <div className="flex items-center gap-6">
            <button 
              onClick={() => navigate('/appointments/book')}
              className="text-sm font-bold text-[#94A3B8] hover:text-[#18E0FF] transition-colors uppercase tracking-widest hidden sm:block"
            >
              Schedule
            </button>
            <button 
              onClick={() => navigate('/admin/login')}
              className="text-sm font-bold text-[#94A3B8] hover:text-[#F8FAFC] transition-colors uppercase tracking-widest hidden sm:block"
            >
              Admin
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow pt-20">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="py-12 bg-[#080D14] border-t border-white/5 mt-auto">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="bg-[#141D31] border border-[#18E0FF]/20 p-2 rounded-xl">
                <Eye size={20} className="text-[#18E0FF]" />
              </div>
              <span className="text-lg font-bold tracking-tight text-[#F8FAFC]">
                VisionCare
              </span>
            </div>
            <div className="text-[#94A3B8] text-sm text-center md:text-left">
              &copy; {new Date().getFullYear()} VisionCare Eye Hospital Management System. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
