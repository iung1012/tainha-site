import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Ticket, Fish, LogOut, ShoppingBag, CheckCircle, Clock, XCircle } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import api, { formatBRL, formatDate, padOrder } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';

interface Order {
  id: number; status: string; total: number; created_at: string; customer_name: string;
  items: { product_name: string; quantity: number }[];
  tickets: { ticket_code: string; validated: boolean }[];
}

const StatusBadge = ({ s }: { s: string }) => {
  const map: Record<string, [string, React.ElementType]> = {
    paid: ['badge-paid', CheckCircle], pending: ['badge-pending', Clock],
    cancelled: ['badge-cancelled', XCircle], expired: ['badge-expired', XCircle],
  };
  const [cls, Icon] = map[s] || ['badge-expired', XCircle];
  return <span className={`${cls} flex items-center gap-1 w-fit`}><Icon className="w-3 h-3" />{s === 'paid' ? 'Pago' : s === 'pending' ? 'Aguardando' : s === 'cancelled' ? 'Cancelado' : 'Expirado'}</span>;
};

export default function ClientDashboard() {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/my/orders').then((r) => setOrders(r.data)).finally(() => setLoading(false));
  }, []);

  const paidOrders = orders.filter((o) => o.status === 'paid');
  const totalTickets = paidOrders.reduce((acc, o) => acc + o.tickets.length, 0);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-ocean-50 py-10">
        <div className="max-w-4xl mx-auto px-4">

          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="font-display font-bold text-3xl text-sea-dark">Olá, {user?.name.split(' ')[0]}!</h1>
              <p className="text-slate-500 mt-1">Gerencie seus ingressos</p>
            </div>
            <button onClick={logout} className="btn-ghost flex items-center gap-1.5 text-sm text-red-500 hover:bg-red-50">
              <LogOut className="w-4 h-4" /> Sair
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Pedidos', value: orders.length, icon: ShoppingBag, color: 'text-sea' },
              { label: 'Ingressos', value: totalTickets, icon: Ticket, color: 'text-emerald-600' },
              { label: 'Pago', value: formatBRL(paidOrders.reduce((a, o) => a + o.total, 0)), icon: CheckCircle, color: 'text-amber-500' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="card p-5">
                <Icon className={`w-5 h-5 ${color} mb-2`} />
                <p className="font-bold text-2xl text-slate-800">{value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          <Link to="/checkout" className="btn-primary inline-flex items-center gap-2 mb-8">
            <Fish className="w-4 h-4" /> Comprar mais ingressos
          </Link>

          {/* Orders */}
          <h2 className="font-semibold text-slate-700 mb-4">Meus pedidos</h2>

          {loading ? (
            <div className="flex items-center justify-center py-16"><div className="w-8 h-8 border-4 border-sea border-t-transparent rounded-full animate-spin" /></div>
          ) : orders.length === 0 ? (
            <div className="card p-12 text-center">
              <Fish className="w-12 h-12 text-ocean-200 mx-auto mb-3" />
              <p className="text-slate-500">Você ainda não tem pedidos.</p>
              <Link to="/checkout" className="btn-primary inline-flex items-center gap-2 mt-4">Comprar ingresso</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="card p-6">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <p className="font-bold text-slate-800">{padOrder(order.id)}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{formatDate(order.created_at)}</p>
                    </div>
                    <div className="text-right">
                      <StatusBadge s={order.status} />
                      <p className="font-bold text-sea mt-1">{formatBRL(order.total)}</p>
                    </div>
                  </div>

                  {order.items.map((item, i) => (
                    <p key={i} className="text-sm text-slate-600">{item.quantity}× {item.product_name}</p>
                  ))}

                  {order.status === 'paid' && order.tickets.length > 0 && (
                    <div className="mt-4 border-t border-ocean-100 pt-4">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Ingressos</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {order.tickets.map((t) => (
                          <div key={t.ticket_code} className={`flex items-center justify-between p-3 rounded-xl border ${t.validated ? 'bg-slate-50 border-slate-200 opacity-60' : 'bg-emerald-50 border-emerald-200'}`}>
                            <div className="flex items-center gap-2">
                              <Ticket className={`w-4 h-4 ${t.validated ? 'text-slate-400' : 'text-emerald-600'}`} />
                              <span className="font-mono text-xs text-slate-700">{t.ticket_code.slice(0, 12)}...</span>
                            </div>
                            <span className={`text-xs font-semibold ${t.validated ? 'text-slate-400' : 'text-emerald-600'}`}>
                              {t.validated ? 'Usado' : 'Válido'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {order.status === 'pending' && (
                    <Link to={`/pagamento/${order.id}`} className="mt-4 btn-primary text-sm inline-flex items-center gap-1.5">
                      <Clock className="w-4 h-4" /> Concluir pagamento
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
