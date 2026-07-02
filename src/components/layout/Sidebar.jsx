import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Activity, Users, UserPlus, FileText, Settings, 
  ChevronLeft, ChevronRight, LayoutDashboard, Stethoscope,
  Pill, FlaskConical, Calendar, BedDouble, ShieldCheck, Eye, ScanFace
} from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Basic logout handling for UI
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Patients', path: '/admin/patients', icon: Users },
    { name: 'Clinical Staff', path: '/admin/doctors', icon: Stethoscope },
    { name: 'Nurses', path: '/admin/nurses', icon: ShieldCheck },
    { name: 'Housekeeping', path: '/admin/housekeeping', icon: Users },
    { name: 'Recovery & Observation Wards', path: '/admin/wards', icon: BedDouble },
    { name: 'Appointments', path: '/admin/appointments', icon: Calendar },
    { name: 'Eye Diagnostics', path: '/admin/laboratory', icon: FlaskConical },
    { name: 'Pharmacy & Optical Store', path: '/admin/pharmacy', icon: Pill },
    { name: 'Vision & Diagnostic Reports', path: '/admin/reports', icon: Activity },
  ];

  const adminItems = [
    { name: 'Payroll & Salary', path: '/admin/payroll', icon: FileText },
    { name: 'Attendance', path: '/admin/attendance', icon: Calendar },
    { name: 'Face Enrollment', path: '/admin/add-face', icon: UserPlus },
    { name: 'Face Attendance', path: '/admin/face-attendance', icon: ScanFace },
    { name: 'System Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className={`bg-[#0E172A] border-r border-white/5 h-full flex flex-col transition-all duration-300 relative z-20 ${collapsed ? 'w-20' : 'w-64'}`}>
      
      {/* Collapse Toggle */}
      <button 
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-8 bg-[#141D31] border border-white/10 text-[#94A3B8] hover:text-[#18E0FF] p-1 rounded-full shadow-[0_0_10px_rgba(24,224,255,0.05)] z-10 transition-colors"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Branding */}
      <div className={`h-20 flex items-center ${collapsed ? 'justify-center' : 'px-6'} border-b border-white/5`}>
        <div className="flex items-center gap-3">
          <div className="bg-[#141D31] border border-white/5 p-2 rounded-xl text-[#18E0FF]">
            <Eye size={collapsed ? 20 : 24} className="icon-glow" />
          </div>
          {!collapsed && (
            <span className="text-xl font-bold text-[#F8FAFC] tracking-tight whitespace-nowrap">
              VisionCare
            </span>
          )}
        </div>
      </div>
      
      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1 custom-scrollbar">
        {!collapsed && <div className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-4 px-3 mt-2">Main Menu</div>}
        
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 ${collapsed ? 'justify-center px-0' : 'px-3'} py-3 rounded-xl transition-all duration-200 group relative ${
                isActive 
                  ? 'bg-[#141D31] text-[#F8FAFC] font-semibold border border-white/5 shadow-[0_10px_40px_rgba(24,224,255,0.05)]' 
                  : 'text-[#94A3B8] hover:bg-[#141D31]/50 hover:text-[#F8FAFC] border border-transparent'
              }`
            }
            title={collapsed ? item.name : ""}
          >
            {({ isActive }) => (
              <>
                <item.icon size={18} className={`${isActive ? 'text-[#18E0FF] icon-glow' : 'text-[#94A3B8] group-hover:text-[#F8FAFC]'}`} />
                {!collapsed && <span className="text-sm">{item.name}</span>}
              </>
            )}
          </NavLink>
        ))}

        <div className="pt-4 pb-2">
          {!collapsed && <div className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-4 px-3">Administration</div>}
          <div className="space-y-1">
            {adminItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 ${collapsed ? 'justify-center px-0' : 'px-3'} py-3 rounded-xl transition-all duration-200 group relative ${
                    isActive 
                      ? 'bg-[#141D31] text-[#F8FAFC] font-semibold border border-white/5 shadow-[0_10px_40px_rgba(24,224,255,0.05)]' 
                      : 'text-[#94A3B8] hover:bg-[#141D31]/50 hover:text-[#F8FAFC] border border-transparent'
                  }`
                }
                title={collapsed ? item.name : ""}
              >
                {({ isActive }) => (
                  <>
                    <item.icon size={18} className={`${isActive ? 'text-[#18E0FF] icon-glow' : 'text-[#94A3B8] group-hover:text-[#F8FAFC]'}`} />
                    {!collapsed && <span className="text-sm">{item.name}</span>}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </div>
      </div>

      {/* Storage/Status */}
      <div className="p-4 border-t border-white/5 bg-[#101827]">
        {!collapsed && (
          <div className="linear-card p-4 rounded-xl mb-4 border-white/5">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Storage Used</span>
              <span className="text-xs font-bold text-[#18E0FF]">78%</span>
            </div>
            <div className="w-full bg-[#0B1120] rounded-full h-1.5 border border-white/5 overflow-hidden">
              <div className="h-1.5 rounded-full w-[78%] progress-glow"></div>
            </div>
            <p className="text-[10px] text-[#94A3B8] mt-3">124GB of 160GB</p>
          </div>
        )}
        
        <div 
          onClick={handleLogout}
          className={`flex items-center gap-3 ${collapsed ? 'justify-center' : 'px-3'} py-2 text-[#94A3B8] hover:text-[#FF296D] cursor-pointer transition-colors rounded-xl hover:bg-[#141D31]`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          {!collapsed && <span className="font-semibold text-sm">Logout</span>}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
