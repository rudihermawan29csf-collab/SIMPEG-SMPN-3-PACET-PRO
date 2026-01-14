import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { EmployeeForm } from './components/EmployeeForm';
import { EmployeeList } from './components/EmployeeList';
import { AdminSettings } from './components/AdminSettings';
import { DUKPage } from './components/DUKPage';
import { User, Role, Employee, EmpStatus, Gender, DocumentDefinition } from './types';
import { api } from './services/api';

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
      const data = await api.fetchAll();
      if (data && data.status === 'success') {
          setEmployees(data.employees || []);
          setDocDefinitions(data.definitions || []);
          // Map backend users to User type if needed, primarily used for login check
          setSystemUsers(data.users || []); 
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