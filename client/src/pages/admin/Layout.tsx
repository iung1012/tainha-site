import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Package, QrCode, LogOut, Menu, X, ExternalLink } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const nav = [
  { to: '/admin',          label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/pedidos',  label: 'Pedidos',   icon: ShoppingBag },
  { to: '/admin/produtos', label: 'Produtos',  icon: Package },
  { to: '/admin/validar',  label: 'Validar',   icon: QrCode },
];

export default function AdminLayout({ children, title }: { children: ReactNode; title: string }) {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-cream-light flex">

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-56 bg-ink flex flex-col transform transition-transform duration-200 md:relative md:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>

        {/* Brand */}
        <div className="px-6 pt-7 pb-5 border-b border-cream/8">
          <p className="font-display font-bold text-cream text-base leading-tight">Tainha do Mar</p>
          <p className="text-cream/25 text-xs mt-0.5 tracking-caps uppercase">Painel Admin</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-0.5">
          {nav.map(({ to, label, icon: Icon }) => {
            const active = pathname === to;
            return (
              <Link key={to} to={to}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-gold text-ink'
                    : 'text-cream/50 hover:text-cream hover:bg-cream/5'
                }`}>
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-5 pb-6 space-y-3 border-t border-cream/8 pt-4">
          <Link to="/" target="_blank"
            className="flex items-center gap-2 text-xs text-cream/30 hover:text-cream/60 transition-colors">
            <ExternalLink className="w-3.5 h-3.5" /> Ver site
          </Link>
          <div>
            <p className="text-cream/40 text-xs truncate">{user?.name}</p>
            <button onClick={logout} className="flex items-center gap-1.5 text-xs text-cream/25 hover:text-cream/60 mt-1 transition-colors">
              <LogOut className="w-3 h-3" /> Sair
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {open && <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setOpen(false)} />}

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="bg-cream-light border-b border-ink/8 px-6 h-13 flex items-center justify-between sticky top-0 z-30" style={{ height: 52 }}>
          <div className="flex items-center gap-3">
            <button className="md:hidden p-1 text-ink/50 hover:text-ink" onClick={() => setOpen(!open)}>
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <h1 className="font-semibold text-ink text-sm">{title}</h1>
          </div>
        </header>
        <main className="flex-1 p-6 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
