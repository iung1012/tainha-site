import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Minus, Plus, Loader2, ShieldCheck, ArrowRight } from 'lucide-react';
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
  const [form, setForm] = useState({ name: '', email: '', cpf: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/products').then((r) => {
      setProducts(r.data);
      const pid = searchParams.get('product');
      setSelectedId(pid ? Number(pid) : r.data[0]?.id ?? null);
    });
  }, [searchParams]);

  useEffect(() => {
    if (user) setForm((f) => ({ ...f, name: f.name || user.name, email: f.email || user.email }));
  }, [user]);

  const selected = products.find((p) => p.id === selectedId);
  const total = selected ? selected.price * quantity : 0;

  const formatCPF = (v: string) =>
    v.replace(/\D/g, '').slice(0, 11).replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) return toast.error('Selecione um produto');
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

      <main className="flex-1 bg-cream-light py-14">
        <div className="max-w-5xl mx-auto px-6">
          <div className="mb-10">
            <span className="section-label">Compra segura</span>
            <h1 className="font-display font-bold text-fluid-lg text-ink leading-tight">
              Finalizar<br /><span className="italic">pedido.</span>
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-5 gap-8">

            {/* Left */}
            <div className="lg:col-span-3 space-y-6">

              {/* Product selection */}
              <div className="bg-white border border-ink/8 p-6">
                <h2 className="text-xs font-semibold tracking-caps uppercase text-ink/40 mb-5">1. Escolha o prato</h2>
                <div className="space-y-3">
                  {products.map((p) => (
                    <label key={p.id}
                      className={`flex items-center gap-4 p-4 border cursor-pointer transition-all ${
                        selectedId === p.id ? 'border-gold bg-gold/5' : 'border-ink/10 hover:border-ink/25'
                      }`}>
                      <input type="radio" name="product" value={p.id} className="accent-gold flex-shrink-0"
                        checked={selectedId === p.id} onChange={() => setSelectedId(p.id)} />
                      {p.image_url && (
                        <img src={p.image_url} alt={p.name} className="w-14 h-10 object-cover flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-ink text-sm">{p.name}</p>
                        <p className="text-ink/40 text-xs mt-0.5 truncate">{p.description}</p>
                      </div>
                      <span className="font-display font-bold text-lg text-ink flex-shrink-0">{formatBRL(p.price)}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="bg-white border border-ink/8 p-6">
                <h2 className="text-xs font-semibold tracking-caps uppercase text-ink/40 mb-5">2. Quantidade</h2>
                <div className="flex items-center gap-5">
                  <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-10 h-10 border border-ink/15 flex items-center justify-center hover:border-ink/40 transition-colors">
                    <Minus className="w-4 h-4 text-ink/60" />
                  </button>
                  <span className="font-display font-bold text-3xl text-ink w-8 text-center">{quantity}</span>
                  <button type="button" onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                    className="w-10 h-10 border border-ink/15 flex items-center justify-center hover:border-ink/40 transition-colors">
                    <Plus className="w-4 h-4 text-ink/60" />
                  </button>
                  <span className="text-ink/35 text-sm ml-2">
                    {quantity > 1 ? `${quantity} ingressos` : '1 ingresso'}
                  </span>
                </div>
              </div>

              {/* Customer info */}
              <div className="bg-white border border-ink/8 p-6">
                <h2 className="text-xs font-semibold tracking-caps uppercase text-ink/40 mb-5">3. Seus dados</h2>
                <div className="space-y-4">
                  <div>
                    <label className="label">Nome completo *</label>
                    <input className="input-field" placeholder="João da Silva"
                      value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
                  </div>
                  <div>
                    <label className="label">Email *</label>
                    <input className="input-field" type="email" placeholder="joao@email.com"
                      value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} required />
                    <p className="text-ink/35 text-xs mt-1.5">Os ingressos serão enviados para este email</p>
                  </div>
                  <div>
                    <label className="label">CPF <span className="text-ink/25 normal-case tracking-normal font-normal">(opcional)</span></label>
                    <input className="input-field" placeholder="000.000.000-00"
                      value={form.cpf} maxLength={14}
                      onChange={(e) => setForm((f) => ({ ...f, cpf: formatCPF(e.target.value) }))} />
                  </div>
                </div>
              </div>
            </div>

            {/* Right — summary */}
            <div className="lg:col-span-2">
              <div className="bg-ink sticky top-24 p-8">
                <h2 className="text-xs font-semibold tracking-caps uppercase text-cream/30 mb-6">Resumo</h2>

                {selected ? (
                  <>
                    <div className="space-y-1 mb-6">
                      <p className="text-cream font-semibold">{selected.name}</p>
                      <p className="text-cream/35 text-sm">{formatBRL(selected.price)} × {quantity}</p>
                    </div>
                    <div className="border-t border-cream/10 pt-5 mb-6 flex items-baseline justify-between">
                      <span className="text-cream/50 text-sm">Total</span>
                      <span className="font-display font-bold text-3xl text-gold">{formatBRL(total)}</span>
                    </div>
                  </>
                ) : (
                  <p className="text-cream/30 text-sm mb-8">Selecione um produto</p>
                )}

                <div className="flex items-start gap-2.5 mb-6 p-3 bg-cream/5 border border-cream/10">
                  <ShieldCheck className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                  <p className="text-cream/40 text-xs leading-relaxed">
                    Pagamento 100% seguro via PIX. Seus dados são criptografados.
                  </p>
                </div>

                <button type="submit" disabled={loading || !selected}
                  className="btn-gold w-full justify-center py-4 text-sm disabled:opacity-40 disabled:cursor-not-allowed">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {loading ? 'Gerando PIX...' : <>Pagar com PIX <ArrowRight className="w-4 h-4" /></>}
                </button>

                <p className="text-cream/20 text-xs text-center mt-4">QR Code gerado na próxima tela</p>
              </div>
            </div>

          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
