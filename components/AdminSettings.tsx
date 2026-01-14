import React, { useState } from 'react';
import { Settings, Plus, Trash2, Save, FileText, FolderOpen, Edit2, FolderPlus } from 'lucide-react';
import { DocumentDefinition } from '../types';

interface AdminSettingsProps {
  docDefinitions: DocumentDefinition[];
  onUpdateDefinitions: (defs: DocumentDefinition[]) => void;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({ docDefinitions, onUpdateDefinitions }) => {
  const [newDocName, setNewDocName] = useState("");
  
  // Initial Groups State
  const [categories, setCategories] = useState<string[]>([
    'Data Pribadi', 
    'Kepegawaian (SK & Administrasi)', 
    'Pendidikan', 
    'Sertifikasi',
    'Data Keluarga', 
    'Dokumen Pendukung Lainnya'
  ]);
  
  const [activeGroup, setActiveGroup] = useState<string>('Data Pribadi');

  // --- CATEGORY LOGIC ---

  const handleAddCategory = () => {
    const name = window.prompt("Masukkan nama kategori baru:");
    if (name && name.trim() !== "") {
        if (categories.includes(name)) {
            alert("Kategori tersebut sudah ada!");
            return;
        }
        setCategories([...categories, name]);
        setActiveGroup(name);
    }
  };

  const handleEditCategory = (oldName: string) => {
    const newName = window.prompt("Ubah nama kategori:", oldName);
    if (newName && newName.trim() !== "" && newName !== oldName) {
        // 1. Update Category List
        setCategories(categories.map(c => c === oldName ? newName : c));
        
        // 2. Update Active Group if selected
        if (activeGroup === oldName) setActiveGroup(newName);

        // 3. Update all documents belonging to this group
        const updatedDocs = docDefinitions.map(doc => 
            doc.group === oldName ? { ...doc, group: newName } : doc
        );
        onUpdateDefinitions(updatedDocs);
    }
  };

  const handleDeleteCategory = (categoryName: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus kategori "${categoryName}"? Semua dokumen di dalamnya juga akan terhapus.`)) {
        // 1. Remove Category
        const newCategories = categories.filter(c => c !== categoryName);
        setCategories(newCategories);

        // 2. Switch Active Group
        if (activeGroup === categoryName) {
            setActiveGroup(newCategories[0] || "");
        }

        // 3. Delete all documents in this group
        const updatedDocs = docDefinitions.filter(doc => doc.group !== categoryName);
        onUpdateDefinitions(updatedDocs);
    }
  };

  // --- DOCUMENT LOGIC ---

  const handleAddDocument = (group: string) => {
    if (!newDocName.trim()) return;

    const newDef: DocumentDefinition = {
      id: `def-${Date.now()}`,
      name: newDocName,
      group: group,
      isRequired: false // Default to optional for custom docs
    };

    onUpdateDefinitions([...docDefinitions, newDef]);
    setNewDocName("");
  };

  const handleEditDocument = (docId: string, currentName: string) => {
      const newName = window.prompt("Ubah nama dokumen:", currentName);
      if (newName && newName.trim() !== "") {
          onUpdateDefinitions(docDefinitions.map(d => 
              d.id === docId ? { ...d, name: newName } : d
          ));
      }
  };

  const handleDeleteDocument = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus jenis dokumen ini? Dokumen yang sudah diupload pegawai mungkin akan tidak terlihat.')) {
      onUpdateDefinitions(docDefinitions.filter(d => d.id !== id));
    }
  };

  const handleToggleRequired = (id: string) => {
    onUpdateDefinitions(docDefinitions.map(d => 
      d.id === id ? { ...d, isRequired: !d.isRequired } : d
    ));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-gray-100 rounded-xl">
            <Settings className="text-gray-600" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Pengaturan Admin</h1>
            <p className="text-gray-500 text-sm">Kelola kategori dan jenis dokumen yang wajib diupload pegawai.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Groups */}
          <div className="space-y-4">
            <div className="space-y-2">
                <div className="flex justify-between items-center px-2 mb-3">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Kategori Dokumen</h3>
                </div>
                
                {categories.map(group => (
                <div key={group} className="relative group/item">
                    <button
                        onClick={() => setActiveGroup(group)}
                        className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center gap-3 pr-16 ${
                        activeGroup === group 
                            ? 'bg-blue-50 text-blue-700 border border-blue-100' 
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        <FolderOpen size={16} className={activeGroup === group ? 'text-blue-500' : 'text-gray-400'} />
                        <span className="truncate">{group}</span>
                    </button>
                    
                    {/* Category Actions (Show on hover or active) */}
                    <div className={`absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 ${activeGroup === group ? 'opacity-100' : 'opacity-0 group-hover/item:opacity-100'} transition-opacity`}>
                        <button 
                            onClick={(e) => { e.stopPropagation(); handleEditCategory(group); }}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-white rounded-md"
                            title="Edit Nama Kategori"
                        >
                            <Edit2 size={12} />
                        </button>
                        <button 
                            onClick={(e) => { e.stopPropagation(); handleDeleteCategory(group); }}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-white rounded-md"
                            title="Hapus Kategori"
                        >
                            <Trash2 size={12} />
                        </button>
                    </div>
                </div>
                ))}
            </div>

            <button 
                onClick={handleAddCategory}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-dashed border-gray-300 rounded-lg text-gray-500 text-sm hover:bg-gray-50 hover:text-blue-600 hover:border-blue-300 transition-all"
            >
                <FolderPlus size={16} /> Tambah Kategori
            </button>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 min-h-[400px]">
              {activeGroup ? (
                  <>
                    <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <span className="text-blue-600">📂</span> {activeGroup}
                    </h2>

                    {/* Add New Document Input */}
                    <div className="flex gap-3 mb-8">
                        <input
                        type="text"
                        value={newDocName}
                        onChange={(e) => setNewDocName(e.target.value)}
                        placeholder={`Tambah jenis dokumen baru di ${activeGroup}...`}
                        className="flex-1 px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm shadow-sm"
                        />
                        <button
                        onClick={() => handleAddDocument(activeGroup)}
                        disabled={!newDocName.trim()}
                        className="px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-black disabled:opacity-50 transition-all flex items-center gap-2"
                        >
                        <Plus size={16} /> Tambah
                        </button>
                    </div>

                    {/* Document List */}
                    <div className="space-y-3">
                        {docDefinitions
                        .filter(def => def.group === activeGroup)
                        .map((def) => (
                        <div key={def.id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:border-blue-300 transition-all group">
                            <div className="flex items-center gap-4">
                            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                <FileText size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-800">{def.name}</p>
                                <p className="text-xs text-gray-500">
                                {def.isRequired ? 'Wajib' : 'Opsional'}
                                </p>
                            </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                            <button
                                onClick={() => handleToggleRequired(def.id)}
                                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                                def.isRequired 
                                    ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                                    : 'bg-green-50 text-green-600 hover:bg-green-100'
                                }`}
                            >
                                {def.isRequired ? 'Set Opsional' : 'Set Wajib'}
                            </button>
                            
                            <div className="h-4 w-px bg-gray-200 mx-1"></div>

                            <button
                                onClick={() => handleEditDocument(def.id, def.name)}
                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Edit Nama"
                            >
                                <Edit2 size={16} />
                            </button>
                            <button
                                onClick={() => handleDeleteDocument(def.id)}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Hapus"
                            >
                                <Trash2 size={16} />
                            </button>
                            </div>
                        </div>
                        ))}
                        
                        {docDefinitions.filter(def => def.group === activeGroup).length === 0 && (
                        <div className="text-center py-10">
                            <p className="text-gray-400 text-sm">Belum ada jenis dokumen di kategori ini.</p>
                        </div>
                        )}
                    </div>
                  </>
              ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                      <FolderOpen size={48} className="mb-4 opacity-20" />
                      <p>Pilih atau buat kategori untuk memulai.</p>
                  </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};