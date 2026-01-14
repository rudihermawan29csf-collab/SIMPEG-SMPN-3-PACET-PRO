import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { EmployeeForm } from './components/EmployeeForm';
import { EmployeeList } from './components/EmployeeList';
import { AdminSettings } from './components/AdminSettings';
import { DUKPage } from './components/DUKPage';
import { User, Role, Employee, EmpStatus, Gender, DocumentDefinition, RawDukData } from './types';
import { api } from './services/api';
import { INITIAL_DUK_DATA } from './constants';

// Helper to convert RawDukData to Employee for default data
const convertDukToEmployee = (duk: RawDukData): Employee => {
  let status = EmpStatus.HONORER;
  if (duk.pangkatNama?.includes('PPPK') || (duk.nip && duk.nip.length > 18)) status = EmpStatus.PPPK;
  if (duk.pangkatNama?.includes('/') || (duk.nip && duk.nip.length > 10 && !duk.pangkatNama?.includes('PPPK'))) status = EmpStatus.PNS;
  if (duk.jabatanNama?.includes('GTT')) status = EmpStatus.GTT;

  return {
    id: `emp-${duk.id}`,
    fullName: duk.nama,
    nik: duk.nip && duk.nip !== '-' ? duk.nip : '',
    nip: duk.nip !== '-' ? duk.nip : '',
    birthPlace: duk.tempatLahir || 'Mojokerto',
    birthDate: duk.tglLahir !== '-' ? duk.tglLahir : '',
    gender: duk.lp === 'L' ? Gender.MALE : Gender.FEMALE,
    religion: 'Islam',
    maritalStatus: 'Kawin',
    address: '-',
    phone: '-',
    email: `${duk.nama.replace(/[^a-zA-Z0-9]/g, '.').toLowerCase()}@sekolah.id`,
    empStatus: status,
    empType: duk.jabatanNama.includes('Guru') ? 'Guru' : 'Tendik',
    position: duk.jabatanNama,
    unit: 'SMPN 3 PACET',
    tmtStart: duk.jabatanTmt !== '-' ? duk.jabatanTmt : '',
    pangkat: duk.pangkatNama,
    tmtGolongan: duk.pangkatTmt !== '-' ? duk.pangkatTmt : '',
    workingYear: parseInt(duk.mkGolTh) || 0,
    workingMonth: parseInt(duk.mkGolBln) || 0,
    totalWorkingYear: parseInt(duk.mkSelTh) || 0,
    totalWorkingMonth: parseInt(duk.mkSelBln) || 0,
    university: duk.pendNama,
    gradYear: parseInt(duk.pendTh) || 0,
    lastEducation: duk.pendTk,
    major: duk.pendJur,
    karpeg: duk.karpeg !== '-' ? duk.karpeg : '',
    tglSKBerkala: duk.tglSKBerkala,
    catatanMutasi: duk.catatanMutasi,
    completionPercentage: 20,
    verificationStatus: 'Belum Diverifikasi',
    lastUpdated: new Date().toISOString(),
    documents: [],
    familyMembers: []
  };
};

