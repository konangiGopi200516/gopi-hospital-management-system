import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, Pill, Activity, AlertTriangle, AlertCircle, ShoppingCart,
  Calendar, FileText, CheckCircle2, ChevronRight, X, PackagePlus, ArrowDownRight, Tag, Beaker
} from 'lucide-react';
import { toast } from 'react-toastify';

const PHARMACY_INVENTORY = [
  { id: 'MED-101', name: 'Amoxicillin 500mg', type: 'Capsule', category: 'Antibiotic', stock: 1250, threshold: 200, unitPrice: 12.50, expiry: '2027-11-15', manufacturer: 'Sun Pharma', location: 'Rack A1' },
  { id: 'MED-102', name: 'Paracetamol 650mg', type: 'Tablet', category: 'Analgesic', stock: 4500, threshold: 500, unitPrice: 2.00, expiry: '2028-05-20', manufacturer: 'Cipla', location: 'Rack A2' },
  { id: 'MED-103', name: 'Pantoprazole 40mg', type: 'Tablet', category: 'Antacid', stock: 180, threshold: 300, unitPrice: 8.75, expiry: '2026-12-10', manufacturer: 'Torrent Pharma', location: 'Rack B1' },
  { id: 'MED-104', name: 'Azithromycin 250mg', type: 'Tablet', category: 'Antibiotic', stock: 850, threshold: 150, unitPrice: 22.00, expiry: '2027-08-05', manufacturer: 'Mankind', location: 'Rack A1' },
  { id: 'MED-105', name: 'Human Insulin (Mixtard)', type: 'Injection', category: 'Anti-Diabetic', stock: 45, threshold: 50, unitPrice: 145.00, expiry: '2026-10-22', manufacturer: 'Novo Nordisk', location: 'Cold Storage 1' },
  { id: 'MED-106', name: 'Ceftriaxone 1g', type: 'Injection', category: 'Antibiotic', stock: 320, threshold: 100, unitPrice: 55.00, expiry: '2027-03-18', manufacturer: 'Alkem', location: 'Rack C1' },
  { id: 'MED-107', name: 'Ibuprofen 400mg', type: 'Tablet', category: 'NSAID', stock: 2100, threshold: 400, unitPrice: 4.50, expiry: '2028-01-30', manufacturer: 'Abbott', location: 'Rack A3' },
  { id: 'MED-108', name: 'Ondansetron 4mg', type: 'Injection', category: 'Antiemetic', stock: 15, threshold: 100, unitPrice: 18.00, expiry: '2026-09-12', manufacturer: 'Dr. Reddys', location: 'Rack C2' },
  { id: 'MED-109', name: 'Atorvastatin 20mg', type: 'Tablet', category: 'Statin', stock: 680, threshold: 200, unitPrice: 15.20, expiry: '2027-06-25', manufacturer: 'Lupin', location: 'Rack B2' },
  { id: 'MED-110', name: 'Cough Syrup (Dextro)', type: 'Syrup', category: 'Antitussive', stock: 110, threshold: 150, unitPrice: 85.00, expiry: '2027-04-10', manufacturer: 'Pfizer', location: 'Rack D1' }
];

const TABS = [
  { id: 'All', label: 'All Inventory' },
  { id: 'Low Stock', label: 'Low Stock Alerts' },
  { id: 'Expiring', label: 'Expiring Soon' }
];

