import { useState, useEffect } from 'react';
import { 
  Users, UserPlus, BedDouble, Stethoscope, Activity, 
  IndianRupee, Calendar, CheckSquare, Clock
} from 'lucide-react';
import { 
  LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell, CartesianGrid
} from 'recharts';
import { motion } from 'framer-motion';
import { getAppointments, updateAppointmentStatus, getPatients, getStaff } from '../services/firebaseService';

const Dashboard = () => {
  const [time, setTime] = useState(new Date());
  const [pendingRequests, setPendingRequests] = useState([]);
  const [stats, setStats] = useState({
    totalPatients: '0',
    todaysAdmissions: '0',
    availableBeds: '0',
    doctorsOnDuty: '0',
    emergencyCases: '0',
    revenue: '₹0L',
    appointments: '0',
    dischargedToday: '0'
  });

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    
    const loadRequests = async () => {
      try {
        const [appts, patients, staff] = await Promise.all([
          getAppointments(),
          getPatients(),
          getStaff()
        ]);
        
        setPendingRequests(appts);

        // Calculate stats
        const totalPatients = patients.length;
        const admitted = patients.filter(p => p.status === 'Admitted' || p.status === 'Critical').length;
        const availableBeds = 150 - admitted;
        const doctorsOnDuty = staff.filter(s => s.category === 'Doctors' && s.attendance !== 'Absent').length;
        const emergencyCases = patients.filter(p => p.status === 'Critical').length;
        const revenueNum = (totalPatients * 0.12).toFixed(1);
        const dischargedToday = patients.filter(p => p.status === 'Discharged').length;
        const today = new Date().toISOString().split('T')[0];
        const todaysAdmissions = patients.filter(p => p.admissionDate === today).length || 5; // Default to 5 if dates are not implemented

        setStats({
          totalPatients: totalPatients.toString(),
          todaysAdmissions: todaysAdmissions.toString(),
          availableBeds: availableBeds.toString(),
          doctorsOnDuty: doctorsOnDuty.toString(),
          emergencyCases: emergencyCases.toString(),
          revenue: `₹${revenueNum}L`,
          appointments: appts.length.toString(),
          dischargedToday: dischargedToday.toString()
        });
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      }
    };
    
    loadRequests();
    const dataTimer = setInterval(loadRequests, 5000);

    return () => {
      clearInterval(timer);
      clearInterval(dataTimer);
    };
  }, []);

  const handleAcceptRequest = async (reqId, firebaseId) => {
    const request = pendingRequests.find(r => r.firebaseId === firebaseId || r.id === reqId);
    
    if (request && request.status === 'pending') {
      try {
        // Update Firebase
        if (firebaseId) {
          await updateAppointmentStatus(firebaseId, 'accepted');
        }

        // Mock email logic
        try {
          const response = await fetch('http://localhost:3001/api/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request)
          });
          const data = await response.json();
          if (!response.ok || !data.success) {
            throw new Error(data.error || 'Failed to send email from server');
          }
          console.log("Email Preview URL:", data.previewUrl);
          alert('Appointment accepted! Confirmation email sent to the patient.');
        } catch (emailError) {
          console.error("Failed to send email", emailError);
          alert(`Failed to send confirmation email. However, the appointment has been accepted.`);
        }
        
        // Update local state
        const updated = pendingRequests.map(r => r.firebaseId === firebaseId || r.id === reqId ? { ...r, status: 'accepted' } : r);
        setPendingRequests(updated);

      } catch (error) {
        console.error("Failed to accept appointment", error);
        alert("Failed to accept appointment. Please try again.");
      }
    }
  };

  const statCards = [
    { title: 'Total Patients', value: stats.totalPatients, trend: '+12%', icon: Users, color: '#18E0FF' },
    { title: "Today's Admissions", value: stats.todaysAdmissions, trend: '+5%', icon: UserPlus, color: '#3B82F6' },
    { title: 'Available Beds', value: stats.availableBeds, trend: '-2%', icon: BedDouble, color: '#FF296D' },
    { title: 'Doctors On Duty', value: stats.doctorsOnDuty, trend: 'Optimal', icon: Stethoscope, color: '#8B5CF6' },
    { title: 'Emergency Cases', value: stats.emergencyCases, trend: '+2', icon: Activity, color: '#FF296D' },
    { title: 'Revenue (Today)', value: stats.revenue, trend: '+18%', icon: IndianRupee, color: '#22C55E' },
    { title: 'Appointments', value: stats.appointments, trend: 'Stable', icon: Calendar, color: '#18E0FF' },
    { title: 'Discharged Today', value: stats.dischargedToday, trend: 'Stable', icon: CheckSquare, color: '#22C55E' },
  ];

  const admissionData = [
    { name: 'Mon', admissions: 45, discharges: 30 },
    { name: 'Tue', admissions: 52, discharges: 38 },
    { name: 'Wed', admissions: 38, discharges: 42 },
    { name: 'Thu', admissions: 65, discharges: 45 },
    { name: 'Fri', admissions: 48, discharges: 50 },
    { name: 'Sat', admissions: 35, discharges: 25 },
    { name: 'Sun', admissions: 28, discharges: 20 },
  ];

  const departmentData = [
    { name: 'Retina & Vitreous', value: 400 },
    { name: 'Cataract Services', value: 300 },
    { name: 'LASIK & Refractive', value: 300 },
    { name: 'Glaucoma Clinic', value: 200 },
  ];

  const COLORS = ['#18E0FF', '#3B82F6', '#22C55E', '#8B5CF6'];

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#F8FAFC]">Operations Overview</h1>
          <p className="text-[#94A3B8] text-sm mt-1">Real-time clinical metrics and load distribution.</p>
        </div>
        <div className="flex items-center gap-3 linear-card px-4 py-2 border-white/5">
          <Clock className="text-[#18E0FF] icon-glow" size={16} />
          <span className="font-mono text-sm text-[#F8FAFC]">
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((stat, index) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            key={index} 
            className="linear-card p-5 group"
          >
            <div className="flex justify-between items-start mb-4">
              <stat.icon size={20} style={{ color: stat.color, filter: `drop-shadow(0 0 8px ${stat.color}60)` }} className="group-hover:scale-110 transition-transform" />
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm border ${stat.trend.includes('-') || stat.trend === 'Critical' ? 'bg-[#FF296D]/10 text-[#FF296D] border-[#FF296D]/20' : 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20'}`}>
                {stat.trend}
              </span>
            </div>
            <p className="text-2xl font-bold text-[#F8FAFC] tracking-tight">{stat.value}</p>
            <h3 className="text-[#94A3B8] text-[10px] font-bold uppercase tracking-widest mt-1">{stat.title}</h3>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Line Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 linear-card p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-sm font-bold text-[#F8FAFC]">Patient Flow Dynamics</h3>
              <p className="text-xs text-[#94A3B8] mt-1">Weekly admissions vs discharges</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded bg-[#18E0FF] shadow-[0_0_8px_#18E0FF]"></div>
                <span className="text-[10px] uppercase tracking-widest font-bold text-[#94A3B8]">Admissions</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded bg-[#3B82F6] shadow-[0_0_8px_#3B82F6]"></div>
                <span className="text-[10px] uppercase tracking-widest font-bold text-[#94A3B8]">Discharges</span>
              </div>
            </div>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={admissionData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10, fontWeight: 600}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10, fontWeight: 600}} dx={-10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#141D31', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', boxShadow: '0 20px 60px rgba(24,224,255,0.1)' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                  cursor={{stroke: 'rgba(255,255,255,0.05)', strokeWidth: 2}}
                />
                <Line type="monotone" dataKey="admissions" stroke="#18E0FF" strokeWidth={3} dot={{r: 4, fill: '#141D31', strokeWidth: 2, stroke: '#18E0FF'}} activeDot={{r: 6, fill: '#18E0FF'}} />
                <Line type="monotone" dataKey="discharges" stroke="#3B82F6" strokeWidth={3} dot={{r: 4, fill: '#141D31', strokeWidth: 2, stroke: '#3B82F6'}} activeDot={{r: 6, fill: '#3B82F6'}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Pie Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="linear-card p-6 flex flex-col"
        >
          <div>
            <h3 className="text-sm font-bold text-[#F8FAFC]">Resource Distribution</h3>
            <p className="text-xs text-[#94A3B8] mt-1">Active load by department</p>
          </div>
          <div className="flex-1 min-h-[220px] relative mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#141D31', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', boxShadow: '0 20px 60px rgba(24,224,255,0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-bold text-[#F8FAFC]">1.2K</span>
              <span className="text-[10px] text-[#94A3B8] uppercase font-bold tracking-widest">Total</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {departmentData.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded" style={{ backgroundColor: COLORS[index % COLORS.length], boxShadow: `0 0 8px ${COLORS[index % COLORS.length]}` }}></div>
                <div>
                  <p className="text-xs font-semibold text-[#F8FAFC]">{entry.name}</p>
                  <p className="text-[10px] text-[#94A3B8] font-bold">{entry.value} Pt.</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>

      {/* Pending OP Requests */}
      <div className="mt-8 linear-card p-6 border-white/5 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-bold text-[#F8FAFC]">Pending OP Requests</h3>
            <p className="text-sm text-[#94A3B8]">Review and accept patient appointment requests.</p>
          </div>
          <div className="px-3 py-1 bg-[#18E0FF]/10 text-[#18E0FF] border border-[#18E0FF]/20 rounded-lg text-xs font-bold uppercase tracking-widest">
            {pendingRequests.length} Pending
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-xs font-bold text-[#94A3B8] uppercase tracking-widest">
                <th className="pb-3 pr-4">Patient Name</th>
                <th className="pb-3 px-4">Contact</th>
                <th className="pb-3 px-4">Department & Doctor</th>
                <th className="pb-3 px-4">Requested Time</th>
                <th className="pb-3 pl-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingRequests.map((req) => (
                <tr key={req.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 pr-4">
                    <span className="font-semibold text-[#F8FAFC]">{req.patient}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-[#94A3B8]">{req.phone}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-[#18E0FF]">{req.dept}</span>
                      <span className="text-xs text-[#94A3B8]">{req.doc}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-[#F8FAFC]">{req.date}</span>
                      <span className="text-xs text-[#94A3B8]">{req.time}</span>
                    </div>
                  </td>
                  <td className="py-4 pl-4 text-right">
                    {req.status === 'pending' ? (
                      <button 
                        onClick={() => handleAcceptRequest(req.id, req.firebaseId)}
                        className="px-4 py-2 bg-[#FF296D]/10 hover:bg-[#FF296D]/20 text-[#FF296D] border border-[#FF296D]/20 rounded-lg text-xs font-bold uppercase tracking-widest transition-all shadow-[0_0_10px_rgba(255,41,109,0.1)]"
                      >
                        Accept Request
                      </button>
                    ) : (
                      <button 
                        disabled
                        className="px-4 py-2 bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20 rounded-lg text-xs font-bold uppercase tracking-widest transition-all opacity-80 cursor-default"
                      >
                        Accepted
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {pendingRequests.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-[#94A3B8] text-sm">
                    No pending requests.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
