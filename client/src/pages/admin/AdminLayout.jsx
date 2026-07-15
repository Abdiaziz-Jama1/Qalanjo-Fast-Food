import { Outlet, Link, useLocation } from 'react-router-dom';
import { FiGrid, FiCoffee, FiTag, FiShoppingBag, FiUsers, FiStar, FiSettings, FiLogOut } from 'react-icons/fi';
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

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-secondary text-white flex flex-col">
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
      </aside>
      <main className="flex-1 overflow-y-auto p-6"><Outlet /></main>
    </div>
  );
}
