import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Fish, Loader2, Eye, EyeOff } from 'lucide-react';
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
      toast.error(err.response?.data?.error || 'Erro ao entrar');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-ocean-gradient flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <Fish className="w-8 h-8 text-white" />
            <span className="font-display font-bold text-2xl text-white">Tainha do Mar</span>
          </Link>
        </div>

        <div className="card p-8">
          <h1 className="font-display font-bold text-2xl text-slate-800 mb-1">Entrar</h1>
          <p className="text-slate-500 text-sm mb-6">Acesse sua conta para ver seus ingressos</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email</label>
              <input className="input-field" type="email" placeholder="voce@email.com"
                value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus />
            </div>
            <div>
              <label className="label">Senha</label>
              <div className="relative">
                <input className="input-field pr-10" type={show ? 'text' : 'password'} placeholder="••••••••"
                  value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="button" onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Não tem conta?{' '}
            <Link to="/cadastro" className="text-sea font-semibold hover:text-sea-dark">Cadastre-se</Link>
          </p>
        </div>

        <p className="text-center text-ocean-200 text-sm mt-6">
          <Link to="/checkout" className="hover:text-white transition-colors">Comprar sem criar conta →</Link>
        </p>
      </div>
    </div>
  );
}
