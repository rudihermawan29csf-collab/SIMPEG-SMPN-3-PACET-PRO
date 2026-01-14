import React, { useState, useEffect } from 'react';
import { Search, Printer, Filter, Plus, Edit, Trash2, X, Save } from 'lucide-react';
import { Employee, Gender, RawDukData } from '../types';

interface DUKPageProps {
    employees: Employee[];
    onUpdate: (emp: Employee) => void;
    onDelete: (id: string) => void;
}

// Helper to add years to a date string (YYYY-MM-DD)
const addYears = (dateStr: string, years: number): string => {
  if (!dateStr) return "-";
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "-";
    date.setFullYear(date.getFullYear() + years);
    return date.toISOString().split('T')[0];
  } catch (e) {
    return "-";
  }
};

// Helper to check if date is within 3 months from now
const isWithinThreeMonths = (targetDateStr: string): boolean => {
  if (!targetDateStr || targetDateStr === '-') return false;
  try {
    const today = new Date();
    const target = new Date(targetDateStr);
    
    // Difference in milliseconds
    const diffTime = target.getTime() - today.getTime();
    // Difference in days
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Check if it's in the future but less than ~90 days, or slightly passed but not processed
    return diffDays <= 90; 
  } catch (e) {
    return false;
  }
};

export const DUKPage: React.FC<DUKPageProps> = ({ employees, onUpdate, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<RawDukData | null>(null);
  
  // Form State
  const defaultFormState: RawDukData = {
      id: 0, nama: "", nip: "", karpeg: "-", lp: "L",
      pangkatNama: "", pangkatTmt: "",
      jabatanNama: "", jabatanTmt: "",
      mkGolTh: "0", mkGolBln: "0", mkSelTh: "0", mkSelBln: "0",
      pendNama: "", pendTh: "", pendTk: "", pendJur: "",
      tglLahir: "", masaKpyad: "-", 
      tglSKBerkala: "", masaKenaikanBerkala: "",
      catatanMutasi: "-", ket: ""
  };
  const [formData, setFormData] = useState<RawDukData>(defaultFormState);

  // Mapper: Employee -> RawDukData (View Model)
  const mapEmployeeToDuk = (emp: Employee, index: number): RawDukData => {
     // Calculate berkala logic
     const nextBerkala = addYears(emp.tglSKBerkala || "", 2);
     const isAlert = isWithinThreeMonths(nextBerkala);

     return {
         id: parseInt(emp.id.replace('emp-', '')) || index + 1,
         nama: emp.fullName,
         nip: emp.nip || "-",
         karpeg: emp.karpeg || "-",
         lp: emp.gender === Gender.MALE ? "L" : "P",
         pangkatNama: emp.pangkat || "-",
         pangkatTmt: emp.tmtGolongan || "-",
         jabatanNama: emp.position || "-",
         jabatanTmt: emp.tmtStart || "-",
         mkGolTh: emp.workingYear?.toString() || "0",
         mkGolBln: emp.workingMonth?.toString() || "0",
         mkSelTh: emp.totalWorkingYear?.toString() || "0",
         mkSelBln: emp.totalWorkingMonth?.toString() || "0",
         pendNama: emp.university || "-",
         pendTh: emp.gradYear?.toString() || "-",
         pendTk: emp.lastEducation || "-",
         pendJur: emp.major || "-",
         tglLahir: emp.birthDate || "-",
         masaKpyad: emp.masaKpyad || "-",
         tglSKBerkala: emp.tglSKBerkala || "",
         masaKenaikanBerkala: nextBerkala,
         catatanMutasi: emp.catatanMutasi || "-",
         ket: isAlert ? "Waktunya Kenaikan Berkala" : ""
     };
  };

  const mappedData = employees.map(mapEmployeeToDuk);

  const filteredData = mappedData.filter(item => 
    item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.nip.includes(searchTerm) ||
    item.jabatanNama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (item?: RawDukData) => {
    if (item) {
      setEditItem(item);
      setFormData(item);
    } else {
      setEditItem(null);
      setFormData({ ...defaultFormState, id: Date.now() });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData(defaultFormState);
    setEditItem(null);
  };

  const handleInputChange = (field: keyof RawDukData, value: string) => {
    let updatedForm = { ...formData, [field]: value };
    // Auto calc logic for view
    if (field === 'tglSKBerkala') {
        updatedForm.masaKenaikanBerkala = addYears(value, 2);
    }
    setFormData(updatedForm);
  };

  const handleSave = () => {
    // We need to convert the RawDukData back to Employee and call onUpdate
    // This is a partial update strategy. Ideally we find the existing employee.
    const originalEmp = employees.find(e => `emp-${formData.id}` === e.id) || {} as Employee;

    const updatedEmployee: Employee = {
        ...originalEmp,
        id: `emp-${formData.id}`, // Maintain ID
        fullName: formData.nama,
        nip: formData.nip,
        gender: formData.lp === 'L' ? Gender.MALE : Gender.FEMALE,
        karpeg: formData.karpeg,
        pangkat: formData.pangkatNama,
        tmtGolongan: formData.pangkatTmt,
        position: formData.jabatanNama,
        tmtStart: formData.jabatanTmt,
        workingYear: parseInt(formData.mkGolTh),
        workingMonth: parseInt(formData.mkGolBln),
        totalWorkingYear: parseInt(formData.mkSelTh),
        totalWorkingMonth: parseInt(formData.mkSelBln),
        university: formData.pendNama,
        gradYear: parseInt(formData.pendTh),
        lastEducation: formData.pendTk,
        major: formData.pendJur,
        birthDate: formData.tglLahir,
        masaKpyad: formData.masaKpyad,
        tglSKBerkala: formData.tglSKBerkala,
        catatanMutasi: formData.catatanMutasi,
        // Preserve other fields
        documents: originalEmp.documents || [],
        familyMembers: originalEmp.familyMembers || [],
        completionPercentage: originalEmp.completionPercentage || 20,
        verificationStatus: originalEmp.verificationStatus || 'Belum Diverifikasi',
        lastUpdated: new Date().toISOString().split('T')[0],
        empStatus: originalEmp.empStatus || 'GTT',
        empType: originalEmp.empType || 'Guru',
        nik: originalEmp.nik || '',
        email: originalEmp.email || '',
        phone: originalEmp.phone || '',
        birthPlace: originalEmp.birthPlace || '',
        religion: originalEmp.religion || '',
        maritalStatus: originalEmp.maritalStatus || '',
        address: originalEmp.address || '',
        unit: 'SMPN 3 PACET',
    };

    onUpdate(updatedEmployee);
    handleCloseModal();
  };

  const handleDeleteClick = (id: number) => {
      if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
          onDelete(`emp-${id}`);
      }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-[calc(100vh-140px)]">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Daftar Urut Kepangkatan (DUK)</h2>
          <p className="text-sm text-gray-500">SMPN 3 PACET</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
             <input 
                type="text" 
                placeholder="Cari Nama / NIP..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[200px]"
             />
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 shadow-sm shadow-blue-200"
          >
            <Plus size={16} /> Tambah Data
          </button>
          <button 
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-200"
            onClick={() => window.print()}
          >
            <Printer size={16} />
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-xs text-left border-collapse min-w-[1800px]">
          <thead className="bg-gray-100 text-gray-700 font-bold sticky top-0 z-10 shadow-sm">
            <tr>
              <th rowSpan={2} className="px-2 py-3 border-r border-b border-gray-300 text-center w-10">NO</th>
              <th rowSpan={2} className="px-2 py-3 border-r border-b border-gray-300 text-center w-20">AKSI</th>
              <th rowSpan={2} className="px-3 py-3 border-r border-b border-gray-300 min-w-[150px] text-center">NAMA</th>
              <th rowSpan={2} className="px-3 py-3 border-r border-b border-gray-300 min-w-[150px] text-center">NIP</th>
              <th rowSpan={2} className="px-2 py-3 border-r border-b border-gray-300 text-center w-20">KAR PEG</th>
              <th rowSpan={2} className="px-2 py-3 border-r border-b border-gray-300 text-center w-10">L/P</th>
              <th colSpan={2} className="px-3 py-2 border-r border-b border-gray-300 text-center">PANGKAT/GOL</th>
              <th colSpan={2} className="px-3 py-2 border-r border-b border-gray-300 text-center">JABATAN</th>
              <th colSpan={2} className="px-2 py-2 border-r border-b border-gray-300 text-center">MK GOL</th>
              <th colSpan={2} className="px-2 py-2 border-r border-b border-gray-300 text-center">MK SEL</th>
              <th colSpan={4} className="px-3 py-2 border-r border-b border-gray-300 text-center">PENDIDIKAN</th>
              <th rowSpan={2} className="px-3 py-3 border-r border-b border-gray-300 min-w-[100px] text-center">TGL LAHIR</th>
              <th rowSpan={2} className="px-3 py-3 border-r border-b border-gray-300 min-w-[100px] text-center">MASA KPYAD</th>
              <th rowSpan={2} className="px-3 py-3 border-r border-b border-gray-300 min-w-[100px] text-center bg-yellow-50">TGL SK BERKALA</th>
              <th rowSpan={2} className="px-3 py-3 border-r border-b border-gray-300 min-w-[100px] text-center bg-blue-50">MASA KENAIKAN BERKALA (+2TH)</th>
              <th rowSpan={2} className="px-3 py-3 border-r border-b border-gray-300 min-w-[100px] text-center">CATAN MUTASI KARPEG</th>
              <th rowSpan={2} className="px-3 py-3 border-b border-gray-300 min-w-[150px] text-center">KET</th>
            </tr>
            <tr>
              {/* Sub-headers */}
              <th className="px-3 py-2 border-r border-b border-gray-300 text-center bg-gray-50">NAMA</th>
              <th className="px-3 py-2 border-r border-b border-gray-300 text-center bg-gray-50">TMT</th>
              
              <th className="px-3 py-2 border-r border-b border-gray-300 text-center bg-gray-50">NAMA</th>
              <th className="px-3 py-2 border-r border-b border-gray-300 text-center bg-gray-50">TMT</th>
              
              <th className="px-2 py-2 border-r border-b border-gray-300 text-center w-10 bg-gray-50">TH</th>
              <th className="px-2 py-2 border-r border-b border-gray-300 text-center w-10 bg-gray-50">BLN</th>
              
              <th className="px-2 py-2 border-r border-b border-gray-300 text-center w-10 bg-gray-50">TH</th>
              <th className="px-2 py-2 border-r border-b border-gray-300 text-center w-10 bg-gray-50">BLN</th>
              
              <th className="px-3 py-2 border-r border-b border-gray-300 text-center min-w-[120px] bg-gray-50">NAMA</th>
              <th className="px-2 py-2 border-r border-b border-gray-300 text-center w-14 bg-gray-50">TH. LULUS</th>
              <th className="px-3 py-2 border-r border-b border-gray-300 text-center bg-gray-50">TK. IJAZAH</th>
              <th className="px-3 py-2 border-r border-b border-gray-300 text-center min-w-[120px] bg-gray-50">JURUSAN</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, idx) => {
              // Check for red row condition based on KET
              const isAlert = row.ket === "Waktunya Kenaikan Berkala";

              return (
                <tr key={row.id} className={`transition-colors ${isAlert ? 'bg-red-50 hover:bg-red-100' : 'hover:bg-blue-50/50 bg-white'}`}>
                  <td className="px-2 py-2 text-center border-r border-b border-gray-200">{idx + 1}</td>
                  <td className="px-2 py-2 text-center border-r border-b border-gray-200">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => handleOpenModal(row)} className="p-1 text-blue-600 hover:bg-blue-100 rounded">
                        <Edit size={14} />
                      </button>
                      <button onClick={() => handleDeleteClick(row.id)} className="p-1 text-red-600 hover:bg-red-100 rounded">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                  <td className="px-3 py-2 border-r border-b border-gray-200 font-medium">{row.nama}</td>
                  <td className="px-3 py-2 border-r border-b border-gray-200 text-center">{row.nip}</td>
                  <td className="px-2 py-2 text-center border-r border-b border-gray-200">{row.karpeg}</td>
                  <td className="px-2 py-2 text-center border-r border-b border-gray-200">{row.lp}</td>
                  
                  <td className="px-3 py-2 border-r border-b border-gray-200">{row.pangkatNama}</td>
                  <td className="px-3 py-2 border-r border-b border-gray-200 text-center">{row.pangkatTmt}</td>
                  
                  <td className="px-3 py-2 border-r border-b border-gray-200">{row.jabatanNama}</td>
                  <td className="px-3 py-2 border-r border-b border-gray-200 text-center">{row.jabatanTmt}</td>
                  
                  <td className="px-2 py-2 text-center border-r border-b border-gray-200">{row.mkGolTh}</td>
                  <td className="px-2 py-2 text-center border-r border-b border-gray-200">{row.mkGolBln}</td>
                  
                  <td className="px-2 py-2 text-center border-r border-b border-gray-200">{row.mkSelTh}</td>
                  <td className="px-2 py-2 text-center border-r border-b border-gray-200">{row.mkSelBln}</td>
                  
                  <td className="px-3 py-2 border-r border-b border-gray-200">{row.pendNama}</td>
                  <td className="px-2 py-2 text-center border-r border-b border-gray-200">{row.pendTh}</td>
                  <td className="px-3 py-2 border-r border-b border-gray-200 text-center">{row.pendTk}</td>
                  <td className="px-3 py-2 border-r border-b border-gray-200">{row.pendJur}</td>
                  
                  <td className="px-3 py-2 border-r border-b border-gray-200 text-center">{row.tglLahir}</td>
                  <td className="px-3 py-2 border-r border-b border-gray-200 text-center">{row.masaKpyad}</td>
                  <td className="px-3 py-2 border-r border-b border-gray-200 text-center bg-yellow-50/50 font-medium text-gray-700">
                    {row.tglSKBerkala}
                  </td>
                  <td className="px-3 py-2 border-r border-b border-gray-200 text-center bg-blue-50/50 font-bold text-gray-800">
                    {row.masaKenaikanBerkala}
                  </td>
                  <td className="px-3 py-2 border-r border-b border-gray-200 text-center">{row.catatanMutasi}</td>
                  <td className={`px-3 py-2 border-b border-gray-200 text-center font-bold ${isAlert ? 'text-red-600' : ''}`}>
                    {row.ket}
                  </td>
                </tr>
              );
            })}
            {filteredData.length === 0 && (
              <tr>
                <td colSpan={24} className="px-6 py-10 text-center text-gray-400">
                  Data tidak ditemukan
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit/Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-gray-800">
                {editItem ? "Edit Data DUK" : "Tambah Data DUK"}
              </h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Basic Info */}
                <div className="space-y-4">
                  <h4 className="font-bold text-blue-600 text-sm border-b pb-1">Data Pegawai</h4>
                  <div className="grid grid-cols-1 gap-3">
                    <input className="input-field" placeholder="Nama Lengkap" value={formData.nama} onChange={e => handleInputChange('nama', e.target.value)} />
                    <input className="input-field" placeholder="NIP" value={formData.nip} onChange={e => handleInputChange('nip', e.target.value)} />
                    <div className="grid grid-cols-2 gap-2">
                        <input className="input-field" placeholder="Karpeg" value={formData.karpeg} onChange={e => handleInputChange('karpeg', e.target.value)} />
                        <select className="input-field" value={formData.lp} onChange={e => handleInputChange('lp', e.target.value)}>
                            <option value="L">L</option>
                            <option value="P">P</option>
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <input className="input-field" type="date" placeholder="Tgl Lahir" value={formData.tglLahir} onChange={e => handleInputChange('tglLahir', e.target.value)} />
                    </div>
                  </div>
                </div>

                {/* Pangkat & Jabatan */}
                <div className="space-y-4">
                   <h4 className="font-bold text-blue-600 text-sm border-b pb-1">Pangkat & Jabatan</h4>
                   <div className="grid grid-cols-2 gap-2">
                      <input className="input-field" placeholder="Nama Pangkat/Gol" value={formData.pangkatNama} onChange={e => handleInputChange('pangkatNama', e.target.value)} />
                      <input className="input-field" type="date" placeholder="TMT Pangkat" value={formData.pangkatTmt} onChange={e => handleInputChange('pangkatTmt', e.target.value)} />
                   </div>
                   <div className="grid grid-cols-2 gap-2">
                      <input className="input-field" placeholder="Nama Jabatan" value={formData.jabatanNama} onChange={e => handleInputChange('jabatanNama', e.target.value)} />
                      <input className="input-field" type="date" placeholder="TMT Jabatan" value={formData.jabatanTmt} onChange={e => handleInputChange('jabatanTmt', e.target.value)} />
                   </div>
                </div>

                {/* Masa Kerja */}
                <div className="space-y-4">
                   <h4 className="font-bold text-blue-600 text-sm border-b pb-1">Masa Kerja</h4>
                   <div className="grid grid-cols-2 gap-2">
                      <div>
                          <label className="text-xs text-gray-500">MK Gol Thn</label>
                          <input className="input-field" type="number" value={formData.mkGolTh} onChange={e => handleInputChange('mkGolTh', e.target.value)} />
                      </div>
                      <div>
                          <label className="text-xs text-gray-500">MK Gol Bln</label>
                          <input className="input-field" type="number" value={formData.mkGolBln} onChange={e => handleInputChange('mkGolBln', e.target.value)} />
                      </div>
                   </div>
                   <div className="grid grid-cols-2 gap-2">
                      <div>
                          <label className="text-xs text-gray-500">MK Sel Thn</label>
                          <input className="input-field" type="number" value={formData.mkSelTh} onChange={e => handleInputChange('mkSelTh', e.target.value)} />
                      </div>
                      <div>
                          <label className="text-xs text-gray-500">MK Sel Bln</label>
                          <input className="input-field" type="number" value={formData.mkSelBln} onChange={e => handleInputChange('mkSelBln', e.target.value)} />
                      </div>
                   </div>
                </div>

                 {/* Berkala & Lainnya */}
                 <div className="space-y-4">
                   <h4 className="font-bold text-blue-600 text-sm border-b pb-1">Berkala & Lainnya</h4>
                   <div>
                      <label className="text-xs font-bold text-gray-700">Tanggal SK Berkala</label>
                      <input 
                        className="input-field bg-yellow-50 border-yellow-200 focus:ring-yellow-500" 
                        type="date" 
                        value={formData.tglSKBerkala} 
                        onChange={e => handleInputChange('tglSKBerkala', e.target.value)} 
                      />
                      <p className="text-[10px] text-gray-500 mt-1">*Masa Kenaikan Berkala akan otomatis +2 tahun</p>
                   </div>
                   <div>
                       <label className="text-xs text-gray-500">Masa Kenaikan Berkala (Otomatis)</label>
                       <input className="input-field bg-gray-100" readOnly value={formData.masaKenaikanBerkala} />
                   </div>
                   <input className="input-field" placeholder="Catatan Mutasi" value={formData.catatanMutasi} onChange={e => handleInputChange('catatanMutasi', e.target.value)} />
                   <input className="input-field" placeholder="Keterangan (Otomatis jika merah)" value={formData.ket} onChange={e => handleInputChange('ket', e.target.value)} />
                </div>

                {/* Pendidikan */}
                <div className="md:col-span-2 space-y-4">
                    <h4 className="font-bold text-blue-600 text-sm border-b pb-1">Pendidikan</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                       <input className="input-field" placeholder="Nama Sekolah" value={formData.pendNama} onChange={e => handleInputChange('pendNama', e.target.value)} />
                       <input className="input-field" placeholder="Tahun Lulus" value={formData.pendTh} onChange={e => handleInputChange('pendTh', e.target.value)} />
                       <input className="input-field" placeholder="Tingkat (S1/S2)" value={formData.pendTk} onChange={e => handleInputChange('pendTk', e.target.value)} />
                       <input className="input-field" placeholder="Jurusan" value={formData.pendJur} onChange={e => handleInputChange('pendJur', e.target.value)} />
                    </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
              <button 
                onClick={handleCloseModal}
                className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-sm"
              >
                Batal
              </button>
              <button 
                onClick={handleSave}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm flex items-center gap-2 shadow-sm"
              >
                <Save size={16} /> Simpan
              </button>
            </div>
          </div>
          <style>{`
            .input-field {
              width: 100%;
              padding: 0.5rem 0.75rem;
              font-size: 0.875rem;
              border: 1px solid #e5e7eb;
              border-radius: 0.5rem;
              outline: none;
              transition: all 0.2s;
            }
            .input-field:focus {
              border-color: #3b82f6;
              box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
            }
          `}</style>
        </div>
      )}
    </div>
  );
};