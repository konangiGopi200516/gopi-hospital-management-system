import React from 'react';
import { Activity, FileText, Download, Filter, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const Reports = () => {
  const dummyReports = [
    { id: 'REP-001', patient: 'Rahul Sharma', type: 'OCT Scan', date: 'Oct 15, 2026', doctor: 'Dr. Ravi Patel', status: 'Ready' },
    { id: 'REP-002', patient: 'Anjali Gupta', type: 'Visual Field Test', date: 'Oct 14, 2026', doctor: 'Dr. Sanjay Gupta', status: 'Processing' },
    { id: 'REP-003', patient: 'Priya Singh', type: 'Corneal Topography', date: 'Oct 14, 2026', doctor: 'Dr. Neha Verma', status: 'Ready' },
    { id: 'REP-004', patient: 'Vikram Desai', type: 'Fundus Photography', date: 'Oct 13, 2026', doctor: 'Dr. Ravi Patel', status: 'Ready' },
  ];

  return (
    <div className="space-y-6 pb-8 font-sans h-full flex flex-col">
      <div className="bg-[#131C33] border border-white/5 rounded-xl p-6 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-[#F8FAFC] flex items-center gap-3">
            <Activity className="text-[#18E0FF]" size={24} /> 
            Vision & Diagnostic Reports
          </h1>
          <p className="text-[#94A3B8] text-sm mt-1">Manage and review patient eye diagnostic reports.</p>
        </div>
        
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative group flex-1 sm:w-64">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#94A3B8] group-focus-within:text-[#18E0FF]">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Search reports..."
              className="w-full bg-[#0B1120] border border-white/5 text-[#F8FAFC] text-sm font-semibold px-4 py-2.5 pl-10 rounded-xl outline-none focus:border-[#18E0FF] transition-colors"
            />
          </div>
          <button className="bg-[#0B1120] border border-white/5 hover:bg-white/5 text-[#F8FAFC] px-4 py-2.5 rounded-xl flex items-center gap-2 transition-colors">
            <Filter size={16} /> Filter
          </button>
        </div>
      </div>

      <div className="flex-1 bg-[#131C33] border border-white/5 rounded-xl flex flex-col overflow-hidden shadow-sm">
        <div className="p-4 border-b border-white/5 bg-[#0B1120]/50 flex justify-between items-center">
          <h2 className="text-sm font-bold text-[#F8FAFC] tracking-widest uppercase">Recent Reports</h2>
        </div>

        <div className="flex-1 overflow-auto custom-scrollbar p-4">
          <div className="space-y-3">
            {dummyReports.map(report => (
              <motion.div 
                key={report.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-[#0B1120]/50 border border-white/5 rounded-xl hover:bg-[#0B1120] transition-colors gap-4"
              >
                <div className="flex items-center gap-4 min-w-[200px]">
                  <div className="w-12 h-12 rounded-full bg-[#18E0FF]/10 text-[#18E0FF] flex items-center justify-center shrink-0">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#F8FAFC]">{report.patient}</h3>
                    <p className="text-xs text-[#94A3B8] font-semibold">{report.id}</p>
                  </div>
                </div>

                <div className="flex flex-col min-w-[150px]">
                  <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-0.5">Test Type</span>
                  <span className="text-sm font-semibold text-[#18E0FF]">{report.type}</span>
                </div>

                <div className="flex flex-col min-w-[150px]">
                  <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-0.5">Referred By</span>
                  <span className="text-sm font-semibold text-[#F8FAFC]">{report.doctor}</span>
                  <span className="text-xs font-semibold text-[#94A3B8]">{report.date}</span>
                </div>

                <div className="flex items-center justify-end min-w-[150px] gap-3">
                  <span className={`px-3 py-1 rounded text-xs font-bold uppercase tracking-widest ${report.status === 'Ready' ? 'bg-[#22C55E]/10 text-[#22C55E]' : 'bg-[#FACC15]/10 text-[#FACC15]'}`}>
                    {report.status}
                  </span>
                  {report.status === 'Ready' && (
                    <button className="p-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors" title="Download Report">
                      <Download size={16} />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
