import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowUpRight, Fish } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar({ overlay = false }: { overlay?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!overlay) return;
    const h = () => setScrolled(window.scrollY > 72);
    h();
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, [overlay]);

  const solid = !overlay || scrolled || open;

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        solid
          ? 'bg-white/95 backdrop-blur-sm border-b border-ink/10 shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 h-16 flex items-center justify-between gap-8">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
          <Fish className={`w-5 h-5 transition-colors ${solid ? 'text-sea' : 'text-white'}`} />
          <span className={`font-display font-bold text-lg tracking-tight transition-colors ${solid ? 'text-ink' : 'text-white'}`}>
            Tainha do Mar
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7">
          {[['/#cardapio','Cardápio'], ['/#como-funciona','Como funciona']].map(([href, label]) => (
            <a key={href} href={href}
              className={`text-sm font-medium transition-colors ${solid ? 'text-ink/50 hover:text-ink' : 'text-white/70 hover:text-white'}`}>
              {label}
            </a>
          ))}
          {user && isAdmin && (
            <Link to="/admin" className={`text-sm font-medium transition-colors ${solid ? 'text-ink/50 hover:text-ink' : 'text-white/70 hover:text-white'}`}>
              Admin
            </Link>
          )}
          {user
            ? <Link to="/minha-conta" className={`text-sm font-medium transition-colors ${solid ? 'text-ink/50 hover:text-ink' : 'text-white/70 hover:text-white'}`}>Minha conta</Link>
            : <Link to="/login"       className={`text-sm font-medium transition-colors ${solid ? 'text-ink/50 hover:text-ink' : 'text-white/70 hover:text-white'}`}>Entrar</Link>
          }
          {user && (
            <button onClick={() => { logout(); navigate('/'); }}
              className={`text-sm font-medium transition-colors ${solid ? 'text-ink/30 hover:text-ember' : 'text-white/40 hover:text-white'}`}>
              Sair
            </button>
          )}
          <Link to="/checkout"
            className={`flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase px-5 py-2.5 transition-all ${
              solid
                ? 'bg-sea text-white hover:bg-sea-dark'
                : 'bg-white text-sea-dark hover:bg-white/90'
            }`}>
            Comprar <ArrowUpRight className="w-3 h-3" />
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)} className={`md:hidden p-1 transition-colors ${solid ? 'text-ink' : 'text-white'}`}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden bg-white border-t border-ink/8 px-6 py-5 space-y-1">
          {[['/#cardapio','Cardápio'], ['/#como-funciona','Como funciona']].map(([href, label]) => (
            <a key={href} href={href} onClick={() => setOpen(false)}
              className="block py-3 text-sm font-medium text-ink/60 hover:text-ink border-b border-ink/6 transition-colors">
              {label}
            </a>
          ))}
          {user && isAdmin && <Link to="/admin" onClick={() => setOpen(false)} className="block py-3 text-sm font-medium text-ink/60 hover:text-ink border-b border-ink/6">Admin</Link>}
          {user
            ? <Link to="/minha-conta" onClick={() => setOpen(false)} className="block py-3 text-sm font-medium text-ink/60 hover:text-ink border-b border-ink/6">Minha conta</Link>
            : <Link to="/login"       onClick={() => setOpen(false)} className="block py-3 text-sm font-medium text-ink/60 hover:text-ink border-b border-ink/6">Entrar</Link>
          }
          {user && <button onClick={() => { logout(); navigate('/'); setOpen(false); }} className="block py-3 text-sm font-medium text-ember">Sair</button>}
          <Link to="/checkout" onClick={() => setOpen(false)}
            className="btn-primary w-full justify-center mt-3">
            Comprar Ingresso <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </header>
  );
}
