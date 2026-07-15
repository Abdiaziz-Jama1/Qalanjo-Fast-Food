import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { FiGrid, FiCoffee, FiTag, FiShoppingBag, FiUsers, FiStar, FiSettings, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const sidebarLinks = [
  { to: '/admin', icon: <FiGrid />, label: 'Dashboard', exact: true },
  { to: '/admin/foods', icon: <FiCoffee />, label: 'Foods' },
  { to: '/admin/categories', icon: <FiTag />, label: 'Categories' },
  { to: '/admin/orders', icon: <FiShoppingBag />, label: 'Orders' },
  { to: '/admin/users', icon: <FiUsers />, label: 'Users' },
  { to: '/admin/reviews', icon: <FiStar />, label: 'Reviews' },
  { to: '/admin/settings', icon: <FiSettings />, label: 'Settings' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  const SidebarContent = () => (
    <>
      <div className="p-4 border-b border-gray-700">
        <Link to="/admin" className="text-xl font-bold"><span className="text-primary">Qalanjo</span> Fast Food</Link>
        <p className="text-xs text-gray-400 mt-1">Admin Dashboard</p>
      </div>
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {sidebarLinks.map(link => {
          const active = link.exact ? location.pathname === link.to : location.pathname.startsWith(link.to);
          return (
            <Link key={link.to} to={link.to} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${active ? 'bg-primary text-white' : 'text-gray-300 hover:bg-white/10'}`}>
              {link.icon} {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-gray-700">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-sm font-medium">{user?.name?.charAt(0)}</div>
          <div className="flex-1 min-w-0"><p className="text-sm font-medium truncate">{user?.name}</p><p className="text-xs text-gray-400 truncate">{user?.email}</p></div>
        </div>
        <div className="flex gap-2 mt-2">
          <Link to="/" className="flex-1 text-center text-xs text-gray-400 hover:text-white py-1">View Site</Link>
          <button onClick={logout} className="flex-1 text-center text-xs text-red-400 hover:text-red-300 py-1 flex items-center justify-center gap-1"><FiLogOut className="w-3 h-3" /> Logout</button>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 bg-secondary text-white flex-col shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar backdrop */}
      <div
        onClick={() => setSidebarOpen(false)}
        className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      />

      {/* Mobile sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-secondary text-white flex flex-col z-50 md:hidden transform transition-transform duration-300 ease-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-end p-2">
          <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
            <FiX className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 flex flex-col overflow-hidden -mt-10">
          <SidebarContent />
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3 bg-secondary text-white shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
            <FiMenu className="w-5 h-5" />
          </button>
          <Link to="/admin" className="text-lg font-bold"><span className="text-primary">Qalanjo</span> Fast Food</Link>
        </div>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6"><Outlet /></main>
      </div>
    </div>
  );
}
