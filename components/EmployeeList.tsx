import React from 'react';
import { Employee } from '../types';
import { Edit, Trash2, Search, Filter, Download } from 'lucide-react';

interface EmployeeListProps {
  employees: Employee[];
  onSelect: (emp: Employee) => void;
}

export const EmployeeList: React.FC<EmployeeListProps> = ({ employees, onSelect }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between gap-4">
        <h2 className="text-lg font-bold text-gray-800">Data Pegawai</h2>
        <div className="flex gap-3">
          <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
             <input 
                type="text" 
                placeholder="Cari Nama / NIP..." 
                className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
             />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-200">
            <Filter size={16} /> Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 shadow-sm shadow-green-200">
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Pegawai</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">NIP / NIK</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Jabatan</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Kelengkapan</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {employees.map((emp) => (
              <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                      {emp.fullName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{emp.fullName}</p>
                      <p className="text-xs text-gray-400">{emp.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{emp.nip || emp.nik}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    emp.empStatus === 'PNS' ? 'bg-blue-100 text-blue-800' : 
                    emp.empStatus === 'PPPK' ? 'bg-indigo-100 text-indigo-800' : 
                    'bg-orange-100 text-orange-800'
                  }`}>
                    {emp.empStatus}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{emp.position || '-'}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-gray-200 rounded-full h-1.5 w-24">
                      <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${emp.completionPercentage}%` }}></div>
                    </div>
                    <span className="text-xs text-gray-500">{emp.completionPercentage}%</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                   <button 
                    onClick={() => onSelect(emp)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                   >
                     Detail
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};