import React from 'react';
import { User, Role } from '../types';
import { Users, FileText, CheckCircle, Clock } from 'lucide-react';

interface DashboardProps {
  user: User;
  stats: {
    totalEmployees: number;
    completedDocs: number;
    pendingDocs: number;
    verified: number;
  };
}

export const Dashboard: React.FC<DashboardProps> = ({ user, stats }) => {
  const StatCard = ({ title, value, icon: Icon, color, subtext }: any) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between">
      <div>
        <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
        {subtext && <p className="text-xs text-gray-400 mt-2">{subtext}</p>}
      </div>
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon className="text-white" size={24} />
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Selamat Datang, {user.name} 👋
        </h1>
        <p className="text-gray-500">
          {user.role === Role.ADMIN 
            ? 'Ringkasan data kepegawaian SMPN 3 Pacet hari ini.' 
            : 'Kelola data diri dan dokumen kepegawaian Anda dengan mudah.'}
        </p>
      </div>

      {user.role === Role.ADMIN ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Total Pegawai" 
            value={stats.totalEmployees} 
            icon={Users} 
            color="bg-blue-500"
            subtext="Guru & Tendik"
          />
          <StatCard 
            title="Dokumen Lengkap" 
            value={stats.completedDocs} 
            icon={CheckCircle} 
            color="bg-green-500"
            subtext="Siap diverifikasi"
          />
          <StatCard 
            title="Belum Lengkap" 
            value={stats.pendingDocs} 
            icon={Clock} 
            color="bg-yellow-500"
            subtext="Perlu tindak lanjut"
          />
          <StatCard 
            title="Terverifikasi" 
            value={stats.verified} 
            icon={FileText} 
            color="bg-purple-500"
            subtext="Data valid"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="col-span-2 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-2">Lengkapi Data Anda</h3>
                <p className="text-blue-100 mb-6 max-w-md text-sm leading-relaxed">
                  Pastikan data pribadi dan dokumen kepegawaian Anda selalu mutakhir untuk keperluan administrasi sekolah.
                </p>
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg text-sm font-medium">
                  Status: Belum Lengkap
                </div>
              </div>
              <FileText className="absolute right-[-20px] bottom-[-20px] text-white/10 w-48 h-48" />
           </div>
           
           <div className="bg-white p-6 rounded-2xl border border-gray-200">
              <h4 className="font-bold text-gray-800 mb-4">Pengumuman</h4>
              <ul className="space-y-3">
                <li className="text-sm text-gray-600 pb-3 border-b border-gray-100">
                   <span className="block text-xs text-blue-600 font-semibold mb-1">BARU</span>
                   Batas akhir upload SKPP bulan ini tanggal 25.
                </li>
                <li className="text-sm text-gray-600">
                   Harap verifikasi NIK dan KK pada menu Data Pribadi.
                </li>
              </ul>
           </div>
        </div>
      )}
    </div>
  );
};