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
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Credenciais inválidas');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">

      {/* Left panel — brand */}
      <div className="hidden lg:flex flex-col justify-between bg-ink px-16 py-14">
        <Link to="/" className="font-display font-bold text-2xl text-cream">Tainha do Mar</Link>
        <div>
          <p className="font-display font-bold italic text-gold leading-none"
            style={{ fontSize: 'clamp(3rem, 6vw, 6rem)' }}>
            "Tradição de<br />prato em prato."
          </p>
          <p className="text-cream/30 text-sm mt-6 max-w-xs leading-relaxed">
            Entre na sua conta para gerenciar seus ingressos e acompanhar seus pedidos.
          </p>
        </div>
        <p className="text-cream/20 text-xs tracking-caps uppercase">Santa Catarina · Brasil</p>
      </div>

      {/* Right panel — form */}
      <div className="flex items-center justify-center px-6 py-16 bg-cream-light">
        <div className="w-full max-w-sm">
          <Link to="/" className="lg:hidden font-display font-bold text-xl text-ink block mb-10">
            Tainha do Mar
          </Link>

          <h1 className="font-display font-bold text-3xl text-ink mb-1">Entrar</h1>
          <p className="text-ink/45 text-sm mb-8">Acesse sua conta</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Email</label>
              <input className="input-field" type="email" placeholder="voce@email.com"
                value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus />
            </div>
            <div>
              <label className="label">Senha</label>
              <div className="relative">
                <input className="input-field pr-11" type={show ? 'text' : 'password'}
                  placeholder="••••••••" value={password}
                  onChange={(e) => setPassword(e.target.value)} required />
                <button type="button" onClick={() => setShow(!show)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink/30 hover:text-ink transition-colors">
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="btn-gold w-full justify-center py-4 mt-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {loading ? 'Entrando...' : <>Entrar <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <p className="text-center text-sm text-ink/45 mt-8">
            Não tem conta?{' '}
            <Link to="/cadastro" className="text-ink font-semibold underline underline-offset-2 hover:text-gold transition-colors">
              Criar conta
            </Link>
          </p>
          <div className="divider my-6" />
          <p className="text-center">
            <Link to="/checkout" className="text-sm text-ink/40 hover:text-ink transition-colors">
              Comprar sem criar conta →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
