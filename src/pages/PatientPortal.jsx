import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
} from '@tanstack/react-table';
import { Search, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { getPatients } from '../services/firebaseService';

const PatientPortal = () => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const data = await getPatients();
        setPatients(data.reverse());
      } catch (err) {
        setPatients(JSON.parse(localStorage.getItem('visionCare_patients')) || []);
      }
    };
    fetchPatients();
  }, []);

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
    <div className="py-24 bg-[#0B1120] min-h-[85vh] relative">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#F8FAFC]">Patient <span className="text-[#18E0FF]">Directory</span></h1>
          <p className="text-[#94A3B8] max-w-2xl mx-auto text-lg">Public directory of admitted patients and clinical locations.</p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#141D31] rounded-3xl border border-white/5 shadow-2xl overflow-hidden max-w-6xl mx-auto"
        >
          <div className="p-6 border-b border-white/5 bg-[#141D31]/50 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="relative w-full sm:w-96 group">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-[#94A3B8] group-focus-within:text-[#18E0FF] transition-colors">
                <Search size={18} />
              </span>
              <input
                type="text"
                value={globalFilter ?? ''}
                onChange={e => setGlobalFilter(e.target.value)}
                placeholder="Search by name, doctor, or ward..."
                className="w-full bg-[#0B1120] border border-white/5 rounded-xl pl-11 pr-4 py-3 text-[#F8FAFC] focus:outline-none focus:border-[#18E0FF]/50 transition-colors text-sm"
              />
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-3 bg-[#0B1120] border border-white/5 text-[#94A3B8] rounded-xl hover:text-[#F8FAFC] transition-colors font-semibold text-xs flex items-center gap-2">
                <Filter size={16} /> Filters
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead className="border-b border-white/5">
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <th key={header.id} className="px-6 py-4 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest bg-[#101827]/50">
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
                      <td key={cell.id} className="px-6 py-5 whitespace-nowrap">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
                {patients.length === 0 && (
                   <tr>
                     <td colSpan={columns.length} className="px-6 py-12 text-center text-[#94A3B8]">
                        No patients admitted yet.
                     </td>
                   </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-white/5 bg-[#141D31]/50 flex items-center justify-between">
            <span className="text-xs font-semibold text-[#94A3B8]">
              Showing <span className="text-[#F8FAFC]">{patients.length > 0 ? table.getState().pagination.pageIndex * 10 + 1 : 0}</span> to <span className="text-[#F8FAFC]">{Math.min((table.getState().pagination.pageIndex + 1) * 10, patients.length)}</span> of <span className="text-[#F8FAFC]">{patients.length}</span> entries
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="p-2 border border-white/5 rounded-lg text-[#94A3B8] disabled:opacity-30 hover:bg-[#0B1120] hover:text-[#F8FAFC] transition-colors bg-[#0B1120]/50"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="p-2 border border-white/5 rounded-lg text-[#94A3B8] disabled:opacity-30 hover:bg-[#0B1120] hover:text-[#F8FAFC] transition-colors bg-[#0B1120]/50"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PatientPortal;
