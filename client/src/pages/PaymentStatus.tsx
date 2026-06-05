import { useEffect, useState, useCallback } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, CheckCircle, Clock, XCircle, Loader2, Fish, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api, { formatBRL, padOrder } from '../lib/api';

interface OrderStatus { id: number; status: string; total: number; customer_name: string; customer_email: string; pix_expires_at: string; }

export default function PaymentStatus() {
  const { orderId } = useParams<{ orderId: string }>();
  const location = useLocation();
  const state = location.state as { pix_code?: string; total?: number } | null;

  const [order, setOrder] = useState<OrderStatus | null>(null);
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');

  const fetchStatus = useCallback(async () => {
    if (!orderId) return;
    const { data } = await api.get(`/orders/${orderId}/status`);
    setOrder(data);
  }, [orderId]);

  useEffect(() => { fetchStatus(); }, [fetchStatus]);

  // Poll every 4s while pending
  useEffect(() => {
    if (order?.status !== 'pending') return;
    const t = setInterval(fetchStatus, 4000);
    return () => clearInterval(t);
  }, [order?.status, fetchStatus]);

  // Countdown timer
  useEffect(() => {
    if (!order?.pix_expires_at) return;
    const tick = () => {
      const diff = new Date(order.pix_expires_at).getTime() - Date.now();
      if (diff <= 0) { setTimeLeft('Expirado'); return; }
      const m = Math.floor(diff / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${m}:${String(s).padStart(2, '0')}`);
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [order?.pix_expires_at]);

  function copyPix() {
    const code = state?.pix_code;
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success('Código PIX copiado!');
    setTimeout(() => setCopied(false), 3000);
  }

  if (!order) return (
    <div className="min-h-screen flex items-center justify-center bg-ocean-50">
      <Loader2 className="w-8 h-8 text-sea animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12 bg-ocean-50">
        <div className="max-w-lg mx-auto px-4">

          {/* PAID */}
          {order.status === 'paid' && (
            <div className="card p-8 text-center">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-emerald-600" />
              </div>
              <h1 className="font-display font-bold text-3xl text-slate-800 mb-2">Pagamento confirmado!</h1>
              <p className="text-slate-500 mb-1">Pedido {padOrder(order.id)}</p>
              <p className="text-slate-500 mb-6">Os ingressos foram enviados para <strong>{order.customer_email}</strong></p>
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-8 text-sm text-emerald-700">
                Verifique sua caixa de entrada (e spam). O email contém o QR Code de entrada.
              </div>
              <Link to="/minha-conta" className="btn-primary w-full block text-center py-3">Ver meus pedidos</Link>
              <Link to="/" className="btn-ghost w-full block text-center py-3 mt-2">Voltar ao início</Link>
            </div>
          )}

          {/* PENDING */}
          {order.status === 'pending' && (
            <div className="card p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-amber-500" />
                </div>
                <h1 className="font-display font-bold text-2xl text-slate-800 mb-1">Aguardando pagamento</h1>
                <p className="text-slate-500 text-sm">Pedido {padOrder(order.id)} · <strong className="text-sea">{formatBRL(order.total)}</strong></p>
              </div>

              {/* QR Code */}
              {state?.pix_code && (
                <div className="flex flex-col items-center">
                  <div className="bg-white p-4 rounded-2xl border-2 border-ocean-200 shadow-inner mb-4">
                    <QRCodeSVG value={state.pix_code} size={220} bgColor="#FFFFFF" fgColor="#023E8A" level="H" />
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <Loader2 className="w-4 h-4 text-sea animate-spin" />
                    <span className="text-sm text-slate-500">Verificando pagamento automaticamente...</span>
                  </div>

                  {timeLeft && (
                    <div className={`text-sm font-semibold mb-4 ${timeLeft === 'Expirado' ? 'text-red-500' : 'text-amber-600'}`}>
                      {timeLeft === 'Expirado' ? '⚠️ PIX expirado' : `⏱ Expira em ${timeLeft}`}
                    </div>
                  )}

                  {/* Copy-paste code */}
                  <div className="w-full bg-ocean-50 border border-ocean-200 rounded-xl p-3 mb-4">
                    <p className="text-xs text-slate-500 mb-1 font-medium">PIX Copia e Cola</p>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-slate-700 flex-1 break-all font-mono leading-relaxed line-clamp-3">{state.pix_code}</p>
                      <button onClick={copyPix} className="flex-shrink-0 p-2 bg-sea text-white rounded-lg hover:bg-sea-dark transition-colors">
                        {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <ol className="text-xs text-slate-500 space-y-1 text-left w-full bg-ocean-50 rounded-xl p-4 mb-4">
                    <li>1. Abra o app do seu banco</li>
                    <li>2. Escolha <strong>Pagar com PIX</strong></li>
                    <li>3. Escaneie o QR Code ou cole o código acima</li>
                    <li>4. Confirme o pagamento</li>
                  </ol>

                  <button onClick={fetchStatus} className="btn-ghost flex items-center gap-2 text-sm">
                    <RefreshCw className="w-4 h-4" /> Verificar agora
                  </button>
                </div>
              )}
            </div>
          )}

          {/* CANCELLED / EXPIRED */}
          {(order.status === 'cancelled' || order.status === 'expired') && (
            <div className="card p-8 text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle className="w-10 h-10 text-red-500" />
              </div>
              <h1 className="font-display font-bold text-2xl text-slate-800 mb-2">
                {order.status === 'expired' ? 'PIX expirado' : 'Pedido cancelado'}
              </h1>
              <p className="text-slate-500 mb-6">O prazo para pagamento expirou. Faça um novo pedido.</p>
              <Link to="/checkout" className="btn-primary block text-center py-3 flex items-center justify-center gap-2">
                <Fish className="w-4 h-4" /> Novo pedido
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
