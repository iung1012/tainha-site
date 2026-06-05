import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Home from './pages/Home';
import Checkout from './pages/Checkout';
import PaymentStatus from './pages/PaymentStatus';
import Login from './pages/Login';
import Register from './pages/Register';
import ClientDashboard from './pages/client/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';
import AdminOrders from './pages/admin/Orders';
import AdminProducts from './pages/admin/Products';
import AdminValidate from './pages/admin/Validate';

function RequireAuth({ children, admin }: { children: React.ReactNode; admin?: boolean }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-sea border-t-transparent rounded-full animate-spin" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (admin && user.role !== 'admin') return <Navigate to="/minha-conta" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/pagamento/:orderId" element={<PaymentStatus />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Register />} />

      <Route path="/minha-conta" element={<RequireAuth><ClientDashboard /></RequireAuth>} />

      <Route path="/admin" element={<RequireAuth admin><AdminDashboard /></RequireAuth>} />
      <Route path="/admin/pedidos" element={<RequireAuth admin><AdminOrders /></RequireAuth>} />
      <Route path="/admin/produtos" element={<RequireAuth admin><AdminProducts /></RequireAuth>} />
      <Route path="/admin/validar" element={<RequireAuth admin><AdminValidate /></RequireAuth>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