const Pharmacy = () => {
  const [inventory, setInventory] = useState(PHARMACY_INVENTORY);
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMed, setSelectedMed] = useState(null);

  const stats = useMemo(() => {
    let lowStock = 0;
    let outOfStock = 0;
    let totalValue = 0;

    inventory.forEach(med => {
      if (med.stock === 0) outOfStock++;
      else if (med.stock <= med.threshold) lowStock++;
      totalValue += (med.stock * med.unitPrice);
    });

    return { 
      totalItems: inventory.length, 
      lowStock, 
      outOfStock, 
      totalValue: new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(totalValue)
    };
  }, [inventory]);

  const filteredInventory = useMemo(() => {
    return inventory.filter(med => {
      let matchesTab = true;
      if (activeTab === 'Low Stock') matchesTab = med.stock <= med.threshold;
      // Simple logic for expiring soon: hardcoded check or just anything 2026 for mock purposes
      if (activeTab === 'Expiring') matchesTab = med.expiry.startsWith('2026');

      const matchesSearch = med.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            med.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            med.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [inventory, activeTab, searchQuery]);

  const getStockStatus = (stock, threshold) => {
    if (stock === 0) return { label: 'Out of Stock', color: 'text-[#FF4D6D] bg-[#FF4D6D]/10 border-[#FF4D6D]/20', icon: <AlertCircle size={10} /> };
    if (stock <= threshold) return { label: 'Low Stock', color: 'text-[#FACC15] bg-[#FACC15]/10 border-[#FACC15]/20', icon: <AlertTriangle size={10} /> };
    return { label: 'In Stock', color: 'text-[#22C55E] bg-[#22C55E]/10 border-[#22C55E]/20', icon: <CheckCircle2 size={10} /> };
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'Injection': return <Activity size={14} className="text-[#FF4D6D]" />;
      case 'Syrup': return <Beaker size={14} className="text-[#FACC15]" />;
      default: return <Pill size={14} className="text-[#18E0FF]" />;
    }
  };

  const handleRestock = () => {
    if (!selectedMed) return;
    setInventory(prev => prev.map(m => m.id === selectedMed.id ? { ...m, stock: m.stock + 500 } : m));
    setSelectedMed(prev => ({ ...prev, stock: prev.stock + 500 }));
    toast.success(`${selectedMed.name} successfully restocked.`, {
      style: { background: '#141D31', border: '1px solid rgba(255,255,255,0.05)', color: '#F8FAFC' }
    });
  };

  return (
    <div className="space-y-4 pb-8 h-full flex flex-col relative font-sans">
      
      {/* Analytics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#131C33] border border-white/5 rounded-xl p-4 flex items-center justify-between shadow-sm">
           <div>
             <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-1">Total Items</p>
             <h3 className="text-2xl font-bold text-[#F8FAFC]">{stats.totalItems}</h3>
           </div>
           <div className="w-10 h-10 rounded-full bg-[#18E0FF]/10 flex items-center justify-center text-[#18E0FF]">
              <Pill size={20} />
           </div>
        </div>
        <div className="bg-[#131C33] border border-white/5 rounded-xl p-4 flex items-center justify-between shadow-sm">
           <div>
             <p className="text-[10px] font-bold text-[#FACC15] uppercase tracking-widest mb-1">Low Stock Alerts</p>
             <h3 className="text-2xl font-bold text-[#F8FAFC]">{stats.lowStock}</h3>
           </div>
           <div className="w-10 h-10 rounded-full bg-[#FACC15]/10 flex items-center justify-center text-[#FACC15]">
              <AlertTriangle size={20} />
           </div>
        </div>
        <div className="bg-[#131C33] border border-white/5 rounded-xl p-4 flex items-center justify-between shadow-sm">
           <div>
             <p className="text-[10px] font-bold text-[#FF4D6D] uppercase tracking-widest mb-1">Out of Stock</p>
             <h3 className="text-2xl font-bold text-[#F8FAFC]">{stats.outOfStock}</h3>
           </div>
           <div className="w-10 h-10 rounded-full bg-[#FF4D6D]/10 flex items-center justify-center text-[#FF4D6D]">
              <AlertCircle size={20} />
           </div>
        </div>
        <div className="bg-[#131C33] border border-white/5 rounded-xl p-4 flex items-center justify-between shadow-sm">
           <div>
             <p className="text-[10px] font-bold text-[#22C55E] uppercase tracking-widest mb-1">Inventory Value</p>
             <h3 className="text-xl font-bold text-[#F8FAFC]">{stats.totalValue}</h3>
           </div>
           <div className="w-10 h-10 rounded-full bg-[#22C55E]/10 flex items-center justify-center text-[#22C55E]">
              <FileText size={20} />
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
                 Pharmacy Inventory
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
                    placeholder="Search medicines..."
                    className="w-full bg-[#0B1120] border border-white/5 text-[#F8FAFC] text-[10px] font-semibold px-2 py-2 pl-8 rounded-md outline-none focus:border-[#18E0FF] transition-colors"
                  />
                </div>
                <button className="bg-[#18E0FF]/10 hover:bg-[#18E0FF]/20 text-[#18E0FF] px-3 py-2 rounded-md transition-colors flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest">
                  <ShoppingCart size={12} /> Order Stock
                </button>
              </div>
            </div>

            <div className="flex px-4 gap-6 text-[10px] font-bold uppercase tracking-widest">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 border-b-2 transition-colors flex items-center gap-2 ${
                    activeTab === tab.id 
                      ? 'border-[#18E0FF] text-[#18E0FF]' 
                      : 'border-transparent text-[#94A3B8] hover:text-[#F8FAFC]'
                  }`}
                >
                  {tab.id === 'Low Stock' && <AlertTriangle size={12} />}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Inventory Table */}
          <div className="flex-1 overflow-x-auto overflow-y-auto custom-scrollbar bg-[#0B1120]/20 relative">
             <table className="w-full text-left border-collapse min-w-[1000px]">
                <thead className="sticky top-0 bg-[#0B1120] z-10">
                   <tr>
                      <th className="px-4 py-3 border-b border-white/5 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Item Info</th>
                      <th className="px-4 py-3 border-b border-white/5 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Category</th>
                      <th className="px-4 py-3 border-b border-white/5 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest text-right">Available Stock</th>
                      <th className="px-4 py-3 border-b border-white/5 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Status</th>
                      <th className="px-4 py-3 border-b border-white/5 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Expiry</th>
                      <th className="px-4 py-3 border-b border-white/5 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest text-right">Action</th>
                   </tr>
                </thead>
                <tbody>
                   {filteredInventory.map((med) => {
                      const status = getStockStatus(med.stock, med.threshold);
                      return (
                        <tr 
                          key={med.id} 
                          onClick={() => setSelectedMed(med)}
                          className={`cursor-pointer transition-colors border-b border-white/5 last:border-0 ${selectedMed?.id === med.id ? 'bg-[#18E0FF]/5' : 'hover:bg-[#131C33]/80'}`}
                        >
                           <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 rounded bg-[#131C33] border border-white/10 flex items-center justify-center">
                                    {getTypeIcon(med.type)}
                                 </div>
                                 <div>
                                    <p className="text-sm font-bold text-[#F8FAFC]">{med.name}</p>
                                    <span className="text-[10px] font-mono text-[#94A3B8]">{med.id}</span>
                                 </div>
                              </div>
                           </td>
                           <td className="px-4 py-3">
                              <p className="text-xs font-bold text-[#F8FAFC]">{med.category}</p>
                              <p className="text-[10px] text-[#94A3B8] uppercase tracking-widest mt-0.5">{med.type}</p>
                           </td>
                           <td className="px-4 py-3 text-right">
                              <p className="text-sm font-mono font-bold text-[#F8FAFC]">{med.stock.toLocaleString()}</p>
                              <p className="text-[9px] text-[#94A3B8] uppercase tracking-widest mt-0.5">Min: {med.threshold}</p>
                           </td>
                           <td className="px-4 py-3">
                              <span className={`flex w-fit items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded border ${status.color}`}>
                                {status.icon} {status.label}
                              </span>
                           </td>
                           <td className="px-4 py-3">
                              <p className={`text-xs font-semibold ${med.expiry.startsWith('2026') ? 'text-[#FACC15]' : 'text-[#F8FAFC]'}`}>{med.expiry}</p>
                           </td>
                           <td className="px-4 py-3 text-right">
                              <button className="text-[#94A3B8] hover:text-[#18E0FF] transition-colors p-1" title="View Details">
                                 <ChevronRight size={16} />
                              </button>
                           </td>
                        </tr>
                      );
                   })}
                </tbody>
             </table>
             {filteredInventory.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-[#94A3B8]">
                   <Pill size={32} className="mb-3 opacity-50" />
                   <p className="text-sm font-bold text-[#F8FAFC]">No medicines found.</p>
                </div>
             )}
          </div>
        </div>

        {/* Right Panel: Analysis/Action Panel */}
        <AnimatePresence>
          {selectedMed && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="w-80 lg:w-[380px] bg-[#131C33] border border-white/5 rounded-xl flex flex-col shrink-0 overflow-hidden shadow-sm relative z-20"
            >
              <div className="p-4 border-b border-white/5 bg-[#0B1120]/50 flex justify-between items-center">
                <h3 className="text-sm font-bold text-[#F8FAFC]">Inventory Item</h3>
                <button onClick={() => setSelectedMed(null)} className="text-[#94A3B8] hover:text-[#FF4D6D] transition-colors">
                  <X size={16} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto custom-scrollbar pb-6">
                
                {/* Visual Header */}
                <div className="p-6 flex flex-col items-center text-center border-b border-white/5 bg-gradient-to-b from-[#18E0FF]/5 to-transparent">
                   <div className="w-16 h-16 rounded-full bg-[#131C33] border border-[#18E0FF]/30 flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(24,224,255,0.15)]">
                      {getTypeIcon(selectedMed.type)}
                   </div>
                   <h2 className="text-xl font-bold text-[#F8FAFC]">{selectedMed.name}</h2>
                   <p className="text-[10px] font-bold text-[#18E0FF] uppercase tracking-widest mt-1 mb-2">{selectedMed.category} • {selectedMed.type}</p>
                   <p className="text-xs text-[#94A3B8] font-mono bg-[#0B1120] px-2 py-1 rounded border border-white/5">{selectedMed.id}</p>
                </div>

                {/* Stock Highlight */}
                <div className="p-6 border-b border-white/5 bg-[#0B1120]/30">
                   <div className="grid grid-cols-2 gap-4">
                     <div className="bg-[#131C33] border border-white/5 p-4 rounded-xl flex flex-col items-center text-center">
                        <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-1">Available</span>
                        <span className={`text-2xl font-mono font-bold ${selectedMed.stock <= selectedMed.threshold ? 'text-[#FACC15]' : 'text-[#22C55E]'}`}>
                          {selectedMed.stock}
                        </span>
                     </div>
                     <div className="bg-[#131C33] border border-white/5 p-4 rounded-xl flex flex-col items-center text-center">
                        <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-1">Unit Price</span>
                        <span className="text-2xl font-mono font-bold text-[#F8FAFC]">
                          ₹{selectedMed.unitPrice.toFixed(2)}
                        </span>
                     </div>
                   </div>
                </div>

                {/* Details */}
                <div className="p-6 space-y-4 border-b border-white/5">
                   <h4 className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-2">Item Specifications</h4>
                   <div className="space-y-3">
                     <div className="flex justify-between items-center text-xs">
                       <span className="font-semibold text-[#94A3B8] flex items-center gap-1.5"><Calendar size={12} /> Expiry Date</span>
                       <span className={`font-bold ${selectedMed.expiry.startsWith('2026') ? 'text-[#FACC15]' : 'text-[#F8FAFC]'}`}>{selectedMed.expiry}</span>
                     </div>
                     <div className="flex justify-between items-center text-xs">
                       <span className="font-semibold text-[#94A3B8] flex items-center gap-1.5"><Tag size={12} /> Manufacturer</span>
                       <span className="font-bold text-[#F8FAFC]">{selectedMed.manufacturer}</span>
                     </div>
                     <div className="flex justify-between items-center text-xs">
                       <span className="font-semibold text-[#94A3B8] flex items-center gap-1.5"><Activity size={12} /> Minimum Threshold</span>
                       <span className="font-bold text-[#F8FAFC]">{selectedMed.threshold} Units</span>
                     </div>
                   </div>
                </div>

                {/* Location */}
                <div className="p-6 space-y-4 border-b border-white/5">
                   <h4 className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-2">Storage Location</h4>
                   <div className="bg-[#0B1120] border border-white/5 rounded-lg p-3 flex items-center justify-between">
                     <span className="text-sm font-bold text-[#18E0FF]">{selectedMed.location}</span>
                     <span className="text-[9px] font-bold text-[#94A3B8] uppercase tracking-widest bg-[#131C33] px-2 py-1 rounded">Aisle 4</span>
                   </div>
                </div>

                {/* Workflow Actions */}
                <div className="p-5 space-y-2">
                   <button 
                     onClick={handleRestock}
                     className="w-full bg-[#18E0FF]/10 hover:bg-[#18E0FF]/20 text-[#18E0FF] border border-[#18E0FF]/20 font-bold text-xs py-3 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
                   >
                     <PackagePlus size={14} /> Receive New Stock
                   </button>
                   <button 
                     className="w-full bg-[#0B1120] hover:bg-white/5 text-[#F8FAFC] border border-white/10 font-bold text-xs py-3 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
                   >
                     <ArrowDownRight size={14} /> Dispense to Ward
                   </button>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Pharmacy;
