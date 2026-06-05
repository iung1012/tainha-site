import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Fish, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar({ transparent = false }: { transparent?: boolean }) {
  const [open, setOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  const base = transparent
    ? 'fixed top-0 left-0 right-0 z-50 transition-all duration-300'
    : 'sticky top-0 z-50 bg-white border-b border-ocean-100 shadow-sm';

  const linkClass = transparent ? 'text-white/90 hover:text-white' : 'text-slate-600 hover:text-sea';

  return (
    <nav className={base}>
      <div className={`${transparent ? 'bg-transparent' : ''} max-w-6xl mx-auto px-4 sm:px-6`}>
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-display font-bold text-xl">
            <Fish className={`w-6 h-6 ${transparent ? 'text-white' : 'text-sea'}`} />
            <span className={transparent ? 'text-white' : 'text-sea-dark'}>Tainha do Mar</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className={`text-sm font-medium transition-colors ${linkClass}`}>Início</Link>
            <Link to="/#cardapio" className={`text-sm font-medium transition-colors ${linkClass}`}>Cardápio</Link>
            <Link to="/#como-funciona" className={`text-sm font-medium transition-colors ${linkClass}`}>Como funciona</Link>

            {user ? (
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <Link to="/admin" className={`text-sm font-medium transition-colors flex items-center gap-1 ${linkClass}`}>
                    <LayoutDashboard className="w-4 h-4" /> Admin
                  </Link>
                )}
                <Link to="/minha-conta" className={`text-sm font-medium transition-colors flex items-center gap-1 ${linkClass}`}>
                  <User className="w-4 h-4" /> {user.name.split(' ')[0]}
                </Link>
                <button onClick={handleLogout} className={`text-sm font-medium transition-colors flex items-center gap-1 ${linkClass}`}>
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className={`text-sm font-medium transition-colors ${linkClass}`}>Entrar</Link>
                <Link to="/checkout" className="bg-white text-sea-dark font-semibold text-sm px-4 py-2 rounded-xl hover:bg-ocean-50 transition-all shadow-sm">
                  Comprar Ingresso
                </Link>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setOpen(!open)} className={`md:hidden p-2 rounded-lg ${transparent ? 'text-white' : 'text-slate-600'}`}>
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden bg-white border-t border-ocean-100 py-4 px-2 space-y-1 rounded-b-2xl shadow-lg">
            <MLink to="/" onClick={() => setOpen(false)}>Início</MLink>
            <MLink to="/#cardapio" onClick={() => setOpen(false)}>Cardápio</MLink>
            <MLink to="/#como-funciona" onClick={() => setOpen(false)}>Como funciona</MLink>
            {user ? (
              <>
                {isAdmin && <MLink to="/admin" onClick={() => setOpen(false)}>Painel Admin</MLink>}
                <MLink to="/minha-conta" onClick={() => setOpen(false)}>Minha conta</MLink>
                <button onClick={() => { handleLogout(); setOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl">
                  Sair
                </button>
              </>
            ) : (
              <>
                <MLink to="/login" onClick={() => setOpen(false)}>Entrar</MLink>
                <MLink to="/cadastro" onClick={() => setOpen(false)}>Criar conta</MLink>
                <Link to="/checkout" onClick={() => setOpen(false)} className="block mx-2 mt-2 bg-ocean-gradient text-white text-center font-semibold py-3 rounded-xl">
                  Comprar Ingresso
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

function MLink({ to, onClick, children }: { to: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <Link to={to} onClick={onClick} className="block px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-ocean-50 hover:text-sea rounded-xl transition-colors">
      {children}
    </Link>
  );
}
