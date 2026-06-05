import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, LayoutDashboard, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar({ overlay = false }: { overlay?: boolean }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (!overlay) return;
    const handle = () => setScrolled(window.scrollY > 60);
    handle();
    window.addEventListener('scroll', handle, { passive: true });
    return () => window.removeEventListener('scroll', handle);
  }, [overlay]);

  const solid = !overlay || scrolled || open;

  function handleLogout() { logout(); navigate('/'); }

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        solid ? 'bg-cream-light border-b border-ink/10 shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-8">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 flex-shrink-0">
          <span className={`font-display font-bold text-lg leading-none transition-colors ${solid ? 'text-ink' : 'text-cream-light'}`}>
            Tainha do Mar
          </span>
          <span className={`hidden sm:block text-xs tracking-caps uppercase border-l pl-3 transition-colors ${solid ? 'text-ink/35 border-ink/20' : 'text-cream/40 border-cream/20'}`}>
            SC
          </span>
        </Link>

        {/* Desktop links */}
        <nav className="hidden md:flex items-center gap-7">
          {[['/#cardapio', 'Cardápio'], ['/#como-funciona', 'Como funciona']].map(([href, label]) => (
            <a key={href} href={href}
              className={`text-sm font-medium transition-colors ${solid ? 'text-ink/60 hover:text-ink' : 'text-cream/70 hover:text-cream'}`}>
              {label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              {isAdmin && (
                <Link to="/admin" className={`text-sm font-medium flex items-center gap-1.5 transition-colors ${solid ? 'text-ink/60 hover:text-ink' : 'text-cream/70 hover:text-cream'}`}>
                  <LayoutDashboard className="w-3.5 h-3.5" /> Admin
                </Link>
              )}
              <Link to="/minha-conta" className={`text-sm font-medium flex items-center gap-1.5 transition-colors ${solid ? 'text-ink/60 hover:text-ink' : 'text-cream/70 hover:text-cream'}`}>
                <User className="w-3.5 h-3.5" /> {user.name.split(' ')[0]}
              </Link>
              <button onClick={handleLogout} className={`text-sm transition-colors ${solid ? 'text-ink/40 hover:text-ink' : 'text-cream/40 hover:text-cream'}`}>
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={`text-sm font-medium transition-colors ${solid ? 'text-ink/60 hover:text-ink' : 'text-cream/70 hover:text-cream'}`}>
                Entrar
              </Link>
              <Link to="/checkout" className="btn-gold text-xs py-2.5 px-5">
                Comprar Ingresso
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)} className={`md:hidden p-1 transition-colors ${solid ? 'text-ink' : 'text-cream'}`}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden bg-cream-light border-t border-ink/10 px-6 py-5 space-y-1">
          <MLink to="/#cardapio" onClick={() => setOpen(false)}>Cardápio</MLink>
          <MLink to="/#como-funciona" onClick={() => setOpen(false)}>Como funciona</MLink>
          {user ? (
            <>
              {isAdmin && <MLink to="/admin" onClick={() => setOpen(false)}>Painel Admin</MLink>}
              <MLink to="/minha-conta" onClick={() => setOpen(false)}>Minha conta</MLink>
              <button onClick={() => { handleLogout(); setOpen(false); }} className="w-full text-left py-3 text-sm font-medium text-ember">Sair</button>
            </>
          ) : (
            <>
              <MLink to="/login" onClick={() => setOpen(false)}>Entrar</MLink>
              <MLink to="/cadastro" onClick={() => setOpen(false)}>Criar conta</MLink>
              <Link to="/checkout" onClick={() => setOpen(false)} className="btn-gold w-full justify-center mt-3">
                Comprar Ingresso
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}

function MLink({ to, onClick, children }: { to: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <Link to={to} onClick={onClick}
      className="block py-3 text-sm font-medium text-ink/70 hover:text-ink border-b border-ink/6 transition-colors">
      {children}
    </Link>
  );
}
