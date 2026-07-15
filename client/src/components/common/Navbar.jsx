import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import {
  FiMenu,
  FiX,
  FiShoppingCart,
  FiUser,
  FiLogOut,
  FiChevronDown,
  FiHome,
  FiGrid,
  FiPhone,
  FiPackage,
  FiSettings,
  FiUserPlus,
} from 'react-icons/fi';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const profileRef = useRef(null);

  const navLinks = [
    { to: '/', label: 'Home', icon: FiHome },
    { to: '/menu', label: 'Menu', icon: FiGrid },
    { to: '/contact', label: 'Contact', icon: FiPhone },
  ];

  const profileLinks = [
    { to: '/profile', label: 'My Profile', icon: FiUser },
    { to: '/orders', label: 'My Orders', icon: FiPackage },
  ];

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setProfileOpen(false);
    setMobileOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="bg-white/80 backdrop-blur-lg border-b border-gray-200/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-1.5 group">
                <span className="text-2xl font-extrabold text-primary tracking-tight group-hover:scale-105 transition-transform duration-200">
                  Qalanjo
                </span>
                <span className="text-2xl font-extrabold text-secondary tracking-tight">
                  Fast Food
                </span>
              </Link>
            </div>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(link.to)
                      ? 'text-primary bg-primary/10'
                      : 'text-gray-600 hover:text-primary hover:bg-gray-100/60'
                  }`}
                >
                  {link.label}
                  {isActive(link.to) && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-primary rounded-full" />
                  )}
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Cart */}
              <Link
                to="/cart"
                className="relative p-2.5 rounded-xl text-gray-600 hover:text-primary hover:bg-gray-100/60 transition-all duration-200"
              >
                <FiShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-white animate-in fade-in zoom-in duration-200">
                    {itemCount}
                  </span>
                )}
              </Link>

              {/* Profile / Auth */}
              {user ? (
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className={`flex items-center gap-2 p-1.5 rounded-xl transition-all duration-200 ${
                      profileOpen
                        ? 'bg-primary/10 text-primary'
                        : 'text-gray-600 hover:text-primary hover:bg-gray-100/60'
                    }`}
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <FiChevronDown
                      className={`w-4 h-4 hidden sm:block transition-transform duration-200 ${
                        profileOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* Profile Dropdown */}
                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate mt-0.5">
                          {user.email}
                        </p>
                      </div>
                      <div className="py-1.5">
                        {profileLinks.map((link) => (
                          <Link
                            key={link.to}
                            to={link.to}
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors duration-150"
                          >
                            <link.icon className="w-4 h-4 text-gray-400" />
                            {link.label}
                          </Link>
                        ))}
                        {user.role === 'admin' && (
                          <Link
                            to="/admin"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors duration-150"
                          >
                            <FiSettings className="w-4 h-4 text-gray-400" />
                            Admin Dashboard
                          </Link>
                        )}
                      </div>
                      <div className="border-t border-gray-100 pt-1.5">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                        >
                          <FiLogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="hidden sm:inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-primary-dark transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <FiUser className="w-4 h-4" />
                  Sign In
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2.5 rounded-xl text-gray-600 hover:text-primary hover:bg-gray-100/60 transition-all duration-200"
                aria-label="Toggle menu"
              >
                {mobileOpen ? (
                  <FiX className="w-5 h-5" />
                ) : (
                  <FiMenu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Backdrop */}
      <div
        onClick={() => setMobileOpen(false)}
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-50 md:hidden transition-opacity duration-300 ${
          mobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Mobile Slide-in Menu */}
      <div
        className={`fixed inset-y-0 right-0 w-72 sm:w-80 bg-white shadow-2xl z-50 md:hidden transform transition-transform duration-300 ease-out ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between px-5 h-16 border-b border-gray-100">
            <Link
              to="/"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-1.5"
            >
              <span className="text-xl font-extrabold text-primary">Qalanjo</span>
              <span className="text-xl font-extrabold text-secondary">Fast Food</span>
            </Link>
            <button
              onClick={() => setMobileOpen(false)}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200"
              aria-label="Close menu"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile User Section */}
          {user && (
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold shadow-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Mobile Nav Links */}
          <div className="flex-1 overflow-y-auto py-3 px-3">
            <p className="px-2 mb-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              Navigation
            </p>
            <div className="space-y-0.5">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive(link.to)
                      ? 'bg-primary/10 text-primary'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-primary'
                  }`}
                >
                  <link.icon className="w-5 h-5" />
                  {link.label}
                  {isActive(link.to) && (
                    <span className="ml-auto w-1.5 h-1.5 bg-primary rounded-full" />
                  )}
                </Link>
              ))}
            </div>

            {user && (
              <>
                <div className="my-3 mx-2 border-t border-gray-100" />
                <p className="px-2 mb-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  Account
                </p>
                <div className="space-y-0.5">
                  {profileLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-primary transition-all duration-200"
                    >
                      <link.icon className="w-5 h-5" />
                      {link.label}
                    </Link>
                  ))}
                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-primary transition-all duration-200"
                    >
                      <FiSettings className="w-5 h-5" />
                      Admin Dashboard
                    </Link>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Footer */}
          <div className="p-4 border-t border-gray-100">
            {user ? (
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-all duration-200"
              >
                <FiLogOut className="w-4 h-4" />
                Logout
              </button>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white bg-primary hover:bg-primary-dark transition-all duration-200 shadow-sm"
                >
                  <FiUser className="w-4 h-4" />
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-primary bg-primary/10 hover:bg-primary/20 transition-all duration-200"
                >
                  <FiUserPlus className="w-4 h-4" />
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
