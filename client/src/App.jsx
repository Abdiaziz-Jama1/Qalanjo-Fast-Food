import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Loader from './components/common/Loader';
import NotFound from './pages/common/NotFound';

const Home = lazy(() => import('./pages/customer/Home'));
const Menu = lazy(() => import('./pages/customer/Menu'));
const FoodDetail = lazy(() => import('./pages/customer/FoodDetail'));
const Cart = lazy(() => import('./pages/customer/Cart'));
const Checkout = lazy(() => import('./pages/customer/Checkout'));
const Orders = lazy(() => import('./pages/customer/Orders'));
const OrderDetail = lazy(() => import('./pages/customer/OrderDetail'));
const Contact = lazy(() => import('./pages/customer/Contact'));
const Profile = lazy(() => import('./pages/customer/Profile'));
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));

const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminFoods = lazy(() => import('./pages/admin/AdminFoods'));
const AdminCategories = lazy(() => import('./pages/admin/AdminCategories'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const AdminReviews = lazy(() => import('./pages/admin/AdminReviews'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" />;
  return children;
}

function GuestRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  if (user) return <Navigate to="/" />;
  return children;
}

function PageLoader() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <Loader />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Toaster position="top-right" toastOptions={{ duration: 3000, style: { borderRadius: '10px', background: '#1c1917', color: '#fff' } }} />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/admin" element={<ProtectedRoute adminOnly><AdminLayout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="foods" element={<AdminFoods />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="reviews" element={<AdminReviews />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          <Route path="/" element={<div className="flex flex-col min-h-screen"><Navbar /><main className="flex-1"><Home /></main><Footer /></div>} />
          <Route path="/menu" element={<div className="flex flex-col min-h-screen"><Navbar /><main className="flex-1"><Menu /></main><Footer /></div>} />
          <Route path="/menu/:slug" element={<div className="flex flex-col min-h-screen"><Navbar /><main className="flex-1"><FoodDetail /></main><Footer /></div>} />
          <Route path="/cart" element={<div className="flex flex-col min-h-screen"><Navbar /><main className="flex-1"><Cart /></main><Footer /></div>} />
          <Route path="/contact" element={<div className="flex flex-col min-h-screen"><Navbar /><main className="flex-1"><Contact /></main><Footer /></div>} />

          <Route path="/checkout" element={<ProtectedRoute><div className="flex flex-col min-h-screen"><Navbar /><main className="flex-1"><Checkout /></main><Footer /></div></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><div className="flex flex-col min-h-screen"><Navbar /><main className="flex-1"><Orders /></main><Footer /></div></ProtectedRoute>} />
          <Route path="/orders/:id" element={<ProtectedRoute><div className="flex flex-col min-h-screen"><Navbar /><main className="flex-1"><OrderDetail /></main><Footer /></div></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><div className="flex flex-col min-h-screen"><Navbar /><main className="flex-1"><Profile /></main><Footer /></div></ProtectedRoute>} />

          <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />

          <Route path="*" element={<div className="flex flex-col min-h-screen"><Navbar /><main className="flex-1"><NotFound /></main><Footer /></div>} />
        </Routes>
      </Suspense>
    </Router>
  );
}
