import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, CheckCircle, Clock, DollarSign, Package, QrCode, LayoutDashboard } from 'lucide-react';
import api, { formatBRL } from '../../lib/api';
import AdminLayout from './Layout';

interface Stats { total_orders: number; paid_orders: number; pending_orders: number; total_revenue: number; }
interface RecentOrder { id: number; status: string; total: number; customer_name: string; customer_email: string; created_at: string; }

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recent, setRecent] = useState<RecentOrder[]>([]);

  useEffect(() => {
    api.get('/admin/stats').then((r) => setStats(r.data));
    api.get('/admin/orders?limit=5').then((r) => setRecent(r.data));
  }, []);

  return (
    <AdminLayout title="Dashboard">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total de pedidos', value: stats?.total_orders ?? '—', icon: ShoppingBag, color: 'bg-ocean-100 text-sea' },
          { label: 'Pedidos pagos', value: stats?.paid_orders ?? '—', icon: CheckCircle, color: 'bg-emerald-100 text-emerald-600' },
          { label: 'Aguardando', value: stats?.pending_orders ?? '—', icon: Clock, color: 'bg-amber-100 text-amber-600' },
          { label: 'Receita total', value: stats ? formatBRL(stats.total_revenue) : '—', icon: DollarSign, color: 'bg-purple-100 text-purple-600' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card p-5">
            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${color} mb-3`}>
              <Icon className="w-5 h-5" />
            </div>
            <p className="font-bold text-2xl text-slate-800">{value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Link to="/admin/pedidos" className="card p-5 hover:shadow-md transition-shadow flex items-center gap-3">
          <ShoppingBag className="w-5 h-5 text-sea" />
          <span className="font-semibold text-slate-700">Ver pedidos</span>
        </Link>
        <Link to="/admin/produtos" className="card p-5 hover:shadow-md transition-shadow flex items-center gap-3">
          <Package className="w-5 h-5 text-sea" />
          <span className="font-semibold text-slate-700">Gerenciar produtos</span>
        </Link>
        <Link to="/admin/validar" className="card p-5 hover:shadow-md transition-shadow flex items-center gap-3">
          <QrCode className="w-5 h-5 text-sea" />
          <span className="font-semibold text-slate-700">Validar ingressos</span>
        </Link>
      </div>

      {/* Recent orders */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-ocean-100 flex items-center justify-between">
          <h2 className="font-semibold text-slate-700">Pedidos recentes</h2>
          <Link to="/admin/pedidos" className="text-sm text-sea font-medium hover:text-sea-dark">Ver todos →</Link>
        </div>
        <div className="divide-y divide-ocean-50">
          {recent.map((o) => (
            <div key={o.id} className="px-6 py-4 flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-slate-800 text-sm">#{String(o.id).padStart(6, '0')} · {o.customer_name}</p>
                <p className="text-xs text-slate-400">{o.customer_email}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-sea text-sm">{formatBRL(o.total)}</p>
                <span className={o.status === 'paid' ? 'badge-paid' : o.status === 'pending' ? 'badge-pending' : 'badge-expired'}>
                  {o.status === 'paid' ? 'Pago' : o.status === 'pending' ? 'Aguardando' : o.status}
                </span>
              </div>
            </div>
          ))}
          {recent.length === 0 && <p className="px-6 py-8 text-center text-slate-400 text-sm">Nenhum pedido ainda</p>}
        </div>
      </div>
    </AdminLayout>
  );
}
