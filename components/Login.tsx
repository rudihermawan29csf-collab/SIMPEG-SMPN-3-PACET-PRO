import React, { useState } from 'react';
import { School, ArrowRight, User as UserIcon, Shield, ChevronDown } from 'lucide-react';
import { User, Role, Employee } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
  employees: Employee[];
  systemUsers?: User[]; // Users from backend (admins)
}

export const Login: React.FC<LoginProps> = ({ onLogin, employees, systemUsers = [] }) => {
  const [role, setRole] = useState<'admin' | 'guru'>('guru'); // Default to Guru for easier access
  
  // Admin State
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  
  // Guru State
  const [selectedGuruId, setSelectedGuruId] = useState('');
  const [guruPassword, setGuruPassword] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      if (role === 'admin') {
        // Admin Logic - Check against fetched System Users (Sheet: Users)
        const adminUser = systemUsers.find(u => 
            u.username === adminUsername && 
            u.password === adminPassword && 
            u.role === Role.ADMIN
        );

        if (adminUser) {
          onLogin(adminUser);
        } else if (adminUsername === 'admin' && adminPassword === 'admin123') {
           // Fallback Hardcode just in case sheet is empty initially
           onLogin({
            id: 'admin-1',
            username: 'admin',
            name: 'Administrator',
            role: Role.ADMIN
          });
        } else {
          setError('Username atau password admin salah.');
          setLoading(false);
        }
      } else {
        // Guru Logic
        if (!selectedGuruId) {
           setError('Silakan pilih nama Anda terlebih dahulu.');
           setLoading(false);
           return;
        }

        if (guruPassword === 'guru123') {
           const selectedEmployee = employees.find(e => e.id === selectedGuruId);
           if (selectedEmployee) {
             onLogin({
               id: selectedEmployee.id,
               username: selectedEmployee.nip || selectedEmployee.fullName,
               name: selectedEmployee.fullName,
               role: Role.PEGAWAI,
               employeeId: selectedEmployee.id
             });
           } else {
             setError('Data guru tidak ditemukan.');
             setLoading(false);
           }
        } else {
          setError('Password guru salah.');
          setLoading(false);
        }
      }
    }, 800);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden font-sans">
      {/* MacOS Style Wallpaper Background */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center transition-all duration-1000 transform scale-105"
        style={{
            // Using a specific MacOS Big Sur / Monterey style abstract wallpaper
            backgroundImage: `url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2000&auto=format&fit=crop')`,
        }}
      >
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"></div>
      </div>

      {/* Glassmorphism Card */}
      <div className="relative z-10 w-full max-w-[380px] mx-4">
        
        {/* Logo / Icon Floating above card */}
        <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-[24px] flex items-center justify-center shadow-2xl border border-white/20">
                <School className="text-white drop-shadow-lg" size={48} />
            </div>
        </div>

        <div className="bg-white/40 backdrop-blur-xl border border-white/40 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] overflow-hidden animate-in fade-in zoom-in duration-500">
            {/* Header */}
            <div className="text-center pt-8 pb-6">
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight drop-shadow-sm">SIMPEG</h2>
                <p className="text-gray-700 text-sm font-medium opacity-80">SMPN 3 PACET</p>
            </div>

            {/* Role Switcher (Mac Style Segmented Control) */}
            <div className="px-8 mb-6">
                <div className="bg-gray-800/20 p-1 rounded-xl flex relative backdrop-blur-md">
                    <button 
                        onClick={() => { setRole('admin'); setError(''); }}
                        className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-1.5 z-10 ${
                            role === 'admin' ? 'bg-white shadow-md text-gray-900' : 'text-white/80 hover:text-white hover:bg-white/10'
                        }`}
                    >
                        <Shield size={14} /> Admin
                    </button>
                    <button 
                        onClick={() => { setRole('guru'); setError(''); }}
                        className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-1.5 z-10 ${
                            role === 'guru' ? 'bg-white shadow-md text-gray-900' : 'text-white/80 hover:text-white hover:bg-white/10'
                        }`}
                    >
                        <UserIcon size={14} /> Guru
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-4">
                
                {role === 'admin' ? (
                    /* ADMIN LOGIN FORM */
                    <div className="space-y-4 animate-in slide-in-from-right-8 duration-300">
                         <div>
                            <input
                                type="text"
                                value={adminUsername}
                                onChange={(e) => setAdminUsername(e.target.value)}
                                className="w-full px-4 py-3 bg-white/60 border border-white/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white/90 transition-all text-sm placeholder-gray-600 text-gray-900 shadow-inner"
                                placeholder="Username"
                                required
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                value={adminPassword}
                                onChange={(e) => setAdminPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-white/60 border border-white/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white/90 transition-all text-sm placeholder-gray-600 text-gray-900 shadow-inner"
                                placeholder="Password"
                                required
                            />
                        </div>
                    </div>
                ) : (
                    /* GURU LOGIN FORM */
                    <div className="space-y-4 animate-in slide-in-from-left-8 duration-300">
                        <div className="relative group">
                            <select
                                value={selectedGuruId}
                                onChange={(e) => setSelectedGuruId(e.target.value)}
                                className="w-full px-4 py-3 bg-white/60 border border-white/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white/90 transition-all text-sm text-gray-900 appearance-none cursor-pointer shadow-inner"
                                required
                            >
                                <option value="" disabled>Pilih Nama Guru...</option>
                                {employees
                                    .sort((a, b) => a.fullName.localeCompare(b.fullName))
                                    .map(emp => (
                                    <option key={emp.id} value={emp.id}>
                                        {emp.fullName}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none group-hover:text-gray-800 transition-colors" size={16} />
                        </div>
                        <div>
                            <input
                                type="password"
                                value={guruPassword}
                                onChange={(e) => setGuruPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-white/60 border border-white/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white/90 transition-all text-sm placeholder-gray-600 text-gray-900 shadow-inner"
                                placeholder="Password"
                                required
                            />
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="p-3 bg-red-500/20 backdrop-blur-sm text-red-800 text-xs font-medium rounded-lg text-center border border-red-500/20 animate-in fade-in slide-in-from-top-2">
                        {error}
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-4 bg-gray-900/80 hover:bg-gray-900 text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 backdrop-blur-md disabled:opacity-70 disabled:cursor-not-allowed group"
                >
                    {loading ? (
                        <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    ) : (
                        <>
                            <span>Masuk Aplikasi</span>
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>
            </form>
            
            <div className="bg-white/30 border-t border-white/30 p-4 text-center backdrop-blur-sm">
                 <p className="text-[10px] text-gray-800 font-semibold tracking-wide">
                     &copy; 2026 SYSTEM INFORMASI KEPEGAWAIAN by erha
                 </p>
            </div>
        </div>
      </div>
    </div>
  );
};