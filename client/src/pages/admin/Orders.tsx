import { useEffect, useState } from 'react';
import { CheckCircle, Clock, XCircle, RefreshCw, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import api, { formatBRL, formatDate, padOrder } from '../../lib/api';
import AdminLayout from './Layout';

interface Order {
  id: number; status: string; total: number; created_at: string;
  customer_name: string; customer_email: string; customer_cpf: string;
  items: { name: string; qty: number; price: number }[];
}

const StatusBadge = ({ s }: { s: string }) => {
  const labels: Record<string, string> = { paid: 'Pago', pending: 'Aguardando', cancelled: 'Cancelado', expired: 'Expirado' };
  const cls: Record<string, string> = { paid: 'badge-paid', pending: 'badge-pending', cancelled: 'badge-cancelled', expired: 'badge-expired' };
  return <span className={cls[s] || 'badge-expired'}>{labels[s] || s}</span>;
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Order | null>(null);

  function load() {
    setLoading(true);
    const params = new URLSearchParams({ limit: '50' });
    if (filter) params.set('status', filter);
    api.get(`/admin/orders?${params}`).then((r) => setOrders(r.data)).finally(() => setLoading(false));
  }

  useEffect(load, [filter]);

  async function updateStatus(id: number, status: string) {
    try {
      await api.patch(`/admin/orders/${id}/status`, { status });
      toast.success('Status atualizado');
      load();
      setSelected(null);
    } catch { toast.error('Erro ao atualizar'); }
  }

  const filtered = orders.filter((o) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return o.customer_name.toLowerCase().includes(s) || o.customer_email.toLowerCase().includes(s) || String(o.id).includes(s);
  });

  return (
    <AdminLayout title="Pedidos">
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input className="input-field pl-9" placeholder="Buscar por nome, email ou nº do pedido..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="input-field w-auto" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">Todos os status</option>
          <option value="pending">Aguardando</option>
          <option value="paid">Pago</option>
          <option value="cancelled">Cancelado</option>
          <option value="expired">Expirado</option>
        </select>
        <button onClick={load} className="btn-ghost flex items-center gap-1.5"><RefreshCw className="w-4 h-4" /> Atualizar</button>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16"><div className="w-7 h-7 border-4 border-sea border-t-transparent rounded-full animate-spin" /></div>
        ) : filtered.length === 0 ? (
          <p className="text-center py-12 text-slate-400">Nenhum pedido encontrado</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-ocean-50 border-b border-ocean-100">
                <tr>
                  {['Pedido', 'Cliente', 'Data', 'Total', 'Status', 'Ações'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-ocean-50">
                {filtered.map((o) => (
                  <tr key={o.id} className="hover:bg-ocean-50 transition-colors">
                    <td className="px-4 py-3 font-semibold text-slate-800">{padOrder(o.id)}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-800">{o.customer_name}</p>
                      <p className="text-slate-400 text-xs">{o.customer_email}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{formatDate(o.created_at)}</td>
                    <td className="px-4 py-3 font-bold text-sea">{formatBRL(o.total)}</td>
                    <td className="px-4 py-3"><StatusBadge s={o.status} /></td>
                    <td className="px-4 py-3">
                      <button onClick={() => setSelected(o)} className="text-sea text-xs font-medium hover:underline">Ver detalhes</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="font-bold text-xl text-slate-800">{padOrder(selected.id)}</h2>
                <StatusBadge s={selected.status} />
              </div>
              <p className="font-bold text-2xl text-sea">{formatBRL(selected.total)}</p>
            </div>

            <div className="space-y-2 mb-4 text-sm">
              <p><span className="text-slate-500">Nome:</span> <span className="font-medium">{selected.customer_name}</span></p>
              <p><span className="text-slate-500">Email:</span> <span className="font-medium">{selected.customer_email}</span></p>
              {selected.customer_cpf && <p><span className="text-slate-500">CPF:</span> <span className="font-medium">{selected.customer_cpf}</span></p>}
              <p><span className="text-slate-500">Data:</span> <span className="font-medium">{formatDate(selected.created_at)}</span></p>
            </div>

            {selected.items?.length > 0 && (
              <div className="border-t border-ocean-100 pt-3 mb-4">
                {selected.items.map((item, i) => (
                  <p key={i} className="text-sm text-slate-600">{item.qty}× {item.name} — {formatBRL(item.price * item.qty)}</p>
                ))}
              </div>
            )}

            <div className="border-t border-ocean-100 pt-4">
              <p className="text-xs text-slate-500 mb-2 font-semibold uppercase tracking-wider">Alterar status</p>
              <div className="flex flex-wrap gap-2">
                {['paid', 'pending', 'cancelled'].map((s) => (
                  <button key={s} disabled={selected.status === s} onClick={() => updateStatus(selected.id, s)}
                    className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors disabled:opacity-40 ${s === 'paid' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : s === 'pending' ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}>
                    {s === 'paid' ? 'Marcar pago' : s === 'pending' ? 'Aguardando' : 'Cancelar'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
