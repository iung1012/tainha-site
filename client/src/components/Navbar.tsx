import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar({ overlay = false }: { overlay?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!overlay) return;
    const h = () => setScrolled(window.scrollY > 60);
    h();
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, [overlay]);

  const solid = !overlay || scrolled || open;

  const linkCls = solid
    ? 'text-ink/50 hover:text-ink'
    : 'text-white/60 hover:text-white';

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${solid ? 'bg-paper border-b border-border' : ''}`}>
      <div className="max-w-7xl mx-auto px-6 sm:px-10 h-16 flex items-center justify-between">

        <Link to="/"
          className={`font-display text-xl font-light tracking-wide transition-colors ${solid ? 'text-ink' : 'text-white'}`}>
          Festa da Tainha
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {[['/#cardapio','Cardápio'],['/#como-funciona','Como funciona']].map(([h,l]) => (
            <a key={h} href={h} className={`text-xs font-medium tracking-widest uppercase transition-colors ${linkCls}`}>{l}</a>
          ))}
          {user && isAdmin && <Link to="/admin" className={`text-xs font-medium tracking-widest uppercase transition-colors ${linkCls}`}>Admin</Link>}
          {user
            ? <Link to="/minha-conta" className={`text-xs font-medium tracking-widest uppercase transition-colors ${linkCls}`}>Minha conta</Link>
            : <Link to="/login"       className={`text-xs font-medium tracking-widest uppercase transition-colors ${linkCls}`}>Entrar</Link>
          }
          {user && (
            <button onClick={() => { logout(); navigate('/'); }}
              className={`text-xs font-medium tracking-widest uppercase transition-colors ${solid ? 'text-ink/30 hover:text-red-500' : 'text-white/30 hover:text-white'}`}>
              Sair
            </button>
          )}
          <Link to="/checkout"
            className={`text-xs font-medium tracking-widest uppercase px-6 py-2.5 transition-all ${solid ? 'bg-ink text-paper hover:bg-navy' : 'bg-white text-ink hover:bg-white/90'}`}>
            Comprar ingresso
          </Link>
        </nav>

        <button onClick={() => setOpen(!open)} className={`md:hidden ${solid ? 'text-ink' : 'text-white'}`}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-paper border-t border-border px-6 py-5 space-y-4">
          {[['/#cardapio','Cardápio'],['/#como-funciona','Como funciona']].map(([h,l]) => (
            <a key={h} href={h} onClick={() => setOpen(false)}
              className="block text-xs font-medium tracking-widest uppercase text-ink/50 hover:text-ink py-2 border-b border-border">
              {l}
            </a>
          ))}
          {user && isAdmin && <Link to="/admin" onClick={() => setOpen(false)} className="block text-xs font-medium tracking-widest uppercase text-ink/50 py-2 border-b border-border">Admin</Link>}
          {user
            ? <Link to="/minha-conta" onClick={() => setOpen(false)} className="block text-xs font-medium tracking-widest uppercase text-ink/50 py-2 border-b border-border">Minha conta</Link>
            : <Link to="/login"       onClick={() => setOpen(false)} className="block text-xs font-medium tracking-widest uppercase text-ink/50 py-2 border-b border-border">Entrar</Link>
          }
          {user && <button onClick={() => { logout(); setOpen(false); }} className="block text-xs font-medium tracking-widest uppercase text-red-400 py-2">Sair</button>}
          <Link to="/checkout" onClick={() => setOpen(false)} className="block bg-ink text-paper text-center text-xs font-medium tracking-widest uppercase py-3.5 mt-2">
            Comprar ingresso
          </Link>
        </div>
      )}
    </header>
  );
}