// --- APP COMPONENT ---
function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  
  // State for data management
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [docDefinitions, setDocDefinitions] = useState<DocumentDefinition[]>([]);
  const [systemUsers, setSystemUsers] = useState<User[]>([]);
  
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // FETCH DATA ON LOAD
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await api.fetchAll();
        
        // If data from API exists and has employees, use it.
        // If API returns success but 0 employees, OR api call fails, fall back to INITIAL_DUK_DATA
        if (data && data.status === 'success' && data.employees && data.employees.length > 0) {
            setEmployees(data.employees);
            setDocDefinitions(data.definitions || []);
            setSystemUsers(data.users || []);
        } else {
            console.warn("API empty or failed, loading default DUK data.");
            const defaultEmployees = INITIAL_DUK_DATA.map(convertDukToEmployee);
            setEmployees(defaultEmployees);
            setDocDefinitions(data?.definitions || []); // Keep defs if any
            setSystemUsers(data?.users || []);
        }
      } catch (e) {
        console.error("Critical fetch error, using defaults", e);
        const defaultEmployees = INITIAL_DUK_DATA.map(convertDukToEmployee);
        setEmployees(defaultEmployees);
      }
      setIsLoading(false);
    };
    loadData();
  }, []);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setSelectedEmployee(null);
  };

  const handleSaveEmployee = async (updatedData: Employee) => {
    // Optimistic Update
    const oldEmployees = [...employees];
    
    // Update Local State immediately
    if (employees.find(e => e.id === updatedData.id)) {
        setEmployees(prev => prev.map(e => e.id === updatedData.id ? updatedData : e));
    } else {
        setEmployees(prev => [...prev, updatedData]);
    }

    // Send to Backend
    const success = await api.saveEmployee(updatedData);
    if (success) {
        if (user?.role === Role.PEGAWAI) {
            alert('Data berhasil disimpan ke server!');
        }
    } else {
        alert('Gagal menyimpan ke server. Periksa koneksi internet.');
        setEmployees(oldEmployees); // Revert on fail
    }

    if (user?.role !== Role.PEGAWAI) {
      setSelectedEmployee(null);
    }
  };
  
  const handleDeleteEmployee = async (id: string) => {
      if (window.confirm("Yakin hapus data ini permanen?")) {
        setEmployees(prev => prev.filter(e => e.id !== id));
        await api.deleteEmployee(id);
      }
  };

  const handleUpdateDefinitions = async (defs: DocumentDefinition[]) => {
      setDocDefinitions(defs);
      await api.saveDefinitions(defs);
      alert("Pengaturan disimpan.");
  };

  const renderContent = () => {
    // Pass real system users to Login for validation
    if (!user) return <Login onLogin={handleLogin} employees={employees} systemUsers={systemUsers} />;

    switch (currentPage) {
      case 'dashboard':
        return (
          <Dashboard 
            user={user} 
            stats={{
              totalEmployees: employees.length,
              completedDocs: employees.filter(e => e.completionPercentage > 80).length,
              pendingDocs: employees.filter(e => e.completionPercentage < 50).length,
              verified: employees.filter(e => e.verificationStatus === 'Disetujui').length
            }} 
          />
        );
      
      case 'employee-list':
        if (selectedEmployee) {
          return (
            <div>
              <button 
                onClick={() => setSelectedEmployee(null)}
                className="mb-4 text-sm text-gray-500 hover:text-blue-600 flex items-center gap-1"
              >
                &larr; Kembali ke Daftar
              </button>
              <EmployeeForm 
                initialData={selectedEmployee} 
                onSave={handleSaveEmployee} 
                readOnly={false} // Admin can edit
                docDefinitions={docDefinitions}
              />
            </div>
          );
        }
        return <EmployeeList employees={employees} onSelect={setSelectedEmployee} />;
      
      case 'my-profile':
        // For logged in employee, find their data or use fallback linked to user
        const myData = employees.find(e => e.id === user.employeeId) || employees[0];
        
        // If data not loaded yet or no ID match
        if (!myData) return <div className="p-8 text-center text-gray-500">Memuat data profil...</div>;

        return <EmployeeForm 
          initialData={myData} 
          onSave={handleSaveEmployee} 
          docDefinitions={docDefinitions}
        />;

      case 'settings':
        return (
          <AdminSettings 
            docDefinitions={docDefinitions} 
            onUpdateDefinitions={handleUpdateDefinitions} 
          />
        );

      case 'duk':
        return <DUKPage 
                  employees={employees} 
                  onUpdate={handleSaveEmployee} 
                  onDelete={handleDeleteEmployee} 
               />;

      default:
        return <div>Halaman tidak ditemukan</div>;
    }
  };

  if (isLoading) {
      return (
          <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-500 font-medium">Menghubungkan ke Database Sekolah...</p>
          </div>
      );
  }

  return (
    <Layout 
      user={user} 
      onLogout={handleLogout} 
      currentPage={currentPage}
      onNavigate={(page) => {
        setCurrentPage(page);
        if (page === 'employee-list') setSelectedEmployee(null);
      }}
    >
      {renderContent()}
    </Layout>
  );
}

export default App;