import React, { useState } from 'react';
import { 
  User, CheckCircle, AlertCircle, Upload, Save, ChevronRight, FileText, Briefcase, GraduationCap, Trash2, Search, Eye
} from 'lucide-react';
import { Employee, Gender, EmpStatus, FamilyMember, DocumentDefinition } from '../types';
import { 
  RELIGIONS, MARITAL_STATUS, BANKS, EDUCATION_LEVELS, 
  GOLONGAN
} from '../constants';

interface EmployeeFormProps {
  initialData?: Employee;
  readOnly?: boolean;
  onSave: (data: Employee) => void;
  docDefinitions: DocumentDefinition[]; // Received from Admin Settings
}

// Helper to calculate progress
const calculateProgress = (data: Partial<Employee>, definitions: DocumentDefinition[]): number => {
  let filled = 0;
  let total = 0;
  
  const requiredFields = ['fullName', 'nik', 'birthPlace', 'phone', 'email'];
  requiredFields.forEach(f => {
    total++;
    if ((data as any)[f]) filled++;
  });
  
  // Only count REQUIRED documents
  const requiredDocs = definitions.filter(d => d.isRequired);
  if (requiredDocs.length > 0) {
    requiredDocs.forEach(def => {
      total++;
      const doc = data.documents?.find(d => d.type === def.name);
      if (doc && doc.status !== 'missing') filled++;
    });
  }

  return Math.round((filled / total) * 100);
};

