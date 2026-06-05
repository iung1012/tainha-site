import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Fish, LayoutDashboard, ShoppingBag, Package, QrCode, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const nav = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/pedidos', label: 'Pedidos', icon: ShoppingBag },
  { to: '/admin/produtos', label: 'Produtos', icon: Package },
  { to: '/admin/validar', label: 'Validar', icon: QrCode },
];

export default function AdminLayout({ children, title }: { children: ReactNode; title: string }) {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-ocean-50 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-60 bg-sea-dark flex flex-col transform transition-transform duration-200 md:relative md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-sea border-opacity-30">
          <Link to="/" className="flex items-center gap-2">
            <Fish className="w-5 h-5 text-sea-accent" />
            <span className="font-display font-bold text-white">Tainha do Mar</span>
          </Link>
          <span className="text-ocean-300 text-xs mt-1 block">Painel Admin</span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {nav.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${pathname === to ? 'bg-sea text-white' : 'text-ocean-200 hover:bg-white/10 hover:text-white'}`}>
              <Icon className="w-4 h-4" /> {label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-sea border-opacity-30">
          <p className="text-ocean-300 text-xs mb-2">{user?.name}</p>
          <button onClick={logout} className="flex items-center gap-2 text-ocean-200 hover:text-white text-sm transition-colors">
            <LogOut className="w-4 h-4" /> Sair
          </button>
        </div>
      </aside>

      {/* Overlay mobile */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="flex-1 min-w-0">
        <header className="bg-white border-b border-ocean-100 px-6 h-14 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button className="md:hidden p-1" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <h1 className="font-semibold text-slate-800">{title}</h1>
          </div>
          <Link to="/" className="text-sm text-slate-500 hover:text-sea transition-colors">Ver site →</Link>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
