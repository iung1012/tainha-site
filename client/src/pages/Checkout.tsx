import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Minus, Plus, Fish, ShieldCheck, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api, { formatBRL } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

interface Product { id: number; name: string; description: string; price: number; image_url: string; }

export default function Checkout() {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', cpf: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/products').then((r) => {
      setProducts(r.data);
      const pid = searchParams.get('product');
      if (pid) setSelectedId(Number(pid));
      else if (r.data.length) setSelectedId(r.data[0].id);
    });
  }, [searchParams]);

  useEffect(() => {
    if (user) setForm((f) => ({ ...f, name: user.name, email: user.email }));
  }, [user]);

  const selected = products.find((p) => p.id === selectedId);
  const total = selected ? selected.price * quantity : 0;

  function formatCPF(v: string) {
    return v.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4').slice(0, 14);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) return toast.error('Selecione um produto');
    if (!form.name || !form.email) return toast.error('Preencha nome e email');

    setLoading(true);
    try {
      const { data } = await api.post('/orders', {
        customer_name: form.name,
        customer_email: form.email,
        customer_cpf: form.cpf || undefined,
        user_id: user?.id,
        items: [{ product_id: selected.id, quantity }],
      });
      navigate(`/pagamento/${data.order_id}`, { state: data });
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Erro ao criar pedido');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12 bg-ocean-50">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="font-display font-bold text-3xl text-sea-dark mb-8 text-center">Finalizar Compra</h1>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* LEFT: form */}
            <div className="lg:col-span-3 space-y-6">
              {/* Select product */}
              <div className="card p-6">
                <h2 className="font-semibold text-slate-700 mb-4 flex items-center gap-2"><Fish className="w-5 h-5 text-sea" /> Escolha o prato</h2>
                <div className="space-y-3">
                  {products.map((p) => (
                    <label key={p.id} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedId === p.id ? 'border-sea bg-ocean-50' : 'border-ocean-100 hover:border-ocean-300'}`}>
                      <input type="radio" name="product" value={p.id} checked={selectedId === p.id} onChange={() => setSelectedId(p.id)} className="accent-sea" />
                      {p.image_url && <img src={p.image_url} alt={p.name} className="w-16 h-12 object-cover rounded-lg flex-shrink-0" />}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-800 text-sm">{p.name}</p>
                        <p className="text-slate-500 text-xs mt-0.5 line-clamp-1">{p.description}</p>
                      </div>
                      <span className="font-bold text-sea flex-shrink-0">{formatBRL(p.price)}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="card p-6">
                <h2 className="font-semibold text-slate-700 mb-4">Quantidade</h2>
                <div className="flex items-center gap-4">
                  <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-10 h-10 rounded-xl bg-ocean-100 text-sea flex items-center justify-center hover:bg-ocean-200 transition-colors">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-bold text-2xl text-slate-800 w-8 text-center">{quantity}</span>
                  <button type="button" onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                    className="w-10 h-10 rounded-xl bg-ocean-100 text-sea flex items-center justify-center hover:bg-ocean-200 transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Customer info */}
              <div className="card p-6">
                <h2 className="font-semibold text-slate-700 mb-4">Seus dados</h2>
                <div className="space-y-4">
                  <div>
                    <label className="label">Nome completo *</label>
                    <input className="input-field" placeholder="João Silva" value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
                  </div>
                  <div>
                    <label className="label">Email *</label>
                    <input className="input-field" type="email" placeholder="joao@email.com" value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} required />
                    <p className="text-xs text-slate-400 mt-1">Os ingressos serão enviados para este email</p>
                  </div>
                  <div>
                    <label className="label">CPF</label>
                    <input className="input-field" placeholder="000.000.000-00" value={form.cpf}
                      onChange={(e) => setForm((f) => ({ ...f, cpf: formatCPF(e.target.value) }))} maxLength={14} />
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: summary */}
            <div className="lg:col-span-2">
              <div className="card p-6 sticky top-24">
                <h2 className="font-semibold text-slate-700 mb-4">Resumo do pedido</h2>

                {selected && (
                  <div className="bg-ocean-50 rounded-xl p-4 mb-4">
                    <p className="font-semibold text-slate-800 text-sm">{selected.name}</p>
                    <div className="flex justify-between items-center mt-2 text-sm">
                      <span className="text-slate-500">{formatBRL(selected.price)} × {quantity}</span>
                      <span className="font-semibold text-slate-700">{formatBRL(selected.price * quantity)}</span>
                    </div>
                  </div>
                )}

                <div className="border-t border-ocean-100 pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-700">Total</span>
                    <span className="font-bold text-2xl text-sea">{formatBRL(total)}</span>
                  </div>
                </div>

                <div className="bg-ocean-50 rounded-xl p-3 mb-5 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-sea mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-slate-600">Pagamento 100% seguro via PIX. Seus dados são protegidos.</p>
                </div>

                <button type="submit" disabled={loading || !selected} className="btn-primary w-full flex items-center justify-center gap-2 text-base py-4">
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                  {loading ? 'Processando...' : 'Pagar com PIX'}
                </button>

                <p className="text-xs text-slate-400 text-center mt-3">O QR Code PIX será gerado na próxima tela</p>
              </div>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
