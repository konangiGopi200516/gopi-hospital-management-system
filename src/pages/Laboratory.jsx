import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, Beaker, Activity, FileText, CheckCircle2, 
  Clock, AlertCircle, Printer, Download, Eye, Microscope, TestTube, FileBarChart, Plus, X, Upload
} from 'lucide-react';
import { toast } from 'react-toastify';

const LAB_TESTS = [
  { id: 'EYE-2026-801', patientName: 'Rahul Verma', ptId: 'PT-1042', type: 'OCT Scan (Retina)', category: 'Imaging', status: 'Processing', priority: 'Normal', doctor: 'Dr. Ravi Patel', date: '2026-06-29 09:15 AM' },
  { id: 'EYE-2026-802', patientName: 'Sneha Patel', ptId: 'PT-2193', type: 'Fundus Photography', category: 'Imaging', status: 'Pending', priority: 'Routine', doctor: 'Dr. Neha Verma', date: '2026-06-29 09:45 AM' },
  { id: 'EYE-2026-803', patientName: 'Amit Kumar', ptId: 'PT-3811', type: 'Visual Field Test', category: 'Perimetry', status: 'Completed', priority: 'Urgent', doctor: 'Dr. Sanjay Gupta', date: '2026-06-29 07:30 AM' },
  { id: 'EYE-2026-804', patientName: 'Priya Singh', ptId: 'PT-4920', type: 'Corneal Topography', category: 'Imaging', status: 'Processing', priority: 'Routine', doctor: 'Dr. Amit Shah', date: '2026-06-29 10:00 AM' },
  { id: 'EYE-2026-805', patientName: 'Rohan Sharma', ptId: 'PT-5102', type: 'Optical Biometry', category: 'Measurement', status: 'Completed', priority: 'Urgent', doctor: 'Dr. Vikram Singh', date: '2026-06-29 08:20 AM' },
  { id: 'EYE-2026-806', patientName: 'Kavya Reddy', ptId: 'PT-6391', type: 'Slit Lamp Examination', category: 'Clinical', status: 'Pending', priority: 'Routine', doctor: 'Dr. Ravi Patel', date: '2026-06-29 10:30 AM' },
  { id: 'EYE-2026-807', patientName: 'Aisha Gupta', ptId: 'PT-7284', type: 'Tonometry', category: 'Measurement', status: 'Processing', priority: 'Normal', doctor: 'Dr. Neha Verma', date: '2026-06-29 09:50 AM' },
  { id: 'EYE-2026-808', patientName: 'Devansh Joshi', ptId: 'PT-8912', type: 'Retinal Scan', category: 'Imaging', status: 'Completed', priority: 'Routine', doctor: 'Dr. Sanjay Gupta', date: '2026-06-29 08:45 AM' },
];

const TABS = [
  { id: 'all', label: 'All Requests' },
  { id: 'Pending', label: 'Pending Samples' },
  { id: 'Processing', label: 'In Analytics' },
  { id: 'Completed', label: 'Results Ready' }
];

