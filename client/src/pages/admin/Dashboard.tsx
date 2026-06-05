import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, ShoppingBag, Clock, CheckCircle } from 'lucide-react';
import api, { formatBRL, formatDate, padOrder } from '../../lib/api';
import AdminLayout from './Layout';

interface Stats { total_orders: number; paid_orders: number; pending_orders: number; total_revenue: number; }
interface Order { id: number; status: string; total: number; customer_name: string; created_at: string; }

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recent, setRecent] = useState<Order[]>([]);

  useEffect(() => {
    api.get('/admin/stats').then((r) => setStats(r.data));
    api.get('/admin/orders?limit=8').then((r) => setRecent(r.data));
  }, []);

  const statCards = [
    { label: 'Receita total', value: stats ? formatBRL(stats.total_revenue) : '—', icon: TrendingUp, note: 'pedidos pagos' },
    { label: 'Total de pedidos', value: stats?.total_orders ?? '—', icon: ShoppingBag, note: 'desde o início' },
    { label: 'Pagos', value: stats?.paid_orders ?? '—', icon: CheckCircle, note: 'confirmados' },
    { label: 'Aguardando', value: stats?.pending_orders ?? '—', icon: Clock, note: 'pendentes' },
  ];

  return (
    <AdminLayout title="Dashboard">

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {statCards.map(({ label, value, icon: Icon, note }) => (
          <div key={label} className="bg-white border border-ink/8 p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs text-ink/35 font-semibold tracking-caps uppercase">{label}</p>
              <Icon className="w-4 h-4 text-ink/20" />
            </div>
            <p className="font-display font-bold text-2xl text-ink">{value}</p>
            <p className="text-xs text-ink/30 mt-1">{note}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-3 gap-3 mb-10">
        {[
          { to: '/admin/pedidos',  label: 'Ver pedidos',         icon: ShoppingBag },
          { to: '/admin/produtos', label: 'Gerenciar produtos',  icon: TrendingUp },
          { to: '/admin/validar',  label: 'Validar ingressos',   icon: CheckCircle },
        ].map(({ to, label, icon: Icon }) => (
          <Link key={to} to={to}
            className="bg-white border border-ink/8 p-4 flex items-center gap-3 hover:border-gold hover:bg-gold/5 transition-colors group">
            <Icon className="w-4 h-4 text-ink/30 group-hover:text-gold transition-colors" />
            <span className="text-sm font-medium text-ink/60 group-hover:text-ink transition-colors">{label}</span>
          </Link>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-white border border-ink/8">
        <div className="px-6 py-4 border-b border-ink/6 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-ink">Pedidos recentes</h2>
          <Link to="/admin/pedidos" className="text-xs text-ink/40 hover:text-ink transition-colors">Ver todos →</Link>
        </div>
        <div className="divide-y divide-ink/5">
          {recent.length === 0 && (
            <p className="px-6 py-10 text-center text-sm text-ink/25">Nenhum pedido ainda</p>
          )}
          {recent.map((o) => (
            <div key={o.id} className="px-6 py-3.5 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-ink">{padOrder(o.id)}</p>
                <p className="text-xs text-ink/35">{o.customer_name} · {formatDate(o.created_at)}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={o.status === 'paid' ? 'badge-paid' : o.status === 'pending' ? 'badge-pending' : 'badge-expired'}>
                  {o.status === 'paid' ? 'Pago' : o.status === 'pending' ? 'Aguardando' : o.status}
                </span>
                <span className="text-sm font-semibold text-ink">{formatBRL(o.total)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </AdminLayout>
  );
}
