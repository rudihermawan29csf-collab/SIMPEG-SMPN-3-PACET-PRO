import React from 'react';
import { User, Role } from '../types';
import { 
  LayoutDashboard, 
  Users, 
  LogOut, 
  Menu,
  School,
  X,
  UserCircle,
  Settings,
  ClipboardList
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  user, 
  onLogout, 
  currentPage, 
  onNavigate 
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  if (!user) return <div className="min-h-screen bg-gray-50">{children}</div>;

  const NavItem = ({ page, icon: Icon, label }: { page: string, icon: any, label: string }) => {
    const isActive = currentPage === page;
    return (
      <button
        onClick={() => {
          onNavigate(page);
          setIsMobileMenuOpen(false);
        }}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium whitespace-nowrap ${
          isActive 
            ? 'bg-blue-600 text-white shadow-md shadow-blue-200' 
            : 'text-gray-600 hover:bg-white hover:text-blue-600'
        }`}
      >
        <Icon size={18} className={isActive ? 'text-white' : 'text-gray-400'} />
        <span>{label}</span>
      </button>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f3f4f6]">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            
            {/* Logo Section */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="p-1.5 bg-blue-600 rounded-lg shadow-md shadow-blue-200">
                <School className="text-white" size={20} />
              </div>
              <div className="hidden md:block">
                <h1 className="font-bold text-gray-800 text-sm leading-tight">SMPN 3 PACET</h1>
                <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Sistem Kepegawaian</p>
              </div>
              <div className="md:hidden font-bold text-gray-800">SIMPEG</div>
            </div>

            {/* Desktop Navigation - Centered or Right Aligned */}
            <div className="hidden md:flex items-center space-x-2 ml-8 flex-1 justify-end mr-8">
              <NavItem page="dashboard" icon={LayoutDashboard} label="Dashboard" />
              
              {user.role === Role.ADMIN && (
                <>
                  <NavItem page="employee-list" icon={Users} label="Data Pegawai" />
                  <NavItem page="duk" icon={ClipboardList} label="Data DUK" />
                  <NavItem page="settings" icon={Settings} label="Pengaturan" />
                </>
              )}
              
              {user.role === Role.PEGAWAI && (
                <NavItem page="my-profile" icon={UserCircle} label="Data Pribadi" />
              )}
            </div>

            {/* Right Side: Profile & Logout */}
            <div className="hidden md:flex items-center gap-4 pl-4 border-l border-gray-100 flex-shrink-0">
               <div className="flex items-center gap-3">
                 <div className="text-right">
                   <p className="text-sm font-medium text-gray-700 leading-none">{user.name}</p>
                   <p className="text-xs text-gray-400 capitalize mt-1">{user.role.toLowerCase()}</p>
                 </div>
                 <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs border border-blue-200">
                   {user.name.charAt(0)}
                 </div>
               </div>
               <button 
                onClick={onLogout}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                title="Keluar"
               >
                 <LogOut size={20} />
               </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center md:hidden">
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-100"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-gray-800/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="absolute right-0 top-0 bottom-0 w-64 bg-white p-4 shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-8 border-b pb-4">
              <span className="font-bold text-lg text-gray-800">Menu</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-500"><X size={24} /></button>
            </div>
            <nav className="space-y-2 flex flex-col">
              <NavItem page="dashboard" icon={LayoutDashboard} label="Dashboard" />
              {user.role === Role.ADMIN && (
                <>
                  <NavItem page="employee-list" icon={Users} label="Data Pegawai" />
                  <NavItem page="duk" icon={ClipboardList} label="Data DUK" />
                  <NavItem page="settings" icon={Settings} label="Pengaturan" />
                </>
              )}
              {user.role === Role.PEGAWAI && (
                <NavItem page="my-profile" icon={UserCircle} label="Data Pribadi" />
              )}
              
              <div className="pt-4 mt-4 border-t border-gray-100">
                <div className="flex items-center gap-3 mb-4 px-4">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                    {user.name.charAt(0)}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-medium text-gray-700 truncate">{user.name}</p>
                    <p className="text-xs text-gray-400 capitalize">{user.role.toLowerCase()}</p>
                  </div>
                </div>
                <button 
                  onClick={onLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut size={20} />
                  <span>Keluar</span>
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};