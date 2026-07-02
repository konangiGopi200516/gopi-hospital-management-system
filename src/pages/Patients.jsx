import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
} from '@tanstack/react-table';
import { 
  Search, Plus, MoreVertical, FileText, ChevronLeft, ChevronRight, Filter, Download, X, Trash2
} from 'lucide-react';
import { allDoctors } from '../data/mockData';
import { getPatients, deletePatientFirebase, addPatient } from '../services/firebaseService';

const Patients = () => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      let data = await getPatients();
      
      // Auto-migrate if Firebase is empty but local storage has patients
      if (data.length === 0) {
        const localData = JSON.parse(localStorage.getItem('visionCare_patients')) || [];
        if (localData.length > 0) {
          console.log("Migrating local patients to Firebase...");
          for (const p of localData) {
            // Remove existing firebaseId if any to prevent issues
            const { firebaseId, ...cleanData } = p;
            await addPatient(cleanData);
          }
          data = await getPatients(); // Re-fetch after migration
        }
      }

      // Sort by newest first by reversing
      setPatients(data.reverse());
      // Keep local cache up to date
      localStorage.setItem('visionCare_patients', JSON.stringify(data));
    } catch (error) {
      console.error("Error fetching patients from Firebase:", error);
      // Fallback to local
      setPatients(JSON.parse(localStorage.getItem('visionCare_patients')) || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleDeletePatient = async (id, firebaseId) => {
    console.log("Delete clicked for:", id, "Firebase ID:", firebaseId);
    if (window.confirm('Are you sure you want to completely delete this patient record?')) {
      try {
        if (firebaseId) {
          console.log("Calling deletePatientFirebase...");
          await deletePatientFirebase(firebaseId);
        }
        console.log("Updating state and local cache...");
        setPatients(prev => prev.filter(p => p.id !== id));
        // Update local cache
        const stored = JSON.parse(localStorage.getItem('visionCare_patients')) || [];
        localStorage.setItem('visionCare_patients', JSON.stringify(stored.filter(p => p.id !== id)));
        console.log("Deletion successful.");
      } catch (error) {
        console.error("Error deleting patient from Firebase:", error);
        alert("Failed to delete patient. Check your connection.");
      }
    }
  };

  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor('id', {
      header: 'Patient ID',
      cell: info => <span className="font-mono text-xs font-bold text-[#18E0FF] bg-[#18E0FF]/10 px-2 py-1 rounded border border-[#18E0FF]/20 shadow-[0_0_10px_rgba(24,224,255,0.1)]">{info.getValue()}</span>,
    }),
    columnHelper.accessor('name', {
      header: 'Patient Details',
      cell: info => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[#141D31] border border-white/5 flex items-center justify-center font-bold text-[#F8FAFC] text-xs">
            {info.getValue().split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <p className="font-semibold text-sm text-[#F8FAFC]">{info.getValue()}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8] mt-0.5">{info.row.original.age} Yrs • {info.row.original.gender} • {info.row.original.bloodGroup}</p>
          </div>
        </div>
      ),
    }),
    columnHelper.accessor('doctor', { 
      header: 'Assigned Doctor',
      cell: info => <span className="font-semibold text-sm text-[#F8FAFC]">{info.getValue()}</span>
    }),
    columnHelper.accessor('problem', {
      header: 'Clinical Details',
      cell: info => (
        <div className="max-w-[180px]">
          <p className="font-semibold text-sm text-[#F8FAFC] truncate" title={info.getValue() || 'No problem stated'}>{info.getValue() || 'N/A'}</p>
        </div>
      )
    }),
    columnHelper.accessor('ward', { 
      header: 'Location',
      cell: info => (
        <div>
          <p className="font-semibold text-sm text-[#F8FAFC]">{info.getValue()}</p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8] mt-0.5">Bed: {info.row.original.bed}</p>
        </div>
      )
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: info => {
        const status = info.getValue();
        let color = 'bg-white/5 text-[#94A3B8] border-white/10';
        if (status === 'Admitted') color = 'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20 shadow-[0_0_8px_rgba(59,130,246,0.2)]';
        if (status === 'Critical') color = 'bg-[#FF296D]/10 text-[#FF296D] border-[#FF296D]/20 shadow-[0_0_8px_rgba(255,41,109,0.2)]';
        if (status === 'Stable') color = 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20 shadow-[0_0_8px_rgba(34,197,94,0.2)]';
        if (status === 'Discharged') color = 'bg-[#8B5CF6]/10 text-[#8B5CF6] border-[#8B5CF6]/20';
        
        return <span className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-widest font-bold border ${color}`}>{status}</span>;
      }
    }),
    columnHelper.display({
      id: 'actions',
      header: '',
      cell: (info) => (
        <div className="flex items-center gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-1.5 text-[#94A3B8] hover:text-[#18E0FF] hover:bg-[#141D31] border border-transparent hover:border-white/5 rounded transition-all" title="View Record"><FileText size={16} /></button>
          <button 
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleDeletePatient(info.row.original.id, info.row.original.firebaseId);
            }} 
            className="p-1.5 text-[#94A3B8] hover:text-[#FF296D] hover:bg-[#141D31] border border-transparent hover:border-white/5 rounded transition-all relative z-10 cursor-pointer" 
            title="Delete Patient"
          >
            <Trash2 size={16} />
          </button>
          <button className="p-1.5 text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#141D31] border border-transparent hover:border-white/5 rounded transition-all"><MoreVertical size={16} /></button>
        </div>
      ),
    })
  ];

  const table = useReactTable({
    data: patients,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#F8FAFC]">Patient Directory</h1>
          <p className="text-[#94A3B8] text-sm mt-1">Manage active EMRs and clinical records.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-[#141D31] border border-white/5 text-[#F8FAFC] rounded-lg hover:bg-[#141D31]/80 transition-colors font-semibold text-sm flex items-center gap-2 shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
            <Download size={16} />
            Export Data
          </button>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="linear-card overflow-hidden"
      >
        <div className="p-4 border-b border-white/5 bg-[#141D31]/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-96 group">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#94A3B8] group-focus-within:text-[#18E0FF] transition-colors">
              <Search size={16} />
            </span>
            <input
              type="text"
              value={globalFilter ?? ''}
              onChange={e => setGlobalFilter(e.target.value)}
              placeholder="Search EMR database..."
              className="input-field pl-9 py-2 text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-2 bg-[#141D31] border border-white/5 text-[#94A3B8] rounded-lg hover:text-[#F8FAFC] transition-colors font-semibold text-xs flex items-center gap-2">
              <Filter size={14} /> Filters
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="border-b border-white/5">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id} className="px-6 py-3 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest bg-[#101827]/50">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-white/5">
              {table.getRowModel().rows.map(row => (
                <tr key={row.id} className="hover:bg-[#141D31]/30 transition-colors group">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-3 border-t border-white/5 bg-[#141D31]/50 flex items-center justify-between">
          <span className="text-xs font-semibold text-[#94A3B8]">
            Showing <span className="text-[#F8FAFC]">{table.getState().pagination.pageIndex * 10 + 1}</span> to <span className="text-[#F8FAFC]">{Math.min((table.getState().pagination.pageIndex + 1) * 10, patients.length)}</span> of <span className="text-[#F8FAFC]">{patients.length}</span> entries
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="p-1.5 border border-white/5 rounded text-[#94A3B8] disabled:opacity-30 hover:bg-[#141D31] hover:text-[#F8FAFC] transition-colors bg-[#0B1120]"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="p-1.5 border border-white/5 rounded text-[#94A3B8] disabled:opacity-30 hover:bg-[#141D31] hover:text-[#F8FAFC] transition-colors bg-[#0B1120]"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Patients;
