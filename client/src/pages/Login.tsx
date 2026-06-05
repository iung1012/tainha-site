import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, ArrowUpRight, Loader2 } from 'lucide-react';
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
    <div className="min-h-screen grid lg:grid-cols-[1fr_1fr]">

      {/* Brand panel */}
      <div className="hidden lg:flex flex-col justify-between bg-ink px-16 py-14">
        <Link to="/" className="font-display font-bold text-xl text-parch">Tainha do Mar</Link>
        <div>
          <p className="text-gold text-[10px] tracking-[0.25em] uppercase mb-8">Acesse sua conta</p>
          <p className="font-display font-bold italic text-parch leading-[0.88] tracking-[-0.03em]"
            style={{ fontSize: 'clamp(2.5rem, 5vw, 5.5rem)' }}>
            "Tradição<br />de prato<br />em prato."
          </p>
          <p className="text-white/25 text-sm mt-8 max-w-xs leading-relaxed">
            Gerencie seus ingressos, acompanhe pedidos e esteja pronto para a temporada.
          </p>
        </div>
        <p className="text-white/15 text-[10px] tracking-[0.2em] uppercase">SC · Brasil</p>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center px-8 py-16 bg-parch">
        <div className="w-full max-w-sm">
          <Link to="/" className="lg:hidden font-display font-bold text-xl text-ink block mb-10">Tainha do Mar</Link>

          <h1 className="font-display font-bold text-3xl text-ink mb-1">Entrar</h1>
          <p className="text-ink/35 text-sm mb-8">Acesse sua conta para ver seus ingressos</p>

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
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink/25 hover:text-ink transition-colors">
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-dark w-full justify-center py-4">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowUpRight className="w-4 h-4" />}
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <p className="text-center text-sm text-ink/35 mt-8">
            Não tem conta?{' '}
            <Link to="/cadastro" className="text-ink font-semibold underline underline-offset-4 decoration-ink/20 hover:decoration-gold hover:text-gold transition-colors">
              Criar conta
            </Link>
          </p>
          <div className="border-t border-ink/8 my-6" />
          <p className="text-center">
            <Link to="/checkout" className="text-sm text-ink/25 hover:text-ink transition-colors">
              Comprar sem criar conta →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