const Laboratory = () => {
  const [tests, setTests] = useState(LAB_TESTS);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTest, setSelectedTest] = useState(null);

  const stats = useMemo(() => {
    let pending = 0, processing = 0, completed = 0;
    tests.forEach(t => {
      if (t.status === 'Pending') pending++;
      if (t.status === 'Processing') processing++;
      if (t.status === 'Completed') completed++;
    });
    return { total: tests.length, pending, processing, completed };
  }, [tests]);

  const filteredTests = useMemo(() => {
    return tests.filter(test => {
      const matchesTab = activeTab === 'all' || test.status === activeTab;
      const matchesSearch = test.patientName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            test.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            test.type.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [tests, activeTab, searchQuery]);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return 'text-[#FACC15] bg-[#FACC15]/10 border-[#FACC15]/20';
      case 'Processing': return 'text-[#18E0FF] bg-[#18E0FF]/10 border-[#18E0FF]/20';
      case 'Completed': return 'text-[#22C55E] bg-[#22C55E]/10 border-[#22C55E]/20';
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'Urgent': return 'text-[#FF4D6D] bg-[#FF4D6D]/10';
      case 'Normal': return 'text-[#8B5CF6] bg-[#8B5CF6]/10';
      case 'Routine': return 'text-[#94A3B8] bg-[#94A3B8]/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'Pathology': return <TestTube size={16} />;
      case 'Radiology': return <Activity size={16} />;
      case 'Endocrinology': return <Beaker size={16} />;
      default: return <FileBarChart size={16} />;
    }
  };

  const handleUpdateStatus = (testId, newStatus) => {
    setTests(prev => prev.map(t => t.id === testId ? { ...t, status: newStatus } : t));
    if (selectedTest?.id === testId) {
      setSelectedTest(prev => ({ ...prev, status: newStatus }));
    }
    toast.success(`Test ${testId} moved to ${newStatus}`, {
      style: { background: '#141D31', border: '1px solid rgba(255,255,255,0.05)', color: '#F8FAFC' }
    });
  };

  return (
    <div className="space-y-4 pb-8 h-full flex flex-col relative font-sans">
      
      {/* Analytics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#131C33] border border-white/5 rounded-xl p-4 flex items-center justify-between shadow-sm">
           <div>
             <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-1">Total Requests</p>
             <h3 className="text-2xl font-bold text-[#F8FAFC]">{stats.total}</h3>
           </div>
           <div className="w-10 h-10 rounded-full bg-[#18E0FF]/10 flex items-center justify-center text-[#18E0FF]">
              <FileBarChart size={20} />
           </div>
        </div>
        <div className="bg-[#131C33] border border-white/5 rounded-xl p-4 flex items-center justify-between shadow-sm">
           <div>
             <p className="text-[10px] font-bold text-[#FACC15] uppercase tracking-widest mb-1">Pending Samples</p>
             <h3 className="text-2xl font-bold text-[#F8FAFC]">{stats.pending}</h3>
           </div>
           <div className="w-10 h-10 rounded-full bg-[#FACC15]/10 flex items-center justify-center text-[#FACC15]">
              <Clock size={20} />
           </div>
        </div>
        <div className="bg-[#131C33] border border-white/5 rounded-xl p-4 flex items-center justify-between shadow-sm">
           <div>
             <p className="text-[10px] font-bold text-[#18E0FF] uppercase tracking-widest mb-1">In Analytics</p>
             <h3 className="text-2xl font-bold text-[#F8FAFC]">{stats.processing}</h3>
           </div>
           <div className="w-10 h-10 rounded-full bg-[#18E0FF]/10 flex items-center justify-center text-[#18E0FF]">
              <Activity size={20} />
           </div>
        </div>
        <div className="bg-[#131C33] border border-white/5 rounded-xl p-4 flex items-center justify-between shadow-sm">
           <div>
             <p className="text-[10px] font-bold text-[#22C55E] uppercase tracking-widest mb-1">Results Ready</p>
             <h3 className="text-2xl font-bold text-[#F8FAFC]">{stats.completed}</h3>
           </div>
           <div className="w-10 h-10 rounded-full bg-[#22C55E]/10 flex items-center justify-center text-[#22C55E]">
              <CheckCircle2 size={20} />
           </div>
        </div>
      </div>

      <div className="flex-1 flex gap-4 h-[calc(100vh-250px)] min-h-[500px] overflow-hidden">
        
        {/* Main Command Center */}
        <div className="flex-1 bg-[#131C33] border border-white/5 rounded-xl flex flex-col overflow-hidden shadow-sm">
          
          {/* Header & Tabs */}
          <div className="border-b border-white/5 bg-[#0B1120]/50 flex flex-col">
            <div className="p-4 flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#F8FAFC] tracking-widest uppercase flex items-center gap-2">
                 Eye Diagnostics Center
              </h2>
              
              <div className="flex items-center gap-3">
                <div className="relative group w-64">
                  <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-[#94A3B8] group-focus-within:text-[#18E0FF]">
                    <Search size={12} />
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search tests, patients..."
                    className="w-full bg-[#0B1120] border border-white/5 text-[#F8FAFC] text-[10px] font-semibold px-2 py-2 pl-8 rounded-md outline-none focus:border-[#18E0FF] transition-colors"
                  />
                </div>
                <button className="bg-[#18E0FF]/10 hover:bg-[#18E0FF]/20 text-[#18E0FF] px-3 py-2 rounded-md transition-colors flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest">
                  <Plus size={12} /> New Test Request
                </button>
              </div>
            </div>

            <div className="flex px-4 gap-6 text-[10px] font-bold uppercase tracking-widest">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 border-b-2 transition-colors ${
                    activeTab === tab.id 
                      ? 'border-[#18E0FF] text-[#18E0FF]' 
                      : 'border-transparent text-[#94A3B8] hover:text-[#F8FAFC]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Test Queue Table */}
          <div className="flex-1 overflow-x-auto overflow-y-auto custom-scrollbar bg-[#0B1120]/20 relative">
             <table className="w-full text-left border-collapse min-w-[1000px]">
                <thead className="sticky top-0 bg-[#0B1120] z-10">
                   <tr>
                      <th className="px-4 py-3 border-b border-white/5 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Test ID</th>
                      <th className="px-4 py-3 border-b border-white/5 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Patient</th>
                      <th className="px-4 py-3 border-b border-white/5 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Test Type</th>
                      <th className="px-4 py-3 border-b border-white/5 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Priority</th>
                      <th className="px-4 py-3 border-b border-white/5 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Status</th>
                      <th className="px-4 py-3 border-b border-white/5 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Requested By</th>
                   </tr>
                </thead>
                <tbody>
                   {filteredTests.map((test) => (
                      <tr 
                        key={test.id} 
                        onClick={() => setSelectedTest(test)}
                        className={`cursor-pointer transition-colors border-b border-white/5 last:border-0 ${selectedTest?.id === test.id ? 'bg-[#18E0FF]/5' : 'hover:bg-[#131C33]/80'}`}
                      >
                         <td className="px-4 py-3">
                            <span className="text-[10px] font-mono text-[#18E0FF] bg-[#18E0FF]/10 px-2 py-1 rounded">{test.id}</span>
                            <span className="block text-[9px] text-[#94A3B8] mt-1">{test.date}</span>
                         </td>
                         <td className="px-4 py-3">
                            <p className="text-xs font-bold text-[#F8FAFC]">{test.patientName}</p>
                            <p className="text-[10px] text-[#94A3B8] mt-0.5">{test.ptId}</p>
                         </td>
                         <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                               <div className="p-1.5 rounded bg-[#131C33] border border-white/10 text-[#94A3B8]">
                                  {getCategoryIcon(test.category)}
                               </div>
                               <div>
                                  <p className="text-xs font-bold text-[#F8FAFC]">{test.type}</p>
                                  <p className="text-[9px] text-[#94A3B8] uppercase tracking-widest mt-0.5">{test.category}</p>
                               </div>
                            </div>
                         </td>
                         <td className="px-4 py-3">
                            <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded ${getPriorityColor(test.priority)}`}>
                              {test.priority}
                            </span>
                         </td>
                         <td className="px-4 py-3">
                            <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded border ${getStatusColor(test.status)}`}>
                              {test.status}
                            </span>
                         </td>
                         <td className="px-4 py-3">
                            <p className="text-xs font-semibold text-[#F8FAFC]">{test.doctor}</p>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
             {filteredTests.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-[#94A3B8]">
                   <Beaker size={32} className="mb-3 opacity-50" />
                   <p className="text-sm font-bold text-[#F8FAFC]">No lab requests found.</p>
                </div>
             )}
          </div>
        </div>

        {/* Right Panel: Analysis/Action Panel */}
        <AnimatePresence>
          {selectedTest && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="w-80 lg:w-[380px] bg-[#131C33] border border-white/5 rounded-xl flex flex-col shrink-0 overflow-hidden shadow-sm relative z-20"
            >
              <div className="p-4 border-b border-white/5 bg-[#0B1120]/50 flex justify-between items-center">
                <h3 className="text-sm font-bold text-[#F8FAFC]">Test Details</h3>
                <button onClick={() => setSelectedTest(null)} className="text-[#94A3B8] hover:text-[#FF4D6D] transition-colors">
                  <X size={16} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto custom-scrollbar pb-6">
                
                {/* Visual Header */}
                <div className="p-6 flex flex-col items-center text-center border-b border-white/5 bg-gradient-to-b from-[#18E0FF]/5 to-transparent">
                   <div className="w-16 h-16 rounded-full bg-[#18E0FF]/10 flex items-center justify-center text-[#18E0FF] border border-[#18E0FF]/20 mb-3 shadow-[0_0_20px_rgba(24,224,255,0.1)]">
                      {getCategoryIcon(selectedTest.category)}
                   </div>
                   <h2 className="text-lg font-bold text-[#F8FAFC] leading-tight">{selectedTest.type}</h2>
                   <p className="text-[10px] font-mono text-[#18E0FF] mt-2 bg-[#18E0FF]/10 px-2 py-0.5 rounded">{selectedTest.id}</p>
                </div>

                {/* Patient Context */}
                <div className="p-5 border-b border-white/5 bg-[#0B1120]/30 space-y-3">
                   <h4 className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Patient Context</h4>
                   <div className="flex items-center justify-between p-3 bg-[#131C33] border border-white/5 rounded-lg">
                      <div className="flex flex-col">
                         <span className="text-sm font-bold text-[#F8FAFC]">{selectedTest.patientName}</span>
                         <span className="text-[10px] text-[#94A3B8]">{selectedTest.ptId}</span>
                      </div>
                      <button className="text-[#18E0FF] hover:text-white transition-colors">
                         <Eye size={16} />
                      </button>
                   </div>
                   <div className="grid grid-cols-2 gap-2 text-xs">
                     <div className="flex flex-col bg-[#131C33] p-2 rounded border border-white/5">
                        <span className="text-[9px] font-bold text-[#94A3B8] uppercase tracking-widest mb-0.5">Requested By</span>
                        <span className="font-semibold text-[#F8FAFC]">{selectedTest.doctor}</span>
                     </div>
                     <div className="flex flex-col bg-[#131C33] p-2 rounded border border-white/5">
                        <span className="text-[9px] font-bold text-[#94A3B8] uppercase tracking-widest mb-0.5">Requested On</span>
                        <span className="font-semibold text-[#F8FAFC] text-[10px]">{selectedTest.date}</span>
                     </div>
                   </div>
                </div>

                {/* Live Tracking */}
                <div className="p-5 border-b border-white/5">
                   <h4 className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-4">Sample Tracking</h4>
                   
                   <div className="space-y-4">
                     <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${selectedTest.status !== 'Pending' ? 'bg-[#22C55E] text-white' : 'bg-[#18E0FF] text-black ring-4 ring-[#18E0FF]/20'}`}>
                           <CheckCircle2 size={12} />
                        </div>
                        <div className="flex-1">
                           <p className={`text-xs font-bold ${selectedTest.status !== 'Pending' ? 'text-[#F8FAFC]' : 'text-[#18E0FF]'}`}>Sample Collected</p>
                        </div>
                     </div>
                     <div className="ml-3 border-l-2 border-white/10 h-4 my-[-10px]"></div>
                     
                     <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${selectedTest.status === 'Completed' ? 'bg-[#22C55E] text-white' : selectedTest.status === 'Processing' ? 'bg-[#18E0FF] text-black ring-4 ring-[#18E0FF]/20' : 'bg-[#131C33] border border-white/10 text-white/30'}`}>
                           {selectedTest.status === 'Completed' ? <CheckCircle2 size={12} /> : <Microscope size={12} />}
                        </div>
                        <div className="flex-1">
                           <p className={`text-xs font-bold ${selectedTest.status === 'Completed' ? 'text-[#F8FAFC]' : selectedTest.status === 'Processing' ? 'text-[#18E0FF]' : 'text-[#94A3B8]'}`}>In Analytics</p>
                        </div>
                     </div>
                     <div className="ml-3 border-l-2 border-white/10 h-4 my-[-10px]"></div>

                     <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${selectedTest.status === 'Completed' ? 'bg-[#22C55E] text-white ring-4 ring-[#22C55E]/20' : 'bg-[#131C33] border border-white/10 text-white/30'}`}>
                           <FileText size={12} />
                        </div>
                        <div className="flex-1">
                           <p className={`text-xs font-bold ${selectedTest.status === 'Completed' ? 'text-[#22C55E]' : 'text-[#94A3B8]'}`}>Results Published</p>
                        </div>
                     </div>
                   </div>
                </div>

                {/* Workflow Actions */}
                <div className="p-5">
                   {selectedTest.status === 'Pending' && (
                     <button 
                       onClick={() => handleUpdateStatus(selectedTest.id, 'Processing')}
                       className="w-full bg-[#18E0FF] hover:bg-[#00C6E8] text-black font-bold text-xs py-3 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(24,224,255,0.3)]"
                     >
                       <Activity size={14} /> Begin Analysis
                     </button>
                   )}
                   {selectedTest.status === 'Processing' && (
                     <div className="space-y-2">
                       <button 
                         onClick={() => handleUpdateStatus(selectedTest.id, 'Completed')}
                         className="w-full bg-[#22C55E] hover:bg-[#1DBA54] text-white font-bold text-xs py-3 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(34,197,94,0.3)]"
                       >
                         <Upload size={14} /> Upload Final Results
                       </button>
                     </div>
                   )}
                   {selectedTest.status === 'Completed' && (
                     <div className="grid grid-cols-2 gap-2">
                       <button className="bg-[#18E0FF]/10 hover:bg-[#18E0FF]/20 text-[#18E0FF] border border-[#18E0FF]/20 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5">
                         <Eye size={12} /> View Report
                       </button>
                       <button className="bg-[#0B1120] hover:bg-white/5 text-[#F8FAFC] border border-white/10 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5">
                         <Download size={12} /> Download PDF
                       </button>
                       <button className="col-span-2 bg-[#0B1120] hover:bg-white/5 text-[#F8FAFC] border border-white/10 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5">
                         <Printer size={12} /> Print Document
                       </button>
                     </div>
                   )}
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Laboratory;
