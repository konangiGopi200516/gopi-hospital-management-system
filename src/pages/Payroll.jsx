import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, Users, DollarSign, Wallet, FileText, ChevronRight, X, 
  Download, Printer, CheckCircle2, AlertCircle, Clock, Check, Building2, Edit2, Save
} from 'lucide-react';
import { toast } from 'react-toastify';
import { getStaff, updateStaff } from '../services/firebaseService';

const CATEGORIES = [
  'Overview', 'Doctors', 'Nurses', 'Housekeeping'
];

const Payroll = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(null);

  useEffect(() => {
    const fetchPayroll = async () => {
      try {
        const staff = await getStaff();
        setEmployees(staff);
      } catch (error) {
        console.error("Failed to fetch payroll from Firebase:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPayroll();
  }, []);

  // Computed Properties for Net Salary
  const detailedEmployees = useMemo(() => {
    return employees.map(emp => {
      const gross = emp.basic + emp.hra + emp.medical + emp.transport + emp.bonus;
      const deductions = emp.tax + emp.pf;
      const net = gross - deductions;
      return { ...emp, gross, deductions, net };
    });
  }, [employees]);

  const stats = useMemo(() => {
    let totalPayroll = 0;
    let pending = 0;
    let paid = 0;
    let doctorsSal = 0;
    let nursesSal = 0;

    detailedEmployees.forEach(emp => {
      totalPayroll += emp.net;
      if (emp.status === 'Pending' || emp.status === 'Processing') pending += emp.net;
      if (emp.status === 'Paid') paid += emp.net;
      if (emp.category === 'Doctors') doctorsSal += emp.net;
      if (emp.category === 'Nurses') nursesSal += emp.net;
    });

    return { 
      totalEmp: detailedEmployees.length,
      totalPayroll: new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(totalPayroll),
      pending: new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(pending),
      paid: new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(paid),
      doctorsSal: new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(doctorsSal),
      nursesSal: new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(nursesSal),
      avgSalary: new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(totalPayroll / detailedEmployees.length || 0),
    };
  }, [detailedEmployees]);

  const filteredData = useMemo(() => {
    return detailedEmployees.filter(emp => {
      const matchesTab = activeTab === 'Overview' || emp.category === activeTab;
      const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            emp.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            emp.designation.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [detailedEmployees, activeTab, searchQuery]);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Paid': return 'text-[#22C55E] bg-[#22C55E]/10 border-[#22C55E]/20';
      case 'Processing': return 'text-[#18E0FF] bg-[#18E0FF]/10 border-[#18E0FF]/20';
      case 'Pending': return 'text-[#FACC15] bg-[#FACC15]/10 border-[#FACC15]/20';
      case 'Hold': return 'text-[#FF4D6D] bg-[#FF4D6D]/10 border-[#FF4D6D]/20';
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
    }
  };

  const handleProcessPayment = () => {
    if (!selectedEmp) return;
    setEmployees(prev => prev.map(e => e.id === selectedEmp.id ? { ...e, status: 'Paid', date: '2026-06-29' } : e));
    setSelectedEmp(prev => ({ ...prev, status: 'Paid', date: '2026-06-29' }));
    toast.success(`Salary processed for ${selectedEmp.name}`, {
      style: { background: '#141D31', border: '1px solid rgba(255,255,255,0.05)', color: '#F8FAFC' }
    });
  };

  const handleSave = async () => {
    if (!editForm || !editForm.firebaseId) return;
    try {
      await updateStaff(editForm.firebaseId, editForm);
      setEmployees(prev => prev.map(emp => emp.id === editForm.id ? { ...emp, ...editForm } : emp));
      setSelectedEmp({ ...selectedEmp, ...editForm });
      setIsEditing(false);
      toast.success('Payroll details updated in Firebase!', { icon: '✅' });
    } catch (error) {
      console.error("Failed to update payroll in Firebase:", error);
      toast.error('Failed to update payroll details.', { icon: '❌' });
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      handleSave();
    } else {
      setEditForm({
        firebaseId: selectedEmp.firebaseId,
        basic: selectedEmp.basic,
        hra: selectedEmp.hra,
        medical: selectedEmp.medical,
        transport: selectedEmp.transport,
        bonus: selectedEmp.bonus,
        tax: selectedEmp.tax,
        pf: selectedEmp.pf
      });
      setIsEditing(true);
    }
  };

  const handleInputChange = (field, value) => {
    setEditForm(prev => ({ ...prev, [field]: Number(value) || 0 }));
  };

  return (
    <div className="space-y-4 pb-8 h-full flex flex-col relative font-sans">
      
      {/* Analytics Dashboard */}
      <div className="bg-[#131C33] border border-white/5 rounded-xl p-4 flex flex-col xl:flex-row xl:items-center justify-between gap-4 shadow-sm">
         <div className="flex flex-col">
           <h1 className="text-xl font-bold text-[#F8FAFC] flex items-center gap-2"><Building2 size={20} className="text-[#18E0FF]"/> Enterprise Payroll</h1>
           <p className="text-[#94A3B8] text-xs mt-1">Hospital Administrator & HR Operations Only</p>
         </div>

         <div className="flex flex-wrap items-center gap-6 text-xs border-l border-white/5 pl-6">
           <div className="flex flex-col"><span className="text-[#94A3B8] font-bold uppercase tracking-widest text-[9px] mb-1">Total Payrol</span><span className="font-bold text-[#F8FAFC] text-sm">{stats.totalPayroll}</span></div>
           <div className="flex flex-col"><span className="text-[#94A3B8] font-bold uppercase tracking-widest text-[9px] mb-1">Paid Status</span><span className="font-bold text-[#22C55E] text-sm">{stats.paid}</span></div>
           <div className="flex flex-col"><span className="text-[#94A3B8] font-bold uppercase tracking-widest text-[9px] mb-1">Pending Clearance</span><span className="font-bold text-[#FACC15] text-sm">{stats.pending}</span></div>
           <div className="flex flex-col"><span className="text-[#94A3B8] font-bold uppercase tracking-widest text-[9px] mb-1">Doctors Payroll</span><span className="font-bold text-[#18E0FF] text-sm">{stats.doctorsSal}</span></div>
           <div className="flex flex-col"><span className="text-[#94A3B8] font-bold uppercase tracking-widest text-[9px] mb-1">Avg Salary</span><span className="font-bold text-[#8B5CF6] text-sm">{stats.avgSalary}</span></div>
         </div>
      </div>

      <div className="flex-1 flex gap-4 h-[calc(100vh-200px)] min-h-[600px] overflow-hidden">
        
        {/* Left: Department Filter */}
        <div className="w-64 bg-[#131C33] border border-white/5 rounded-xl flex flex-col shrink-0 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-white/5 bg-[#0B1120]/50">
            <h3 className="text-xs font-bold text-[#F8FAFC] uppercase tracking-widest">Employee Categories</h3>
          </div>
          <div className="flex-1 p-3 space-y-1 overflow-y-auto custom-scrollbar">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => { setActiveTab(category); setSelectedEmp(null); setIsEditing(false); }}
                className={`w-full text-left px-3 py-2.5 rounded-lg transition-all flex items-center justify-between text-xs font-bold ${
                  activeTab === category 
                    ? 'bg-[#18E0FF]/10 text-[#18E0FF] border border-[#18E0FF]/20 shadow-[0_0_15px_rgba(24,224,255,0.02)]' 
                    : 'text-[#94A3B8] hover:bg-[#0B1120]/50 hover:text-[#F8FAFC] border border-transparent'
                }`}
              >
                {category}
                {activeTab === category && <ChevronRight size={14} />}
              </button>
            ))}
          </div>
        </div>

        {/* Center: Directory Table */}
        <div className="flex-1 bg-[#131C33] border border-white/5 rounded-xl flex flex-col overflow-hidden shadow-sm">
          
          <div className="p-4 border-b border-white/5 bg-[#0B1120]/50 flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#F8FAFC] tracking-widest uppercase">{activeTab} Payroll</h2>
            <div className="flex items-center gap-2">
              <div className="relative group w-64">
                <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-[#94A3B8] group-focus-within:text-[#18E0FF]">
                  <Search size={12} />
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search employees..."
                  className="w-full bg-[#0B1120] border border-white/5 text-[#F8FAFC] text-[10px] font-semibold px-2 py-2 pl-8 rounded-md outline-none focus:border-[#18E0FF] transition-colors"
                />
              </div>
              <button className="bg-[#0B1120] border border-white/5 hover:bg-white/5 text-[#94A3B8] p-2 rounded-md transition-colors flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest">
                <Download size={12} /> Export Excel
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-x-auto overflow-y-auto custom-scrollbar bg-[#0B1120]/20 relative">
             <table className="w-full text-left border-collapse min-w-[1000px]">
                <thead className="sticky top-0 bg-[#0B1120] z-10">
                   <tr>
                      <th className="px-4 py-3 border-b border-white/5 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Employee Info</th>
                      <th className="px-4 py-3 border-b border-white/5 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Designation</th>
                      <th className="px-4 py-3 border-b border-white/5 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest text-right">Basic Pay</th>
                      <th className="px-4 py-3 border-b border-white/5 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest text-right">Net Salary</th>
                      <th className="px-4 py-3 border-b border-white/5 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Status</th>
                      <th className="px-4 py-3 border-b border-white/5 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest text-right">Payslip</th>
                   </tr>
                </thead>
                <tbody>
                   {filteredData.map((emp) => (
                      <tr 
                        key={emp.id} 
                        onClick={() => { setSelectedEmp(emp); setIsEditing(false); }}
                        className={`cursor-pointer transition-colors border-b border-white/5 last:border-0 ${selectedEmp?.id === emp.id ? 'bg-[#18E0FF]/5' : 'hover:bg-[#131C33]/80'}`}
                      >
                         <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                               <img src={emp.photo} alt={emp.name} className="w-9 h-9 rounded object-cover border border-white/10" />
                               <div>
                                  <p className="text-sm font-bold text-[#F8FAFC]">{emp.name}</p>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-[10px] font-mono text-[#94A3B8]">{emp.id}</span>
                                    <span className="text-[9px] font-bold uppercase tracking-widest text-[#18E0FF] bg-[#18E0FF]/10 px-1 rounded">{emp.category}</span>
                                  </div>
                               </div>
                            </div>
                         </td>
                         <td className="px-4 py-3">
                            <p className="text-xs font-bold text-[#F8FAFC]">{emp.designation}</p>
                            <p className="text-[10px] text-[#94A3B8] uppercase tracking-widest mt-0.5">{emp.department}</p>
                         </td>
                         <td className="px-4 py-3 text-right">
                            <p className="text-xs font-bold text-[#94A3B8]">₹{emp.basic.toLocaleString()}</p>
                         </td>
                         <td className="px-4 py-3 text-right">
                            <p className="text-sm font-bold text-[#F8FAFC] font-mono">₹{emp.net.toLocaleString()}</p>
                            <p className="text-[9px] text-[#22C55E] uppercase tracking-widest mt-0.5">Deductions: ₹{emp.deductions.toLocaleString()}</p>
                         </td>
                         <td className="px-4 py-3">
                            <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded border ${getStatusColor(emp.status)}`}>{emp.status}</span>
                            {emp.status === 'Paid' && <p className="text-[9px] text-[#94A3B8] mt-1">{emp.date}</p>}
                         </td>
                         <td className="px-4 py-3 text-right">
                            <button className="text-[#94A3B8] hover:text-[#18E0FF] transition-colors p-1" title="View Payslip">
                               <FileText size={16} />
                            </button>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
             {filteredData.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-[#94A3B8]">
                   <Users size={32} className="mb-3 opacity-50" />
                   <p className="text-sm font-bold text-[#F8FAFC]">No records found</p>
                </div>
             )}
          </div>
        </div>

        {/* Right Panel: Payslip Slide-over */}
        <AnimatePresence>
          {selectedEmp && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="w-80 lg:w-[420px] bg-[#131C33] border border-white/5 rounded-xl flex flex-col shrink-0 overflow-hidden shadow-sm relative z-20"
            >
              <div className="p-4 border-b border-white/5 bg-[#0B1120]/50 flex justify-between items-center">
                <h3 className="text-sm font-bold text-[#F8FAFC] flex items-center gap-2"><FileText size={16} className="text-[#18E0FF]"/> Official Payslip</h3>
                <div className="flex items-center gap-3">
                  <button onClick={handleEditToggle} className={`${isEditing ? 'text-[#22C55E]' : 'text-[#94A3B8]'} hover:text-[#18E0FF] transition-colors`} title={isEditing ? 'Save Changes' : 'Edit Structure'}>
                    {isEditing ? <Save size={16} /> : <Edit2 size={16} />}
                  </button>
                  <button onClick={() => { setSelectedEmp(null); setIsEditing(false); }} className="text-[#94A3B8] hover:text-[#FF4D6D] transition-colors">
                    <X size={16} />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto custom-scrollbar pb-6 bg-white/5">
                
                {/* Payslip Header */}
                <div className="bg-[#0B1120] p-6 text-center border-b border-white/5 relative overflow-hidden">
                   <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#18E0FF]/5 rounded-full blur-2xl"></div>
                   <Activity size={32} className="text-[#18E0FF] mx-auto mb-2 icon-glow" />
                   <h2 className="text-xl font-bold text-[#F8FAFC] tracking-tight">VisionCare Eye Hospital</h2>
                   <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mt-1">Salary Statement • June 2026</p>
                </div>

                <div className="p-6">
                   {/* Employee Details */}
                   <div className="bg-[#131C33] p-4 rounded-xl border border-white/5 shadow-sm mb-6 flex items-start gap-4">
                      <img src={selectedEmp.photo} alt={selectedEmp.name} className="w-14 h-14 rounded-lg object-cover border border-white/10" />
                      <div className="flex-1">
                         <h3 className="text-base font-bold text-[#F8FAFC]">{selectedEmp.name}</h3>
                         <p className="text-xs text-[#18E0FF] font-semibold">{selectedEmp.designation}</p>
                         <div className="mt-2 grid grid-cols-2 gap-2 text-[10px] text-[#94A3B8] uppercase tracking-widest font-bold">
                            <div>EMP ID: <span className="text-[#F8FAFC] font-mono">{selectedEmp.id}</span></div>
                            <div>Dept: <span className="text-[#F8FAFC]">{selectedEmp.department}</span></div>
                            <div>PF: <span className="text-[#F8FAFC] font-mono">{selectedEmp.pfNumber}</span></div>
                            <div>Exp: <span className="text-[#F8FAFC]">{selectedEmp.experience} Yrs</span></div>
                         </div>
                      </div>
                   </div>

                   {/* Earnings & Deductions Table */}
                   <div className="border border-white/5 rounded-xl overflow-hidden mb-6">
                      <div className="grid grid-cols-2 bg-[#0B1120] text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">
                         <div className="p-3 border-r border-white/5">Earnings</div>
                         <div className="p-3">Deductions</div>
                      </div>
                      
                      <div className="grid grid-cols-2 bg-[#131C33] text-xs">
                         {/* Earnings Col */}
                         <div className="p-3 border-r border-white/5 space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-[#94A3B8]">Basic Pay</span>
                              {isEditing ? <input type="number" value={editForm.basic} onChange={(e) => handleInputChange('basic', e.target.value)} className="w-20 bg-[#0B1120] border border-white/10 text-right text-[#F8FAFC] rounded px-1" /> : <span className="font-bold text-[#F8FAFC]">₹{selectedEmp.basic.toLocaleString()}</span>}
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-[#94A3B8]">HRA</span>
                              {isEditing ? <input type="number" value={editForm.hra} onChange={(e) => handleInputChange('hra', e.target.value)} className="w-20 bg-[#0B1120] border border-white/10 text-right text-[#F8FAFC] rounded px-1" /> : <span className="font-bold text-[#F8FAFC]">₹{selectedEmp.hra.toLocaleString()}</span>}
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-[#94A3B8]">Medical</span>
                              {isEditing ? <input type="number" value={editForm.medical} onChange={(e) => handleInputChange('medical', e.target.value)} className="w-20 bg-[#0B1120] border border-white/10 text-right text-[#F8FAFC] rounded px-1" /> : <span className="font-bold text-[#F8FAFC]">₹{selectedEmp.medical.toLocaleString()}</span>}
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-[#94A3B8]">Transport</span>
                              {isEditing ? <input type="number" value={editForm.transport} onChange={(e) => handleInputChange('transport', e.target.value)} className="w-20 bg-[#0B1120] border border-white/10 text-right text-[#F8FAFC] rounded px-1" /> : <span className="font-bold text-[#F8FAFC]">₹{selectedEmp.transport.toLocaleString()}</span>}
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-[#94A3B8]">Bonus</span>
                              {isEditing ? <input type="number" value={editForm.bonus} onChange={(e) => handleInputChange('bonus', e.target.value)} className="w-20 bg-[#0B1120] border border-white/10 text-right text-[#F8FAFC] rounded px-1" /> : <span className="font-bold text-[#F8FAFC]">₹{selectedEmp.bonus.toLocaleString()}</span>}
                            </div>
                         </div>
                         {/* Deductions Col */}
                         <div className="p-3 space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-[#94A3B8]">Income Tax</span>
                              {isEditing ? <input type="number" value={editForm.tax} onChange={(e) => handleInputChange('tax', e.target.value)} className="w-20 bg-[#0B1120] border border-[#FF4D6D]/30 text-right text-[#FF4D6D] rounded px-1" /> : <span className="font-bold text-[#FF4D6D]">₹{selectedEmp.tax.toLocaleString()}</span>}
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-[#94A3B8]">Provident Fund</span>
                              {isEditing ? <input type="number" value={editForm.pf} onChange={(e) => handleInputChange('pf', e.target.value)} className="w-20 bg-[#0B1120] border border-[#FF4D6D]/30 text-right text-[#FF4D6D] rounded px-1" /> : <span className="font-bold text-[#FF4D6D]">₹{selectedEmp.pf.toLocaleString()}</span>}
                            </div>
                         </div>
                      </div>

                      <div className="grid grid-cols-2 bg-[#0B1120] border-t border-white/5 text-xs font-bold">
                         <div className="p-3 border-r border-white/5 flex justify-between">
                            <span className="text-[#94A3B8]">Gross</span>
                            <span className="text-[#18E0FF]">₹{(isEditing ? (editForm.basic + editForm.hra + editForm.medical + editForm.transport + editForm.bonus) : selectedEmp.gross).toLocaleString()}</span>
                         </div>
                         <div className="p-3 flex justify-between">
                            <span className="text-[#94A3B8]">Total Ded.</span>
                            <span className="text-[#FF4D6D]">₹{(isEditing ? (editForm.tax + editForm.pf) : selectedEmp.deductions).toLocaleString()}</span>
                         </div>
                      </div>
                   </div>

                   {/* Net Salary Block */}
                   <div className="bg-[#18E0FF]/5 border border-[#18E0FF]/20 p-4 rounded-xl flex items-center justify-between mb-6 shadow-[0_0_20px_rgba(24,224,255,0.05)]">
                      <div>
                         <span className="text-[10px] font-bold text-[#18E0FF] uppercase tracking-widest block mb-1">Net Payable Salary</span>
                         <span className="text-2xl font-bold text-[#F8FAFC] font-mono tracking-tight">₹{(isEditing ? (editForm.basic + editForm.hra + editForm.medical + editForm.transport + editForm.bonus - editForm.tax - editForm.pf) : selectedEmp.net).toLocaleString()}</span>
                      </div>
                      <div className="text-right">
                         <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded border ${getStatusColor(selectedEmp.status)}`}>{selectedEmp.status}</span>
                         <p className="text-[10px] font-bold text-[#94A3B8] mt-2">{selectedEmp.bank}</p>
                      </div>
                   </div>

                   {/* Workflow Actions */}
                   <div className="space-y-3">
                      {selectedEmp.status !== 'Paid' && (
                        <button 
                          onClick={handleProcessPayment}
                          className="w-full bg-[#18E0FF] hover:bg-[#00C6E8] text-black font-bold text-xs py-3 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(24,224,255,0.3)]"
                        >
                          <Wallet size={14} /> Process Payment Now
                        </button>
                      )}
                      <div className="grid grid-cols-2 gap-2">
                        <button className="bg-[#0B1120] hover:bg-white/5 text-[#F8FAFC] border border-white/10 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5">
                          <Download size={12} /> Download PDF
                        </button>
                        <button className="bg-[#0B1120] hover:bg-white/5 text-[#F8FAFC] border border-white/10 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5">
                          <Printer size={12} /> Print Slip
                        </button>
                      </div>
                   </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Payroll;
