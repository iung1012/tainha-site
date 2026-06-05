import { useEffect, useState, useCallback } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, CheckCircle, XCircle, Loader2, RefreshCw, Clock } from 'lucide-react';
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

  useEffect(() => {
    if (order?.status !== 'pending') return;
    const t = setInterval(fetchStatus, 4000);
    return () => clearInterval(t);
  }, [order?.status, fetchStatus]);

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
    if (!state?.pix_code) return;
    navigator.clipboard.writeText(state.pix_code);
    setCopied(true);
    toast.success('Código copiado!');
    setTimeout(() => setCopied(false), 3000);
  }

  if (!order) return (
    <div className="min-h-screen flex items-center justify-center bg-cream-light">
      <Loader2 className="w-6 h-6 text-ink/30 animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-cream-light py-14">
        <div className="max-w-lg mx-auto px-6">

          {/* PAGO */}
          {order.status === 'paid' && (
            <div className="bg-white border border-ink/8 p-10 text-center">
              <div className="w-16 h-16 bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-7">
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              </div>
              <span className="section-label text-emerald-600">Pagamento confirmado</span>
              <h1 className="font-display font-bold text-3xl text-ink mb-2">Tudo certo!</h1>
              <p className="text-ink/50 text-sm mb-1">{padOrder(order.id)}</p>
              <p className="text-ink/50 text-sm mb-8">
                Ingressos enviados para <strong className="text-ink">{order.customer_email}</strong>
              </p>
              <div className="bg-emerald-50 border border-emerald-200 p-4 text-left mb-8">
                <p className="text-emerald-800 text-sm leading-relaxed">
                  Verifique sua caixa de entrada — e a pasta de spam. O email contém o QR Code de entrada.
                </p>
              </div>
              <Link to="/minha-conta" className="btn-outline-ink w-full justify-center">Meus pedidos</Link>
              <Link to="/" className="block text-center text-sm text-ink/40 hover:text-ink mt-4 transition-colors">Voltar ao início</Link>
            </div>
          )}

          {/* AGUARDANDO */}
          {order.status === 'pending' && (
            <div className="bg-white border border-ink/8">
              <div className="p-8 border-b border-ink/8">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="section-label">Aguardando PIX</span>
                    <h1 className="font-display font-bold text-2xl text-ink">{padOrder(order.id)}</h1>
                  </div>
                  <div className="text-right">
                    <p className="font-display font-bold text-2xl text-ink">{formatBRL(order.total)}</p>
                    {timeLeft && (
                      <p className={`text-xs mt-1 font-semibold ${timeLeft === 'Expirado' ? 'text-ember' : 'text-ink/40'}`}>
                        {timeLeft === 'Expirado' ? 'Expirado' : `expira em ${timeLeft}`}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {state?.pix_code && (
                <div className="p-8">
                  {/* QR Code */}
                  <div className="flex justify-center mb-7">
                    <div className="border border-ink/10 p-5 inline-block">
                      <QRCodeSVG value={state.pix_code} size={200} bgColor="#FFFFFF" fgColor="#0A1628" level="H" />
                    </div>
                  </div>

                  {/* Status indicator */}
                  <div className="flex items-center justify-center gap-2 mb-6 text-ink/40 text-sm">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Verificando pagamento automaticamente...
                  </div>

                  {/* Copy code */}
                  <div className="border border-ink/10 p-4 mb-6">
                    <p className="text-xs font-semibold tracking-caps uppercase text-ink/30 mb-2">PIX copia e cola</p>
                    <div className="flex items-center gap-3">
                      <p className="text-xs text-ink/50 font-mono flex-1 line-clamp-2 break-all leading-relaxed">
                        {state.pix_code}
                      </p>
                      <button onClick={copyPix}
                        className="flex-shrink-0 bg-ink text-cream px-3 py-2 text-xs font-medium hover:bg-ink-lighter transition-colors flex items-center gap-1.5">
                        {copied ? <CheckCircle className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        {copied ? 'Copiado' : 'Copiar'}
                      </button>
                    </div>
                  </div>

                  {/* Steps */}
                  <ol className="space-y-2 mb-6">
                    {['Abra o app do seu banco', 'Escolha Pagar com PIX', 'Escaneie o QR Code ou cole o código', 'Confirme o pagamento'].map((step, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm text-ink/50">
                        <span className="w-5 h-5 border border-ink/15 flex items-center justify-center text-xs text-ink/30 flex-shrink-0">
                          {i + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>

                  <button onClick={fetchStatus}
                    className="w-full flex items-center justify-center gap-2 text-xs text-ink/40 hover:text-ink transition-colors py-2">
                    <RefreshCw className="w-3.5 h-3.5" /> Verificar manualmente
                  </button>
                </div>
              )}
            </div>
          )}

          {/* CANCELADO / EXPIRADO */}
          {(order.status === 'cancelled' || order.status === 'expired') && (
            <div className="bg-white border border-ink/8 p-10 text-center">
              <div className="w-16 h-16 bg-red-50 border border-red-200 flex items-center justify-center mx-auto mb-7">
                <XCircle className="w-8 h-8 text-ember" />
              </div>
              <h1 className="font-display font-bold text-3xl text-ink mb-3">
                {order.status === 'expired' ? 'PIX expirado' : 'Pedido cancelado'}
              </h1>
              <p className="text-ink/45 text-sm mb-8">
                O prazo para pagamento expirou. Faça um novo pedido para garantir seu ingresso.
              </p>
              <Link to="/checkout" className="btn-gold justify-center">Novo pedido</Link>
            </div>
          )}

        </div>
      </main>
      <Footer />
    </div>
  );
}
