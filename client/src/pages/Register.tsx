import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/api';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', cpf: '', password: '', confirm: '' });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password !== form.confirm) return toast.error('As senhas não coincidem');
    if (form.password.length < 6) return toast.error('Senha deve ter ao menos 6 caracteres');
    setLoading(true);
    try {
      await api.post('/auth/register', { name: form.name, email: form.email, cpf: form.cpf || undefined, password: form.password });
      await login(form.email, form.password);
      toast.success('Conta criada!');
      navigate('/minha-conta');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">

      {/* Left */}
      <div className="hidden lg:flex flex-col justify-between bg-ink px-16 py-14">
        <Link to="/" className="font-display font-bold text-2xl text-cream">Tainha do Mar</Link>
        <div>
          <p className="section-label text-gold">Crie sua conta</p>
          <p className="font-display font-bold text-cream leading-tight"
            style={{ fontSize: 'clamp(2rem, 4vw, 4rem)' }}>
            Seus ingressos<br /><span className="italic text-gold">em um lugar só.</span>
          </p>
          <p className="text-cream/30 text-sm mt-6 max-w-xs leading-relaxed">
            Acompanhe seus pedidos, acesse seus QR Codes e não perca nenhuma temporada.
          </p>
        </div>
        <p className="text-cream/20 text-xs tracking-caps uppercase">Santa Catarina · Brasil</p>
      </div>

      {/* Right */}
      <div className="flex items-center justify-center px-6 py-16 bg-cream-light">
        <div className="w-full max-w-sm">
          <Link to="/" className="lg:hidden font-display font-bold text-xl text-ink block mb-10">
            Tainha do Mar
          </Link>

          <h1 className="font-display font-bold text-3xl text-ink mb-1">Criar conta</h1>
          <p className="text-ink/45 text-sm mb-8">Gerencie seus ingressos em um só lugar</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Nome completo *</label>
              <input className="input-field" placeholder="João Silva" value={form.name} onChange={set('name')} required />
            </div>
            <div>
              <label className="label">Email *</label>
              <input className="input-field" type="email" placeholder="joao@email.com" value={form.email} onChange={set('email')} required />
            </div>
            <div>
              <label className="label">CPF</label>
              <input className="input-field" placeholder="000.000.000-00" value={form.cpf} onChange={set('cpf')} maxLength={14} />
            </div>
            <div>
              <label className="label">Senha *</label>
              <div className="relative">
                <input className="input-field pr-11" type={show ? 'text' : 'password'}
                  placeholder="Mínimo 6 caracteres" value={form.password} onChange={set('password')} required />
                <button type="button" onClick={() => setShow(!show)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink/30 hover:text-ink transition-colors">
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="label">Confirmar senha *</label>
              <input className="input-field" type={show ? 'text' : 'password'}
                placeholder="Repita a senha" value={form.confirm} onChange={set('confirm')} required />
            </div>

            <button type="submit" disabled={loading}
              className="btn-gold w-full justify-center py-4 mt-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {loading ? 'Criando conta...' : <>Criar conta <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <p className="text-center text-sm text-ink/45 mt-8">
            Já tem conta?{' '}
            <Link to="/login" className="text-ink font-semibold underline underline-offset-2 hover:text-gold transition-colors">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
