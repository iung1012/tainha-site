import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/minha-conta';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try { await login(email, password); navigate(from, { replace: true }); }
    catch (err: any) { toast.error(err.response?.data?.error || 'Credenciais inválidas'); }
    finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Painel esquerdo — imagem */}
      <div className="hidden lg:block relative overflow-hidden" style={{ backgroundColor: '#08284A' }}>
        <img src="https://images.unsplash.com/photo-1559847844-5315695dadae?w=900&q=85"
          alt="" className="absolute inset-0 w-full h-full object-cover opacity-40" />
        <div className="relative z-10 flex flex-col justify-between h-full px-14 py-14">
          <Link to="/" className="font-display font-light text-white" style={{ fontSize: '1.5rem' }}>
            Tainha do Mar
          </Link>
          <div>
            <p className="font-display font-light italic text-white leading-[0.9]"
              style={{ fontSize: 'clamp(2.5rem, 4vw, 4.5rem)', letterSpacing: '-0.02em', color: 'rgba(255,255,255,0.9)' }}>
              "Tradição<br />de prato<br />em prato."
            </p>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.875rem', marginTop: 24, lineHeight: 1.6 }}>
              Gerencie seus ingressos e acompanhe<br />seus pedidos em um só lugar.
            </p>
          </div>
          <p style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', fontFamily: 'DM Sans' }}>
            SC · Brasil
          </p>
        </div>
      </div>

      {/* Formulário */}
      <div className="flex items-center justify-center px-8 py-16" style={{ backgroundColor: '#F9F6F0' }}>
        <div className="w-full max-w-sm">
          <Link to="/" className="lg:hidden font-display font-light text-ink block mb-10" style={{ fontSize: '1.5rem' }}>
            Tainha do Mar
          </Link>
          <p className="label mb-2">Acesso</p>
          <h1 className="font-display font-light text-ink mb-8" style={{ fontSize: '2.5rem', letterSpacing: '-0.02em', lineHeight: 1 }}>
            Entrar
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Email</label>
              <input className="input-field" type="email" placeholder="voce@email.com"
                value={email} onChange={e => setEmail(e.target.value)} required autoFocus />
            </div>
            <div>
              <label className="label">Senha</label>
              <div className="relative">
                <input className="input-field pr-11" type={show ? 'text' : 'password'}
                  placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
                <button type="button" onClick={() => setShow(!show)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-ink transition-colors">
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-3 font-sans font-medium py-4 transition-all"
              style={{ backgroundColor: '#0B5FA5', color: '#fff', fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <p className="text-center mt-8" style={{ fontSize: '0.875rem', color: '#9CA3AF' }}>
            Não tem conta?{' '}
            <Link to="/cadastro" className="text-ink font-medium underline underline-offset-4 hover:text-blue transition-colors">
              Criar conta
            </Link>
          </p>
          <div className="my-6" style={{ borderTop: '1px solid #E5E0D8' }} />
          <p className="text-center">
            <Link to="/checkout" style={{ fontSize: '0.8125rem', color: '#9CA3AF' }} className="hover:text-ink transition-colors">
              Comprar sem criar conta →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
