import { useState } from 'react';
import { Search, Bell, Grid, User } from 'lucide-react';
import VisionAIChat from '../VisionAIChat';

const Header = () => {
  const [isAIOpen, setIsAIOpen] = useState(false);

  return (
    <>
      <header className="h-20 bg-[#0B1120]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-8 z-10 sticky top-0">
        
        {/* Search */}
        <div className="flex-1 flex items-center max-w-2xl">
          <div className="relative w-full group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search size={16} className="text-[#94A3B8] group-focus-within:text-[#18E0FF] transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search patients, doctors, or reports..."
              className="input-field pl-11 py-2 text-sm"
            />
          </div>
        </div>
        
        {/* Right Controls */}
        <div className="flex items-center gap-5 ml-6">
          
          <button className="p-2 text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#141D31] rounded-lg transition-colors relative border border-transparent hover:border-white/5">
            <Grid size={18} />
          </button>

          <button className="p-2 text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#141D31] rounded-lg transition-colors relative border border-transparent hover:border-white/5">
            <Bell size={18} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-[#FF296D] rounded-full shadow-[0_0_8px_rgba(255,41,109,0.8)]"></span>
          </button>
          
          {/* Vision AI Badge */}
          <div 
            onClick={() => setIsAIOpen(true)}
            className="flex items-center gap-2 bg-[#18E0FF]/10 border border-[#18E0FF]/20 px-3 py-1.5 rounded-full cursor-pointer hover:bg-[#18E0FF]/20 transition-colors ml-2 shadow-[0_0_15px_rgba(24,224,255,0.1)]"
          >
             <img src="/images/custom_ai_logo.png" alt="AI" className="w-5 h-5 rounded-full shadow-[0_0_8px_rgba(24,224,255,0.4)]" />
             <span className="text-[10px] font-bold text-[#18E0FF] tracking-widest uppercase">Vision AI</span>
          </div>

          <div className="w-[1px] h-6 bg-white/10 mx-2"></div>
          
          {/* Profile */}
          <div className="flex items-center gap-3 cursor-pointer hover:bg-[#141D31] p-1.5 pr-4 rounded-xl transition-colors border border-transparent hover:border-white/5">
            <div className="w-8 h-8 rounded-lg bg-[#141D31] border border-white/10 flex items-center justify-center text-[#18E0FF] font-bold text-xs shadow-[0_0_10px_rgba(24,224,255,0.1)]">
              AD
            </div>
            <div className="hidden md:block">
              <p className="font-semibold text-[#F8FAFC] text-sm leading-tight">System Admin</p>
              <p className="text-[#94A3B8] text-[10px] font-semibold uppercase tracking-wider mt-0.5">Administrator</p>
            </div>
          </div>

        </div>
      </header>

      <VisionAIChat isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
    </>
  );
};

export default Header;
