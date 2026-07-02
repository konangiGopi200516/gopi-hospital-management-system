import { useState, useEffect } from 'react';
import { Save, Shield, Bell, Globe, User, Server } from 'lucide-react';
import { toast } from 'react-toastify';
import { getSettings, updateSettings, resetDatabase } from '../services/firebaseService';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    hospitalName: 'VisionCare Specialized Eye Hospital',
    contactEmail: 'admin@visioncare.com',
    timezone: 'Asia/Kolkata (IST)',
    currency: 'INR (₹)',
    twoFactorAuth: true,
    autoLogout: '30 Minutes',
    dailyReports: true
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getSettings();
        if (data) setSettings(data);
      } catch (error) {
        console.error("Failed to load settings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async () => {
    try {
      await updateSettings(settings);
      toast.success('Settings updated successfully!');
    } catch (error) {
      toast.error('Failed to update settings.');
      console.error(error);
    }
  };

  const handleWipeDatabase = async () => {
    if (window.confirm("CRITICAL WARNING: This will permanently wipe and reset the entire database to default mock data. Are you absolutely sure?")) {
      try {
        await resetDatabase();
        toast.success("Database wiped and reset successfully!");
      } catch (error) {
        toast.error("Failed to reset database.");
        console.error(error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#18E0FF]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8 h-full flex flex-col font-sans">
      <div className="bg-[#131C33] border border-white/5 rounded-xl p-6 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-[#F8FAFC]">System Settings</h1>
          <p className="text-[#94A3B8] text-sm mt-1">Configure global application preferences and security.</p>
        </div>
        <button onClick={handleSave} className="bg-[#18E0FF] text-[#0B1120] font-bold px-6 py-2 rounded-lg hover:bg-[#18E0FF]/90 transition-colors shadow-[0_0_15px_rgba(24,224,255,0.4)] flex items-center gap-2">
          <Save size={16} /> Save Changes
        </button>
      </div>

      <div className="flex gap-6 h-full flex-col lg:flex-row">
        {/* Sidebar */}
        <div className="w-full lg:w-64 bg-[#131C33] border border-white/5 rounded-xl p-4 flex flex-col gap-2 shadow-sm shrink-0">
          <button onClick={() => setActiveTab('general')} className={`flex items-center gap-3 p-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'general' ? 'bg-[#18E0FF]/10 text-[#18E0FF]' : 'text-[#94A3B8] hover:bg-white/5 hover:text-[#F8FAFC]'}`}>
            <Globe size={16} /> General
          </button>
          <button onClick={() => setActiveTab('security')} className={`flex items-center gap-3 p-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'security' ? 'bg-[#18E0FF]/10 text-[#18E0FF]' : 'text-[#94A3B8] hover:bg-white/5 hover:text-[#F8FAFC]'}`}>
            <Shield size={16} /> Security
          </button>
          <button onClick={() => setActiveTab('notifications')} className={`flex items-center gap-3 p-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'notifications' ? 'bg-[#18E0FF]/10 text-[#18E0FF]' : 'text-[#94A3B8] hover:bg-white/5 hover:text-[#F8FAFC]'}`}>
            <Bell size={16} /> Notifications
          </button>
          <button onClick={() => setActiveTab('database')} className={`flex items-center gap-3 p-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'database' ? 'bg-[#18E0FF]/10 text-[#18E0FF]' : 'text-[#94A3B8] hover:bg-white/5 hover:text-[#F8FAFC]'}`}>
            <Server size={16} /> Database
          </button>
        </div>

        {/* Content area */}
        <div className="flex-1 bg-[#131C33] border border-white/5 rounded-xl p-6 shadow-sm overflow-y-auto custom-scrollbar">
          {activeTab === 'general' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-lg font-bold text-[#F8FAFC] border-b border-white/5 pb-3">General Settings</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#94A3B8] uppercase tracking-widest">Hospital Name</label>
                  <input name="hospitalName" type="text" value={settings.hospitalName} onChange={handleChange} className="w-full bg-[#0B1120] border border-white/10 rounded-lg px-4 py-3 text-sm text-[#F8FAFC] outline-none focus:border-[#18E0FF]" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#94A3B8] uppercase tracking-widest">Contact Email</label>
                  <input name="contactEmail" type="email" value={settings.contactEmail} onChange={handleChange} className="w-full bg-[#0B1120] border border-white/10 rounded-lg px-4 py-3 text-sm text-[#F8FAFC] outline-none focus:border-[#18E0FF]" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#94A3B8] uppercase tracking-widest">Timezone</label>
                  <select name="timezone" value={settings.timezone} onChange={handleChange} className="w-full bg-[#0B1120] border border-white/10 rounded-lg px-4 py-3 text-sm text-[#F8FAFC] outline-none focus:border-[#18E0FF] appearance-none">
                    <option value="Asia/Kolkata (IST)">Asia/Kolkata (IST)</option>
                    <option value="America/New_York (EST)">America/New_York (EST)</option>
                    <option value="Europe/London (GMT)">Europe/London (GMT)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#94A3B8] uppercase tracking-widest">Currency</label>
                  <select name="currency" value={settings.currency} onChange={handleChange} className="w-full bg-[#0B1120] border border-white/10 rounded-lg px-4 py-3 text-sm text-[#F8FAFC] outline-none focus:border-[#18E0FF] appearance-none">
                    <option value="INR (₹)">INR (₹)</option>
                    <option value="USD ($)">USD ($)</option>
                    <option value="EUR (€)">EUR (€)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-lg font-bold text-[#F8FAFC] border-b border-white/5 pb-3">Security Preferences</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-[#0B1120] border border-white/5 rounded-xl">
                  <div>
                    <h4 className="text-sm font-bold text-[#F8FAFC]">Two-Factor Authentication (2FA)</h4>
                    <p className="text-xs text-[#94A3B8] mt-1">Require staff to use an authenticator app for login.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input name="twoFactorAuth" type="checkbox" checked={settings.twoFactorAuth} onChange={handleChange} className="sr-only peer" />
                    <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#22C55E]"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-[#0B1120] border border-white/5 rounded-xl">
                  <div>
                    <h4 className="text-sm font-bold text-[#F8FAFC]">Auto-Logout</h4>
                    <p className="text-xs text-[#94A3B8] mt-1">Automatically log out inactive administrative sessions.</p>
                  </div>
                  <select name="autoLogout" value={settings.autoLogout} onChange={handleChange} className="bg-[#131C33] border border-white/10 rounded-lg px-3 py-1.5 text-xs font-bold text-[#F8FAFC] outline-none">
                    <option value="15 Minutes">15 Minutes</option>
                    <option value="30 Minutes">30 Minutes</option>
                    <option value="1 Hour">1 Hour</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-lg font-bold text-[#F8FAFC] border-b border-white/5 pb-3">Email & Notifications</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-[#0B1120] border border-white/5 rounded-xl">
                  <div>
                    <h4 className="text-sm font-bold text-[#F8FAFC]">Daily Summary Reports</h4>
                    <p className="text-xs text-[#94A3B8] mt-1">Receive daily PDFs of payroll and attendance.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input name="dailyReports" type="checkbox" checked={settings.dailyReports} onChange={handleChange} className="sr-only peer" />
                    <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#18E0FF]"></div>
                  </label>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'database' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-lg font-bold text-[#FF4D6D] border-b border-[#FF4D6D]/20 pb-3">Database Management</h2>
              <div className="p-4 bg-[#FF4D6D]/10 border border-[#FF4D6D]/20 rounded-xl">
                <h4 className="text-sm font-bold text-[#FF4D6D] mb-2">Danger Zone</h4>
                <p className="text-xs text-[#FF4D6D]/80 mb-4">Actions here are irreversible. Please ensure you have a backup of the Firebase Realtime Database before proceeding.</p>
                <button onClick={handleWipeDatabase} className="bg-[#FF4D6D] text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-[#FF4D6D]/80 transition-colors shadow-[0_0_15px_rgba(255,77,109,0.3)]">
                  Wipe Database
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
