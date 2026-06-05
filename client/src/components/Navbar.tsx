import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar({ overlay = false }: { overlay?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!overlay) return;
    const h = () => setScrolled(window.scrollY > 80);
    h();
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, [overlay]);

  const solid = !overlay || scrolled || open;

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${solid ? 'bg-parch/95 backdrop-blur border-b border-ink/8' : ''}`}>
      <div className="max-w-7xl mx-auto px-6 sm:px-10 h-14 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className={`font-display font-bold text-base tracking-tight transition-colors ${solid ? 'text-ink' : 'text-parch'}`}>
          Tainha do Mar
        </Link>

        {/* Desktop */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="/#cardapio" className={`text-xs tracking-widest uppercase font-medium transition-colors ${solid ? 'text-ink/45 hover:text-ink' : 'text-parch/50 hover:text-parch'}`}>
            Cardápio
          </a>
          <a href="/#como-funciona" className={`text-xs tracking-widest uppercase font-medium transition-colors ${solid ? 'text-ink/45 hover:text-ink' : 'text-parch/50 hover:text-parch'}`}>
            Como funciona
          </a>
          {user && isAdmin && (
            <Link to="/admin" className={`text-xs tracking-widest uppercase font-medium transition-colors ${solid ? 'text-ink/45 hover:text-ink' : 'text-parch/50 hover:text-parch'}`}>
              Admin
            </Link>
          )}
          {user && (
            <Link to="/minha-conta" className={`text-xs tracking-widest uppercase font-medium transition-colors ${solid ? 'text-ink/45 hover:text-ink' : 'text-parch/50 hover:text-parch'}`}>
              Minha conta
            </Link>
          )}
          {user ? (
            <button onClick={() => { logout(); navigate('/'); }}
              className={`text-xs tracking-widest uppercase font-medium transition-colors ${solid ? 'text-ink/30 hover:text-ember' : 'text-parch/30 hover:text-parch'}`}>
              Sair
            </button>
          ) : (
            <Link to="/login" className={`text-xs tracking-widest uppercase font-medium transition-colors ${solid ? 'text-ink/45 hover:text-ink' : 'text-parch/50 hover:text-parch'}`}>
              Entrar
            </Link>
          )}
          <Link to="/checkout"
            className={`flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase px-5 py-2.5 transition-colors ${
              solid
                ? 'bg-ink text-parch hover:bg-mist'
                : 'bg-parch text-ink hover:bg-parch/90'
            }`}>
            Comprar <ArrowUpRight className="w-3 h-3" />
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)} className={`md:hidden transition-colors ${solid ? 'text-ink' : 'text-parch'}`}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden bg-ink border-t border-white/8 px-6 py-6 space-y-4">
          {[['/#cardapio', 'Cardápio'], ['/#como-funciona', 'Como funciona']].map(([href, label]) => (
            <a key={href} href={href} onClick={() => setOpen(false)}
              className="block text-parch/50 hover:text-parch text-sm tracking-widest uppercase font-medium transition-colors">
              {label}
            </a>
          ))}
          {user && isAdmin && <Link to="/admin" onClick={() => setOpen(false)} className="block text-parch/50 hover:text-parch text-sm tracking-widest uppercase">Admin</Link>}
          {user && <Link to="/minha-conta" onClick={() => setOpen(false)} className="block text-parch/50 hover:text-parch text-sm tracking-widest uppercase">Minha conta</Link>}
          {user
            ? <button onClick={() => { logout(); navigate('/'); setOpen(false); }} className="block text-ember/70 text-sm tracking-widest uppercase">Sair</button>
            : <Link to="/login" onClick={() => setOpen(false)} className="block text-parch/50 hover:text-parch text-sm tracking-widest uppercase">Entrar</Link>
          }
          <Link to="/checkout" onClick={() => setOpen(false)}
            className="block bg-gold text-ink text-center font-bold text-xs tracking-widest uppercase py-3.5 mt-2">
            Comprar Ingresso
          </Link>
        </div>
      )}
    </header>
  );
}