export const EmployeeForm: React.FC<EmployeeFormProps> = ({ initialData, readOnly = false, onSave, docDefinitions }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [docSearch, setDocSearch] = useState("");

  const [formData, setFormData] = useState<Partial<Employee>>(initialData || {
    documents: [],
    familyMembers: []
  });

  const handleChange = (field: keyof Employee, value: any) => {
    if (readOnly) return;
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFamilyChange = (id: string, field: keyof FamilyMember, value: any) => {
    if (readOnly) return;
    setFormData(prev => ({
      ...prev,
      familyMembers: prev.familyMembers?.map(m => m.id === id ? { ...m, [field]: value } : m)
    }));
  };

  const addFamilyMember = (relation: FamilyMember['relation']) => {
    if (readOnly) return;
    const newMember: FamilyMember = {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      relation,
      birthDate: '',
      isDependent: true
    };
    setFormData(prev => ({
      ...prev,
      familyMembers: [...(prev.familyMembers || []), newMember]
    }));
  };

  const removeFamilyMember = (id: string) => {
    if (readOnly) return;
    setFormData(prev => ({
      ...prev,
      familyMembers: prev.familyMembers?.filter(m => m.id !== id)
    }));
  };

  const handleFileUpload = (docName: string, file: File, group: string) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setFormData(prev => {
        const existingDocs = prev.documents || [];
        const existingIndex = existingDocs.findIndex(d => d.type === docName);
        
        const newDocEntry = {
          id: existingIndex >= 0 ? existingDocs[existingIndex].id : `doc-${Date.now()}`,
          type: docName,
          fileName: file.name,
          status: 'uploaded' as const,
          url: e.target?.result as string,
          uploadDate: new Date().toISOString(),
          group: group
        };

        if (existingIndex >= 0) {
          const newDocs = [...existingDocs];
          newDocs[existingIndex] = newDocEntry;
          return { ...prev, documents: newDocs };
        } else {
          return { ...prev, documents: [...existingDocs, newDocEntry] };
        }
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteDocument = (docType: string) => {
      setFormData(prev => ({
          ...prev,
          documents: prev.documents?.filter(d => d.type !== docType)
      }));
  };

  const handlePreviewDocument = (url?: string) => {
    if (url) {
      window.open(url, '_blank');
    } else {
      alert('File belum tersedia untuk dipreview.');
    }
  };

  const tabs = [
    { id: 'pribadi', label: 'Pribadi', icon: User },
    { id: 'kepegawaian', label: 'Kepegawaian', icon: Briefcase },
    ...(formData.empStatus === EmpStatus.PNS || formData.empStatus === EmpStatus.PPPK 
        ? [{ id: 'asn', label: 'Data ASN', icon: FileText }] : []),
    ...(formData.empStatus === EmpStatus.HONORER || formData.empStatus === EmpStatus.GTT || formData.empStatus === EmpStatus.PTT
        ? [{ id: 'non-asn', label: 'Non-ASN', icon: FileText }] : []),
    { id: 'pendidikan', label: 'Pendidikan', icon: GraduationCap },
    { id: 'keluarga', label: 'Keluarga', icon: User },
    { id: 'dokumen', label: 'Dokumen', icon: Upload },
    { id: 'status', label: 'Status', icon: CheckCircle },
  ];

  const Input = ({ label, field, type = "text", required = false, placeholder = "" }: any) => (
    <div className="mb-4">
      <label className="block text-xs font-semibold text-gray-600 uppercase mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        disabled={readOnly}
        className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition-all text-sm disabled:opacity-60"
        value={(formData as any)[field] || ''}
        onChange={(e) => handleChange(field, e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );

  const Select = ({ label, field, options, required = false }: any) => (
    <div className="mb-4">
      <label className="block text-xs font-semibold text-gray-600 uppercase mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        disabled={readOnly}
        className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition-all text-sm disabled:opacity-60"
        value={(formData as any)[field] || ''}
        onChange={(e) => handleChange(field, e.target.value)}
      >
        <option value="">-- Pilih --</option>
        {options.map((opt: string) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );

  const progress = calculateProgress(formData, docDefinitions);

  // Merge Definitions with actual Employee Data for rendering
  // We want to show ALL definitions available from Admin
  const mergedDocs = docDefinitions.map(def => {
    const existing = formData.documents?.find(d => d.type === def.name);
    return {
      ...def, // Contains name, group, isRequired
      // If employee has uploaded, use that data, otherwise default to missing
      fileData: existing || { 
        id: `missing-${def.id}`, 
        type: def.name, 
        status: 'missing' as const, 
        group: def.group 
      }
    };
  });

  // Filter and Group
  const filteredMergedDocs = mergedDocs.filter(item => 
    item.name.toLowerCase().includes(docSearch.toLowerCase())
  );

  const groupedDocs = filteredMergedDocs.reduce((acc, item) => {
    const group = item.group;
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {} as Record<string, typeof filteredMergedDocs>);

  // Get unique groups from definitions to maintain order/existence
  const availableGroups: string[] = Array.from(new Set(docDefinitions.map(d => d.group)));

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
      
      {/* HEADER SECTION */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="px-6 py-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
             <div className="w-16 h-16 rounded-full bg-white shadow-sm border border-gray-200 flex items-center justify-center text-blue-600 font-bold text-2xl flex-shrink-0">
               {formData.fullName ? formData.fullName.charAt(0) : '?'}
             </div>
             <div>
               <h1 className="text-xl font-bold text-gray-800">{formData.fullName || 'Nama Pegawai'}</h1>
               <div className="flex items-center gap-2 mt-1">
                 <span className="text-sm text-gray-500 bg-gray-200 px-2 py-0.5 rounded text-xs font-mono">{formData.nip || formData.nik || 'NIK/NIP Kosong'}</span>
                 <span className={`text-xs px-2 py-0.5 rounded border ${
                    formData.verificationStatus === 'Disetujui' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                 }`}>
                    {formData.verificationStatus}
                 </span>
               </div>
             </div>
          </div>

          <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-gray-200 shadow-sm md:min-w-[250px]">
             <div className="flex-1">
                <div className="flex justify-between text-xs mb-2">
                   <span className="font-semibold text-gray-500 uppercase tracking-wide">Kelengkapan Data</span>
                   <span className="font-bold text-blue-600">{progress}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div 
                     className={`h-2 rounded-full transition-all duration-500 ${
                       progress === 100 ? 'bg-green-500' : 'bg-blue-600'
                     }`}
                     style={{ width: `${progress}%` }}
                  ></div>
                </div>
             </div>
          </div>
        </div>

        {/* Horizontal Navigation Tabs */}
        <div className="flex overflow-x-auto px-6 hide-scrollbar border-t border-gray-200 bg-white">
          {tabs.map((tab, idx) => {
            const Icon = tab.icon;
            const isActive = activeTab === idx;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(idx)}
                className={`flex items-center gap-2 px-4 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  isActive 
                    ? 'border-blue-600 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon size={16} className={isActive ? 'text-blue-600' : 'text-gray-400'} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="p-6 md:p-8 min-h-[500px]">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-8">
             <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
               {React.createElement(tabs[activeTab].icon, { className: 'text-gray-400' })}
               <span className="text-gray-800">{tabs[activeTab].label}</span>
             </h2>
             {!readOnly && (
               <button 
                onClick={() => onSave(formData as Employee)}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-all shadow-md shadow-blue-200 hover:shadow-lg"
               >
                 <Save size={18} />
                 Simpan Perubahan
               </button>
             )}
          </div>

          {/* TAB 1: PRIBADI */}
          {activeTab === 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4">
              <Input label="Nama Lengkap" field="fullName" required placeholder="Tanpa gelar" />
              <div className="grid grid-cols-2 gap-4">
                 <Input label="Gelar Depan" field="frontTitle" />
                 <Input label="Gelar Belakang" field="backTitle" />
              </div>
              <Input label="NIK" field="nik" type="number" required placeholder="16 digit angka" />
              <Input label="NIP" field="nip" placeholder="Jika ASN" />
              <Input label="NUPTK" field="nuptk" />
              <div className="grid grid-cols-2 gap-4">
                 <Input label="Tempat Lahir" field="birthPlace" required />
                 <Input label="Tanggal Lahir" field="birthDate" type="date" required />
              </div>
              <Select label="Jenis Kelamin" field="gender" options={[Gender.MALE, Gender.FEMALE]} />
              <Select label="Agama" field="religion" options={RELIGIONS} />
              <Select label="Status Perkawinan" field="maritalStatus" options={MARITAL_STATUS} />
              <Input label="Email" field="email" type="email" required />
              <Input label="Nomor HP" field="phone" type="tel" required />
              <div className="lg:col-span-2">
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1.5">Alamat Lengkap</label>
                <textarea 
                  disabled={readOnly}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                  rows={3}
                  value={formData.address || ''}
                  onChange={e => handleChange('address', e.target.value)}
                ></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <Input label="Desa/Kelurahan" field="village" />
                 <Input label="Kecamatan" field="district" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <Input label="Kabupaten/Kota" field="city" />
                 <Input label="Provinsi" field="province" />
              </div>
            </div>
          )}

          {/* TAB 2: KEPEGAWAIAN */}
          {activeTab === 1 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4">
              <Select label="Status Kepegawaian" field="empStatus" options={Object.values(EmpStatus)} required />
              <Select label="Jenis Pegawai" field="empType" options={['Guru', 'Tenaga Kependidikan']} />
              <Input label="Jabatan" field="position" />
              <Input label="Tugas Utama" field="mainDuty" />
              <Input label="Unit Kerja" field="unit" placeholder="Default: SMPN 3 Pacet" />
              {formData.empType === 'Guru' && (
                <Input label="Mata Pelajaran" field="subject" />
              )}
              <Input label="TMT Bertugas" field="tmtStart" type="date" />
              <Input label="SK Pengangkatan" field="skNumber" />
            </div>
          )}

          {/* TAB 3: ASN (Conditional) */}
          {tabs.find(t => t.id === 'asn') && activeTab === tabs.findIndex(t => t.id === 'asn') && (
            <div className="space-y-8">
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                <h3 className="text-sm font-bold text-gray-800 border-b pb-2 mb-4 uppercase tracking-wider">Kepangkatan</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4">
                  <Select label="Golongan" field="golongan" options={GOLONGAN} />
                  <Input label="Pangkat" field="pangkat" />
                  <Input label="TMT Golongan" field="tmtGolongan" type="date" />
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Masa Kerja (Thn)" field="workingYear" type="number" />
                    <Input label="Masa Kerja (Bln)" field="workingMonth" type="number" />
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                <h3 className="text-sm font-bold text-gray-800 border-b pb-2 mb-4 uppercase tracking-wider">Administrasi</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4">
                   <Input label="Nomor Karpeg" field="karpeg" />
                   <Input label="Nomor Taspen" field="taspen" />
                   <Input label="NPWP" field="npwp" />
                   <Select label="Nama Bank" field="bankName" options={BANKS} />
                   <Input label="No Rekening" field="salaryAccount" type="number" />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: NON-ASN (Conditional) */}
          {tabs.find(t => t.id === 'non-asn') && activeTab === tabs.findIndex(t => t.id === 'non-asn') && (
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4">
                <Input label="Nomor Kontrak" field="contractNumber" />
                <Input label="Mulai Kontrak" field="contractStart" type="date" />
                <Input label="Akhir Kontrak" field="contractEnd" type="date" />
                <Select label="Sumber Honor" field="honorSource" options={['BOS', 'APBD', 'Komite', 'Lainnya']} />
                <Input label="Besaran Honor" field="honorAmount" type="number" />
             </div>
          )}

          {/* TAB 5: PENDIDIKAN */}
          {tabs.find(t => t.id === 'pendidikan') && activeTab === tabs.findIndex(t => t.id === 'pendidikan') && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4">
              <Select label="Pendidikan Terakhir" field="lastEducation" options={EDUCATION_LEVELS} />
              <Input label="Program Studi" field="major" />
              <Input label="Perguruan Tinggi" field="university" />
              <Input label="Tahun Lulus" field="gradYear" type="number" />
              <Input label="Nomor Ijazah" field="diplomaNumber" />
            </div>
          )}

          {/* TAB 6: KELUARGA */}
          {tabs.find(t => t.id === 'keluarga') && activeTab === tabs.findIndex(t => t.id === 'keluarga') && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Pasangan */}
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 h-fit">
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Pasangan (Suami/Istri)</h3>
                    {!readOnly && (
                       <button onClick={() => addFamilyMember('Suami/Istri')} className="text-xs text-blue-600 hover:text-blue-700 font-medium">+ Tambah</button>
                    )}
                 </div>
                 {formData.familyMembers?.filter(m => m.relation === 'Suami/Istri').length === 0 && (
                   <p className="text-sm text-gray-400 italic">Belum ada data pasangan.</p>
                 )}
                 {formData.familyMembers?.filter(m => m.relation === 'Suami/Istri').map((m) => (
                   <div key={m.id} className="bg-white p-4 rounded-lg shadow-sm mb-4 border border-gray-100">
                      <div className="grid grid-cols-1 gap-3">
                        <input 
                           className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                           placeholder="Nama Lengkap" 
                           value={m.name} 
                           onChange={e => handleFamilyChange(m.id, 'name', e.target.value)}
                        />
                        <input 
                           type="date" 
                           className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                           value={m.birthDate}
                           onChange={e => handleFamilyChange(m.id, 'birthDate', e.target.value)}
                        />
                      </div>
                      {!readOnly && (
                        <div className="mt-3 text-right">
                          <button onClick={() => removeFamilyMember(m.id)} className="text-red-500 text-xs hover:text-red-700">Hapus Data</button>
                        </div>
                      )}
                   </div>
                 ))}
              </div>

              {/* Anak */}
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 h-fit">
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Anak</h3>
                    {!readOnly && (
                       <button onClick={() => addFamilyMember('Anak')} className="text-xs text-blue-600 hover:text-blue-700 font-medium">+ Tambah</button>
                    )}
                 </div>
                 {formData.familyMembers?.filter(m => m.relation === 'Anak').length === 0 && (
                   <p className="text-sm text-gray-400 italic">Belum ada data anak.</p>
                 )}
                 {formData.familyMembers?.filter(m => m.relation === 'Anak').map((m) => (
                   <div key={m.id} className="bg-white p-4 rounded-lg shadow-sm mb-4 border border-gray-100">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                        <input 
                           className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                           placeholder="Nama Anak" 
                           value={m.name} 
                           onChange={e => handleFamilyChange(m.id, 'name', e.target.value)}
                        />
                        <input 
                           type="date" 
                           className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                           value={m.birthDate}
                           onChange={e => handleFamilyChange(m.id, 'birthDate', e.target.value)}
                        />
                      </div>
                      <select 
                         className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                         value={m.status || ''}
                         onChange={e => handleFamilyChange(m.id, 'status', e.target.value)}
                      >
                         <option value="">-- Status Anak --</option>
                         <option value="Kandung">Kandung</option>
                         <option value="Tiri">Tiri</option>
                         <option value="Angkat">Angkat</option>
                      </select>
                      {!readOnly && (
                        <div className="mt-3 text-right">
                          <button onClick={() => removeFamilyMember(m.id)} className="text-red-500 text-xs hover:text-red-700">Hapus Data</button>
                        </div>
                      )}
                   </div>
                 ))}
              </div>
            </div>
          )}

          {/* TAB 7: DOKUMEN */}
          {tabs.find(t => t.id === 'dokumen') && activeTab === tabs.findIndex(t => t.id === 'dokumen') && (
            <div className="space-y-6">
              
              {/* Document Search Bar */}
              <div className="relative mb-6">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                 <input 
                    type="text" 
                    placeholder="Cari dokumen..." 
                    value={docSearch}
                    onChange={(e) => setDocSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm"
                 />
              </div>

              {/* Grouped Documents based on definitions */}
              {availableGroups.map((group) => {
                 const docsInGroup = groupedDocs[group] || [];
                 if (docSearch && docsInGroup.length === 0) return null;
                 
                 // If no docs in group (because definitions are empty), don't show header
                 if (docsInGroup.length === 0) return null;

                 return (
                   <div key={group} className="mb-8">
                     <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
                        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                          <Briefcase size={16} className="text-blue-500" /> {group}
                        </h3>
                     </div>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                       {docsInGroup.map((docDef) => {
                         const fileData = docDef.fileData;
                         return (
                           <div key={docDef.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-200 transition-colors group">
                             <div className="flex items-center gap-4 overflow-hidden">
                               <div className={`p-3 rounded-lg flex-shrink-0 ${
                                 fileData.status === 'uploaded' || fileData.status === 'verified' 
                                   ? 'bg-green-100 text-green-600' 
                                   : 'bg-white text-gray-400 border border-gray-200'
                               }`}>
                                 <FileText size={20} />
                               </div>
                               <div className="min-w-0">
                                 <p className="text-sm font-bold text-gray-800 truncate" title={docDef.name}>
                                    {docDef.name} {docDef.isRequired && <span className="text-red-500">*</span>}
                                 </p>
                                 <p className="text-xs text-gray-500 flex items-center gap-1">
                                   {fileData.status === 'missing' ? (
                                     <span className="text-red-400">Belum diupload</span>
                                   ) : (
                                     <span className="text-green-600 font-medium truncate">{fileData.fileName || 'File terunggah'}</span>
                                   )}
                                 </p>
                               </div>
                             </div>
                             
                             <div className="flex items-center gap-2 flex-shrink-0">
                               {fileData.status !== 'missing' && (
                                  <button 
                                    onClick={() => handlePreviewDocument(fileData.url)}
                                    className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors" 
                                    title="Preview Dokumen"
                                  >
                                    <Eye size={18} />
                                  </button>
                               )}
                               
                               {!readOnly && (
                                 <>
                                    <label className="cursor-pointer px-3 py-1.5 text-xs font-medium text-blue-700 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 flex items-center gap-1 transition-colors">
                                     <Upload size={14} />
                                     <span className="hidden sm:inline">Upload</span>
                                     <input 
                                       type="file" 
                                       className="hidden" 
                                       accept=".pdf,.jpg,.jpeg,.png"
                                       onChange={(e) => {
                                         if (e.target.files?.[0]) handleFileUpload(docDef.name, e.target.files[0], docDef.group);
                                       }}
                                     />
                                   </label>
                                   
                                   {!docDef.isRequired && fileData.status !== 'missing' && (
                                     <button 
                                       onClick={() => handleDeleteDocument(docDef.name)}
                                       className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                       title="Hapus File"
                                     >
                                       <Trash2 size={16} />
                                     </button>
                                   )}
                                 </>
                               )}
                             </div>
                           </div>
                         );
                       })}
                     </div>
                   </div>
                 );
              })}
              
              {/* Empty State for Search */}
              {docSearch && Object.keys(groupedDocs).length === 0 && (
                 <div className="text-center py-10">
                    <p className="text-gray-400">Tidak ada dokumen yang cocok dengan pencarian "{docSearch}"</p>
                 </div>
              )}
            </div>
          )}

           {/* TAB 8: STATUS */}
           {tabs.find(t => t.id === 'status') && activeTab === tabs.findIndex(t => t.id === 'status') && (
             <div className="flex flex-col items-center justify-center py-10 space-y-8 bg-gray-50 rounded-xl border border-gray-100">
                <div className="text-center">
                  <h3 className="text-lg font-bold text-gray-800 mb-1">Status Kelengkapan Data</h3>
                  <p className="text-gray-500 text-sm">Data Anda akan diverifikasi oleh Admin setelah lengkap.</p>
                </div>

                <div className="relative w-40 h-40">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#2563eb"
                      strokeWidth="3"
                      strokeDasharray={`${progress}, 100`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-4xl font-bold text-gray-800">{progress}%</span>
                    <span className="text-xs text-gray-400 font-medium uppercase mt-1">Lengkap</span>
                  </div>
                </div>
                
                <div className="flex flex-col items-center gap-4">
                  <div className={`px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-sm ${
                    formData.verificationStatus === 'Disetujui' ? 'bg-green-100 text-green-700' :
                    formData.verificationStatus === 'Perlu Perbaikan' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {formData.verificationStatus === 'Disetujui' && <CheckCircle size={16} />}
                    {formData.verificationStatus === 'Perlu Perbaikan' && <AlertCircle size={16} />}
                    Status: {formData.verificationStatus}
                  </div>

                  {formData.adminNotes && (
                    <div className="bg-red-50 p-4 rounded-xl border border-red-100 max-w-lg w-full text-center">
                      <h4 className="font-bold text-red-800 text-xs mb-2 uppercase tracking-wide flex items-center justify-center gap-2">
                         <AlertCircle size={14} /> Catatan Admin
                      </h4>
                      <p className="text-red-700 text-sm leading-relaxed">{formData.adminNotes}</p>
                    </div>
                  )}
                </div>
             </div>
           )}

        </div>
      </div>
    </div>
  );
};