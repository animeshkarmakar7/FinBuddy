import React , { useState} from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Home, 
  TrendingUp, 
  Wallet, 
  PieChart, 
  Settings, 
  User,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  LogOut
} from 'lucide-react';

const Sidebar = ({ activeSection, setActiveSection }) => {
  const [isOpen, setIsOpen] = useState(true);
  const { user, logout } = useAuth();

  const menuItems = [
    { name: 'Dashboard', icon: Home },
    { name: 'Investments', icon: TrendingUp },
    { name: 'Wallet', icon: Wallet },
    { name: 'Analytics', icon: PieChart },
    { name: 'Profile', icon: User },
    { name: 'Settings', icon: Settings },
  ];

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      await logout();
    }
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.name) return 'U';
    const names = user.name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return user.name.substring(0, 2).toUpperCase();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-gradient-to-br from-blue-50 via-violet-50 to-purple-50 
          border-r border-violet-200/50 shadow-2xl shadow-violet-500/10 z-50 transition-all duration-500 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isOpen ? 'w-72' : 'lg:w-20'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-violet-200/50">
          <div className={`flex items-center gap-3 transition-all duration-300 ${!isOpen && 'lg:opacity-0 lg:w-0'}`}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div className={`transition-all duration-300 ${!isOpen && 'lg:hidden'}`}>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                FinBuddy
              </h1>
              <p className="text-xs text-violet-600/70">Financial Dashboard</p>
            </div>
          </div>
          
          {/* Toggle Button - Desktop */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg bg-white/80 hover:bg-white 
              text-violet-600 hover:text-violet-700 shadow-md hover:shadow-lg transition-all duration-300 
              hover:scale-110 active:scale-95"
          >
            {isOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </button>

          {/* Close Button - Mobile */}
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg bg-white/80 hover:bg-white 
              text-violet-600 hover:text-violet-700 shadow-md transition-all duration-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeSection === item.name;
            
            return (
              <button
                key={item.name}
                onClick={() => setActiveSection(item.name)}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300
                  ${isActive 
                    ? 'bg-gradient-to-r from-blue-500 to-violet-600 text-white shadow-lg shadow-violet-500/30 scale-105' 
                    : 'text-violet-700 hover:bg-white/60 hover:shadow-md hover:scale-102'
                  }
                  ${!isOpen && 'lg:justify-center lg:px-2'}
                  group relative overflow-hidden`}
                style={{
                  animationDelay: `${index * 50}ms`,
                  animation: 'slideIn 0.5s ease-out forwards'
                }}
              >
                {/* Hover Effect Background */}
                <div className={`absolute inset-0 bg-gradient-to-r from-blue-400/20 to-violet-400/20 
                  opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl
                  ${isActive && 'opacity-0'}`} 
                />
                
                {/* Icon */}
                <Icon className={`w-5 h-5 transition-all duration-300 relative z-10
                  ${isActive ? 'text-white' : 'text-violet-600 group-hover:text-violet-700'}
                  ${!isOpen && 'lg:w-6 lg:h-6'}`} 
                />
                
                {/* Label */}
                <span className={`font-medium transition-all duration-300 relative z-10
                  ${!isOpen && 'lg:opacity-0 lg:w-0 lg:hidden'}
                  ${isActive ? 'text-white' : 'group-hover:text-violet-800'}`}
                >
                  {item.name}
                </span>

                {/* Active Indicator */}
                {isActive && (
                  <div className="absolute right-2 w-2 h-2 rounded-full bg-white animate-pulse" />
                )}

                {/* Tooltip for collapsed state */}
                {!isOpen && (
                  <div className="hidden lg:block absolute left-full ml-2 px-3 py-2 bg-gradient-to-r from-blue-600 to-violet-600 
                    text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 
                    transition-opacity duration-300 whitespace-nowrap pointer-events-none z-50">
                    {item.name}
                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-violet-600" />
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-violet-200/50 space-y-2">
          {/* User Profile */}
          <div className={`flex items-center gap-3 p-3 rounded-xl bg-white/60 backdrop-blur-sm 
            hover:bg-white/80 transition-all duration-300 cursor-pointer group
            ${!isOpen && 'lg:justify-center'}`}
            onClick={() => setActiveSection('Profile')}
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 
              flex items-center justify-center text-white font-semibold shadow-lg shadow-violet-500/30
              group-hover:scale-110 transition-transform duration-300">
              {getUserInitials()}
            </div>
            <div className={`transition-all duration-300 ${!isOpen && 'lg:opacity-0 lg:w-0 lg:hidden'}`}>
              <p className="text-sm font-semibold text-violet-800">{user?.name || 'User'}</p>
              <p className="text-xs text-violet-600/70 truncate max-w-[150px]">{user?.email || ''}</p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl 
              bg-rose-100 hover:bg-rose-200 text-rose-600 hover:text-rose-700
              transition-all duration-300 group
              ${!isOpen && 'lg:justify-center lg:px-2'}`}
          >
            <LogOut className={`w-5 h-5 transition-all duration-300
              ${!isOpen && 'lg:w-6 lg:h-6'}`} 
            />
            <span className={`font-medium transition-all duration-300
              ${!isOpen && 'lg:opacity-0 lg:w-0 lg:hidden'}`}
            >
              Logout
            </span>

            {/* Tooltip for collapsed state */}
            {!isOpen && (
              <div className="hidden lg:block absolute left-full ml-2 px-3 py-2 bg-rose-600 
                text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 
                transition-opacity duration-300 whitespace-nowrap pointer-events-none z-50">
                Logout
                <div className="absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-rose-600" />
              </div>
            )}
          </button>
        </div>

      </aside>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed top-4 left-4 z-30 lg:hidden flex items-center justify-center w-12 h-12 
          rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 text-white shadow-lg shadow-violet-500/30
          hover:shadow-xl hover:scale-110 active:scale-95 transition-all duration-300
          ${isOpen && 'opacity-0 pointer-events-none'}`}
      >
        <Menu className="w-6 h-6" />
      </button>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
};

export default Sidebar;
