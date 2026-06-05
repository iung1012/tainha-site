import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, LogOut } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import api, { formatBRL, formatDate, padOrder } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';

interface Order {
  id: number; status: string; total: number; created_at: string;
  items: { product_name: string; quantity: number }[];
  tickets: { ticket_code: string; validated: boolean }[];
}

function StatusBadge({ s }: { s: string }) {
  if (s === 'paid') return <span className="badge-paid">Pago</span>;
  if (s === 'pending') return <span className="badge-pending">Aguardando</span>;
  if (s === 'cancelled') return <span className="badge-cancelled">Cancelado</span>;
  return <span className="badge-expired">Expirado</span>;
}

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
      <main className="flex-1 bg-cream-light py-14">
        <div className="max-w-3xl mx-auto px-6">

          {/* Header */}
          <div className="flex items-start justify-between mb-10">
            <div>
              <span className="section-label">Minha conta</span>
              <h1 className="font-display font-bold text-fluid-lg text-ink leading-tight">
                Olá,<br /><span className="italic">{user?.name.split(' ')[0]}.</span>
              </h1>
            </div>
            <button onClick={logout}
              className="flex items-center gap-1.5 text-sm text-ink/35 hover:text-ember transition-colors mt-1">
              <LogOut className="w-4 h-4" /> Sair
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-10">
            {[
              { label: 'Pedidos', value: orders.length },
              { label: 'Ingressos', value: totalTickets },
              { label: 'Investido', value: formatBRL(paidOrders.reduce((a, o) => a + o.total, 0)) },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white border border-ink/8 p-5">
                <p className="font-display font-bold text-2xl text-ink">{value}</p>
                <p className="text-xs text-ink/35 mt-1">{label}</p>
              </div>
            ))}
          </div>

          <Link to="/checkout" className="btn-gold mb-10 inline-flex">
            Comprar mais ingressos <ArrowRight className="w-4 h-4" />
          </Link>

          {/* Orders */}
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xs font-semibold tracking-caps uppercase text-ink/40">Histórico de pedidos</h2>
            <span className="text-xs text-ink/25">{orders.length} pedido{orders.length !== 1 ? 's' : ''}</span>
          </div>

          {loading ? (
            <div className="py-16 text-center">
              <div className="w-5 h-5 border-2 border-ink/20 border-t-ink/60 rounded-full animate-spin mx-auto" />
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white border border-ink/8 p-12 text-center">
              <p className="text-ink/35 text-sm mb-5">Você ainda não fez nenhum pedido.</p>
              <Link to="/checkout" className="btn-outline-ink">Comprar ingresso</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <div key={order.id} className="bg-white border border-ink/8">

                  {/* Order header */}
                  <div className="px-6 py-4 flex items-start justify-between gap-4 border-b border-ink/6">
                    <div>
                      <p className="font-semibold text-ink text-sm">{padOrder(order.id)}</p>
                      <p className="text-ink/35 text-xs mt-0.5">{formatDate(order.created_at)}</p>
                    </div>
                    <div className="text-right flex flex-col items-end gap-1.5">
                      <StatusBadge s={order.status} />
                      <p className="font-display font-bold text-lg text-ink">{formatBRL(order.total)}</p>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="px-6 py-4">
                    {order.items.map((item, i) => (
                      <p key={i} className="text-sm text-ink/60">
                        {item.quantity}× {item.product_name}
                      </p>
                    ))}
                  </div>

                  {/* Tickets */}
                  {order.status === 'paid' && order.tickets.length > 0 && (
                    <div className="px-6 pb-5 border-t border-ink/6 pt-4">
                      <p className="text-xs font-semibold tracking-caps uppercase text-ink/30 mb-3">Seus ingressos</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {order.tickets.map((t) => (
                          <div key={t.ticket_code}
                            className={`flex items-center justify-between px-3 py-2.5 border text-xs font-mono ${
                              t.validated ? 'border-ink/10 text-ink/30' : 'border-gold/40 text-ink/60 bg-gold/5'
                            }`}>
                            <span>{t.ticket_code.slice(0, 16)}…</span>
                            <span className={`font-sans font-semibold tracking-caps uppercase text-xs ml-3 ${t.validated ? 'text-ink/25' : 'text-gold'}`}>
                              {t.validated ? 'Usado' : 'Válido'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {order.status === 'pending' && (
                    <div className="px-6 pb-5">
                      <Link to={`/pagamento/${order.id}`} className="btn-gold text-xs py-2.5 px-5">
                        Concluir pagamento <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
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
