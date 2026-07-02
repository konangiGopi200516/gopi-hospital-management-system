import { useState, useEffect, useMemo } from 'react';
import { getStaff, getFaceAttendanceLog } from '../services/firebaseService';
import { Search, Clock, Calendar, CheckCircle2, XCircle, AlertCircle, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const Attendance = () => {
  const [staff, setStaff] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('All'); // All, Present, On Leave, Absent
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const [allStaff, allLogs] = await Promise.all([
          getStaff(),
          getFaceAttendanceLog()
        ]);
        setStaff(allStaff);
        setLogs(allLogs);
      } catch (error) {
        console.error("Failed to fetch staff data for attendance:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendanceData();
  }, []);

  const processedStaff = useMemo(() => {
    const logsForDate = logs.filter(log => log.date === selectedDate);
    
    const normalizeName = (name) => {
      if (!name) return '';
      return name.toLowerCase().replace(/^(dr\.|dr |mr\.|mr |mrs\.|mrs |ms\.|ms )/i, '').trim().replace(/\s+/g, ' ');
    };

    return staff.map(emp => {
      const empNameNorm = normalizeName(emp.name);
      const hasLog = logsForDate.find(log => {
        const logNameNorm = normalizeName(log.fullName);
        return logNameNorm === empNameNorm || logNameNorm.includes(empNameNorm) || empNameNorm.includes(logNameNorm);
      });
      
      return {
        ...emp,
        attendance: hasLog ? 'Present' : 'Absent'
      };
    });
  }, [staff, logs, selectedDate]);

  const filteredStaff = useMemo(() => {
    return processedStaff.filter(emp => {
      const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (emp.id && emp.id.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesFilter = filter === 'All' ? true : emp.attendance === filter;
      return matchesSearch && matchesFilter;
    });
  }, [processedStaff, searchQuery, filter]);

  const stats = useMemo(() => {
    let present = 0, leave = 0, absent = 0;
    processedStaff.forEach(emp => {
      if (emp.attendance === 'Present') present++;
      else if (emp.attendance === 'On Leave') leave++;
      else if (emp.attendance === 'Absent') absent++;
    });
    return { total: processedStaff.length, present, leave, absent };
  }, [processedStaff]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Present': return <CheckCircle2 size={16} className="text-[#22C55E]" />;
      case 'On Leave': return <Clock size={16} className="text-[#FACC15]" />;
      case 'Absent': return <XCircle size={16} className="text-[#FF4D6D]" />;
      default: return <AlertCircle size={16} className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Present': return 'text-[#22C55E] bg-[#22C55E]/10 border-[#22C55E]/20';
      case 'On Leave': return 'text-[#FACC15] bg-[#FACC15]/10 border-[#FACC15]/20';
      case 'Absent': return 'text-[#FF4D6D] bg-[#FF4D6D]/10 border-[#FF4D6D]/20';
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
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
      {/* Header */}
      <div className="bg-[#131C33] border border-white/5 rounded-xl p-6 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-[#F8FAFC]">Enterprise Attendance</h1>
          <p className="text-[#94A3B8] text-sm mt-1">Real-time attendance tracking for all clinical and non-clinical staff.</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="bg-[#0B1120] border border-white/5 px-4 py-2 rounded-lg flex items-center gap-2">
            <Calendar size={14} className="text-[#18E0FF]" />
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-[#F8FAFC] font-bold outline-none cursor-pointer [color-scheme:dark]"
            />
          </div>
          <button className="bg-[#18E0FF]/10 text-[#18E0FF] border border-[#18E0FF]/20 px-4 py-2 rounded-lg font-bold uppercase tracking-widest hover:bg-[#18E0FF]/20 transition-colors flex items-center gap-2">
            <FileText size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#131C33] border border-white/5 rounded-xl p-5 flex flex-col shadow-sm">
          <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-1">Total Staff</p>
          <p className="text-2xl font-bold text-[#F8FAFC]">{stats.total}</p>
        </div>
        <div className="bg-[#131C33] border border-[#22C55E]/10 rounded-xl p-5 flex flex-col shadow-sm relative overflow-hidden">
          <div className="absolute right-0 bottom-0 w-16 h-16 bg-[#22C55E]/5 rounded-tl-full"></div>
          <p className="text-[10px] font-bold text-[#22C55E] uppercase tracking-widest mb-1">Present Today</p>
          <p className="text-2xl font-bold text-[#F8FAFC]">{stats.present}</p>
        </div>
        <div className="bg-[#131C33] border border-[#FACC15]/10 rounded-xl p-5 flex flex-col shadow-sm relative overflow-hidden">
          <div className="absolute right-0 bottom-0 w-16 h-16 bg-[#FACC15]/5 rounded-tl-full"></div>
          <p className="text-[10px] font-bold text-[#FACC15] uppercase tracking-widest mb-1">On Leave</p>
          <p className="text-2xl font-bold text-[#F8FAFC]">{stats.leave}</p>
        </div>
        <div className="bg-[#131C33] border border-[#FF4D6D]/10 rounded-xl p-5 flex flex-col shadow-sm relative overflow-hidden">
          <div className="absolute right-0 bottom-0 w-16 h-16 bg-[#FF4D6D]/5 rounded-tl-full"></div>
          <p className="text-[10px] font-bold text-[#FF4D6D] uppercase tracking-widest mb-1">Absent</p>
          <p className="text-2xl font-bold text-[#F8FAFC]">{stats.absent}</p>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 bg-[#131C33] border border-white/5 rounded-xl flex flex-col overflow-hidden shadow-sm">
        <div className="p-4 border-b border-white/5 bg-[#0B1120]/50 flex justify-between items-center">
          <div className="flex gap-2">
            {['All', 'Present', 'On Leave', 'Absent'].map(f => (
              <button 
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${filter === f ? 'bg-[#18E0FF]/10 text-[#18E0FF] border border-[#18E0FF]/20 shadow-[0_0_10px_rgba(24,224,255,0.05)]' : 'bg-[#131C33] text-[#94A3B8] border border-white/5 hover:text-[#F8FAFC]'}`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="relative w-64">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#94A3B8]">
              <Search size={14} />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search employee..."
              className="w-full bg-[#0B1120] border border-white/5 text-[#F8FAFC] text-xs font-semibold px-3 py-2 pl-9 rounded-lg outline-none focus:border-[#18E0FF] transition-colors"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-x-auto overflow-y-auto custom-scrollbar bg-[#0B1120]/20">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="sticky top-0 bg-[#0B1120] z-10">
              <tr>
                <th className="px-6 py-4 border-b border-white/5 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Employee</th>
                <th className="px-6 py-4 border-b border-white/5 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Category & Role</th>
                <th className="px-6 py-4 border-b border-white/5 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Shift Time</th>
                <th className="px-6 py-4 border-b border-white/5 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredStaff.map(emp => (
                <motion.tr 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  key={emp.id} 
                  className="border-b border-white/5 hover:bg-[#131C33]/80 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={emp.photo} alt={emp.name} className="w-10 h-10 rounded-xl object-cover border border-white/10" />
                      <div>
                        <p className="text-sm font-bold text-[#F8FAFC]">{emp.name}</p>
                        <p className="text-[10px] font-mono text-[#94A3B8] bg-[#0B1120] inline-block px-1 rounded mt-0.5">{emp.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs font-bold text-[#F8FAFC]">{emp.category}</p>
                    <p className="text-[10px] text-[#94A3B8] uppercase tracking-widest mt-0.5">{emp.designation || 'Staff'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs font-semibold text-[#F8FAFC]">{emp.workingHours || '09:00 AM - 05:00 PM'}</p>
                    <p className="text-[10px] text-[#94A3B8] uppercase tracking-widest mt-0.5">{emp.shift || 'General Shift'}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {getStatusIcon(emp.attendance || 'Present')}
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded border ${getStatusColor(emp.attendance || 'Present')}`}>
                        {emp.attendance || 'Present'}
                      </span>
                    </div>
                  </td>
                </motion.tr>
              ))}
              {filteredStaff.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-10 opacity-50">
                    <p className="text-sm font-bold text-[#F8FAFC]">No employees found matching criteria.</p>
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

export default Attendance;
