import { useState } from 'react';
import { QrCode, CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../lib/api';
import AdminLayout from './Layout';

type Result = { success: true; customer_name: string; product_name: string } | { error: string; validated_at?: string };

export default function AdminValidate() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  async function validate(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const { data } = await api.post('/admin/tickets/validate', { ticket_code: code.trim() });
      setResult(data);
      if (data.success) toast.success('Ingresso válido!');
      setCode('');
    } catch (err: any) {
      const errData = err.response?.data;
      setResult(errData || { error: 'Erro ao validar' });
      toast.error(errData?.error || 'Ingresso inválido');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminLayout title="Validar Ingressos">
      <div className="max-w-md mx-auto">
        <div className="card p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-ocean-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <QrCode className="w-8 h-8 text-sea" />
            </div>
            <h2 className="font-display font-bold text-2xl text-slate-800 mb-1">Validar Ingresso</h2>
            <p className="text-slate-500 text-sm">Digite ou cole o código do ingresso abaixo</p>
          </div>

          <form onSubmit={validate} className="space-y-4">
            <div>
              <label className="label">Código do ingresso</label>
              <input className="input-field text-center font-mono tracking-widest text-lg uppercase"
                placeholder="XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                value={code} onChange={(e) => { setCode(e.target.value.toUpperCase()); setResult(null); }}
                autoFocus />
              <p className="text-xs text-slate-400 mt-1 text-center">O código está no QR Code do email do cliente</p>
            </div>

            <button type="submit" disabled={loading || !code.trim()} className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-base">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
              {loading ? 'Validando...' : 'Validar ingresso'}
            </button>
          </form>

          {/* Result */}
          {result && (
            <div className={`mt-6 p-5 rounded-xl border-2 ${
              'success' in result && result.success
                ? 'bg-emerald-50 border-emerald-300'
                : 'validated_at' in result
                ? 'bg-amber-50 border-amber-300'
                : 'bg-red-50 border-red-300'
            }`}>
              {'success' in result && result.success ? (
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-8 h-8 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-emerald-800 text-lg">Ingresso Válido!</p>
                    <p className="text-emerald-700 text-sm mt-1"><strong>Cliente:</strong> {result.customer_name}</p>
                    <p className="text-emerald-700 text-sm"><strong>Prato:</strong> {result.product_name}</p>
                  </div>
                </div>
              ) : 'validated_at' in result && result.validated_at ? (
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-8 h-8 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-amber-800 text-lg">Já Utilizado!</p>
                    <p className="text-amber-700 text-sm mt-1">Este ingresso já foi usado.</p>
                    <p className="text-amber-700 text-sm">Em: {new Date(result.validated_at).toLocaleString('pt-BR')}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3">
                  <XCircle className="w-8 h-8 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-red-800 text-lg">Ingresso Inválido</p>
                    <p className="text-red-700 text-sm mt-1">{'error' in result ? result.error : 'Código não encontrado'}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <p className="text-center text-slate-400 text-xs mt-4">
          Dica: Use um leitor de QR Code que cole o texto automaticamente neste campo.
        </p>
      </div>
    </AdminLayout>
  );
}
