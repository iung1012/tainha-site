import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Fish, Loader2, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/api';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', cpf: '', password: '', confirm: '' });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  function set(k: string) { return (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value })); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password !== form.confirm) return toast.error('As senhas não coincidem');
    if (form.password.length < 6) return toast.error('Senha deve ter ao menos 6 caracteres');
    setLoading(true);
    try {
      await api.post('/auth/register', { name: form.name, email: form.email, cpf: form.cpf || undefined, password: form.password });
      await login(form.email, form.password);
      toast.success('Conta criada com sucesso!');
      navigate('/minha-conta');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-ocean-gradient flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <Fish className="w-8 h-8 text-white" />
            <span className="font-display font-bold text-2xl text-white">Tainha do Mar</span>
          </Link>
        </div>

        <div className="card p-8">
          <h1 className="font-display font-bold text-2xl text-slate-800 mb-1">Criar conta</h1>
          <p className="text-slate-500 text-sm mb-6">Gerencie seus ingressos em um só lugar</p>

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
                <input className="input-field pr-10" type={show ? 'text' : 'password'} placeholder="Mínimo 6 caracteres" value={form.password} onChange={set('password')} required />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="label">Confirmar senha *</label>
              <input className="input-field" type={show ? 'text' : 'password'} placeholder="Repita a senha" value={form.confirm} onChange={set('confirm')} required />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Criando conta...' : 'Criar conta'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Já tem conta?{' '}
            <Link to="/login" className="text-sea font-semibold hover:text-sea-dark">Entrar</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
