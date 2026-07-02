import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Activity, Mail, Lock, ArrowRight, ShieldCheck, Database, Network, Eye
} from 'lucide-react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (username !== 'admin' || password !== 'Gopi@7842239728') {
      toast.error('Invalid credentials. Please try again.', {
        style: { 
          borderRadius: '12px', 
          background: '#FF4D6D', 
          border: '1px solid rgba(255,255,255,0.1)',
          color: '#F8FAFC' 
        }
      });
      return;
    }
    
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Session Authenticated', {
        style: { 
          borderRadius: '12px', 
          background: '#141D31', 
          border: '1px solid rgba(255,255,255,0.05)',
          color: '#F8FAFC' 
        }
      });
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex w-full overflow-hidden">
      
      {/* LEFT SIDE - Brand / Information */}
      <div 
        className="hidden lg:flex w-[50%] relative overflow-hidden flex-col justify-between p-16 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/login_bg.png')" }}
      >
        <div className="absolute inset-0 bg-[#050B14]/85 backdrop-blur-[2px] z-0"></div>
        
        {/* Background Gradients */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-[#18E0FF]/15 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>
          <div className="absolute bottom-[10%] right-[10%] w-[600px] h-[600px] bg-[#3B82F6]/15 rounded-full blur-[150px] mix-blend-screen pointer-events-none"></div>
        </div>

        {/* Top Branding */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="bg-[#141D31] border border-white/5 p-3 rounded-2xl shadow-[0_0_15px_rgba(24,224,255,0.1)]">
            <Eye size={28} className="text-[#18E0FF] icon-glow" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#F8FAFC]">
              VisionCare
            </h1>
          </div>
        </div>

        {/* Center Content */}
        <div className="relative z-10 text-[#F8FAFC] mt-12 mb-auto max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#141D31] border border-white/5 text-[10px] font-bold uppercase tracking-widest text-[#94A3B8] mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
            v4.2 Enterprise Release
          </div>
          <h2 className="text-5xl font-bold leading-tight mb-6">
            VisionCare Eye Hospital<br />
            Management System.
          </h2>
          <p className="text-[#94A3B8] text-lg leading-relaxed">
            Unifying eye hospital administration, clinical operations, and patient telemetry into a single high-performance engine.
          </p>
          
          {/* Key Features */}
          <div className="space-y-4 mt-12">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-xl bg-[#141D31] border border-white/5 flex items-center justify-center">
                  <Database size={18} className="text-[#18E0FF]" />
               </div>
               <div>
                  <p className="font-semibold text-sm">Real-time Data Sync</p>
                  <p className="text-[#94A3B8] text-xs">Zero-latency patient records</p>
               </div>
            </div>
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-xl bg-[#141D31] border border-white/5 flex items-center justify-center">
                  <Network size={18} className="text-[#8B5CF6]" />
               </div>
               <div>
                  <p className="font-semibold text-sm">Distributed Network</p>
                  <p className="text-[#94A3B8] text-xs">Multi-facility load balancing</p>
               </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">
          <p>© 2026 VisionCare Eye Hospital</p>
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-[#22C55E]" />
            <span>SOC2 Type II</span>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - Login Form */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 sm:px-12 relative z-10 bg-[#0B1120]/50 backdrop-blur-3xl border-l border-white/5">
        
        <div className={`w-full max-w-[400px] transition-all duration-700 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="mb-10">
            <div className="lg:hidden flex items-center gap-3 mb-8">
               <div className="bg-[#141D31] border border-white/5 p-2.5 rounded-xl">
                <Eye size={24} className="text-[#18E0FF]" />
              </div>
              <h1 className="text-xl font-bold text-[#F8FAFC]">VisionCare</h1>
            </div>
            <h2 className="text-3xl font-bold text-[#F8FAFC] mb-2 tracking-tight">Sign In</h2>
            <p className="text-[#94A3B8] text-sm">Access the administrative workspace.</p>
          </div>

          <div className="linear-card p-8">
            <form onSubmit={handleLogin} className="space-y-5" autoComplete="off">
              <div>
                <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2">Username</label>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#94A3B8] group-focus-within:text-[#18E0FF] transition-colors">
                    <Mail size={16} />
                  </span>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="new-username"
                    name="visioncare-user-field"
                    className="input-field pl-10 text-sm py-3"
                    placeholder="Enter username"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2">Password</label>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#94A3B8] group-focus-within:text-[#18E0FF] transition-colors">
                    <Lock size={16} />
                  </span>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    name="visioncare-pass-field"
                    className="input-field pl-10 text-sm py-3 font-mono tracking-widest"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative flex items-center justify-center w-4 h-4 rounded border border-[#94A3B8]/40 group-hover:border-[#18E0FF] transition-colors">
                    <input type="checkbox" className="peer sr-only" defaultChecked />
                    <div className="w-full h-full bg-[#18E0FF] rounded peer-checked:block hidden absolute inset-0"></div>
                    <svg className="w-3 h-3 text-[#0B1120] absolute hidden peer-checked:block pointer-events-none" viewBox="0 0 14 14" fill="none">
                      <path d="M3 8L6 11L11 3.5" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/>
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-[#94A3B8] group-hover:text-[#F8FAFC] transition-colors">Remember me</span>
                </label>

                <a href="#" className="text-xs font-semibold text-[#94A3B8] hover:text-[#18E0FF] transition-colors">
                  Reset Password
                </a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary flex items-center justify-center gap-2 py-3 mt-4 text-sm"
              >
                {loading ? 'Authenticating...' : (
                  <>
                    Sign In <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
