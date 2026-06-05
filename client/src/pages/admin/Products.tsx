import { useEffect, useState } from 'react';
import { Plus, Edit2, ToggleLeft, ToggleRight, Loader2, Fish } from 'lucide-react';
import toast from 'react-hot-toast';
import api, { formatBRL } from '../../lib/api';
import AdminLayout from './Layout';

interface Product { id: number; name: string; description: string; price: number; image_url: string; stock: number; active: boolean; }

const empty = { name: '', description: '', price: '', image_url: '', stock: '-1' };

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  function load() {
    api.get('/products/admin/all').then((r) => setProducts(r.data)).finally(() => setLoading(false));
  }
  useEffect(load, []);

  function set(k: string) { return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((f) => ({ ...f, [k]: e.target.value })); }

  function startEdit(p: Product) {
    setEditing(p.id);
    setForm({ name: p.name, description: p.description || '', price: String(p.price / 100), image_url: p.image_url || '', stock: String(p.stock) });
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const price = Math.round(parseFloat(form.price) * 100);
    if (!form.name || isNaN(price) || price <= 0) return toast.error('Preencha nome e preço válido');

    setSaving(true);
    try {
      const payload = { name: form.name, description: form.description, price, image_url: form.image_url, stock: parseInt(form.stock) };
      if (editing) {
        await api.put(`/products/${editing}`, payload);
        toast.success('Produto atualizado');
      } else {
        await api.post('/products', payload);
        toast.success('Produto criado');
      }
      setForm(empty);
      setEditing(null);
      load();
    } catch { toast.error('Erro ao salvar produto'); }
    finally { setSaving(false); }
  }

  async function toggleActive(p: Product) {
    await api.put(`/products/${p.id}`, { active: !p.active }).catch(() => toast.error('Erro'));
    load();
  }

  return (
    <AdminLayout title="Produtos">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <div className="card p-6 sticky top-24">
            <h2 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
              {editing ? <Edit2 className="w-4 h-4 text-sea" /> : <Plus className="w-4 h-4 text-sea" />}
              {editing ? 'Editar produto' : 'Novo produto'}
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="label">Nome *</label>
                <input className="input-field" placeholder="Prato de Tainha Grelhada" value={form.name} onChange={set('name')} required />
              </div>
              <div>
                <label className="label">Descrição</label>
                <textarea className="input-field resize-none h-20" placeholder="Descreva o prato..." value={form.description} onChange={set('description')} />
              </div>
              <div>
                <label className="label">Preço (R$) *</label>
                <input className="input-field" type="number" step="0.01" min="0.01" placeholder="89.00" value={form.price} onChange={set('price')} required />
              </div>
              <div>
                <label className="label">URL da imagem</label>
                <input className="input-field" type="url" placeholder="https://..." value={form.image_url} onChange={set('image_url')} />
              </div>
              <div>
                <label className="label">Estoque (-1 = ilimitado)</label>
                <input className="input-field" type="number" min="-1" value={form.stock} onChange={set('stock')} />
              </div>
              <div className="flex gap-2">
                <button type="submit" disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {saving ? 'Salvando...' : editing ? 'Salvar' : 'Criar produto'}
                </button>
                {editing && (
                  <button type="button" onClick={() => { setEditing(null); setForm(empty); }} className="btn-secondary px-4">
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* List */}
        <div className="lg:col-span-3">
          <div className="card overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-16"><div className="w-7 h-7 border-4 border-sea border-t-transparent rounded-full animate-spin" /></div>
            ) : products.length === 0 ? (
              <div className="py-12 text-center"><Fish className="w-10 h-10 text-ocean-200 mx-auto mb-2" /><p className="text-slate-400">Nenhum produto cadastrado</p></div>
            ) : (
              <div className="divide-y divide-ocean-50">
                {products.map((p) => (
                  <div key={p.id} className={`flex items-start gap-4 p-5 ${!p.active ? 'opacity-50' : ''}`}>
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.name} className="w-16 h-12 object-cover rounded-xl flex-shrink-0" />
                    ) : (
                      <div className="w-16 h-12 bg-ocean-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Fish className="w-6 h-6 text-ocean-300" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-slate-800 text-sm">{p.name}</p>
                          <p className="text-slate-400 text-xs mt-0.5 line-clamp-1">{p.description}</p>
                        </div>
                        <p className="font-bold text-sea flex-shrink-0">{formatBRL(p.price)}</p>
                      </div>
                      <div className="flex items-center gap-3 mt-3">
                        <button onClick={() => startEdit(p)} className="text-xs text-sea font-medium hover:underline flex items-center gap-1">
                          <Edit2 className="w-3 h-3" /> Editar
                        </button>
                        <button onClick={() => toggleActive(p)} className={`text-xs font-medium flex items-center gap-1 ${p.active ? 'text-slate-500 hover:text-red-500' : 'text-emerald-600 hover:text-emerald-700'}`}>
                          {p.active ? <ToggleRight className="w-3 h-3" /> : <ToggleLeft className="w-3 h-3" />}
                          {p.active ? 'Desativar' : 'Ativar'}
                        </button>
                        <span className="text-xs text-slate-400">Estoque: {p.stock === -1 ? '∞' : p.stock}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
