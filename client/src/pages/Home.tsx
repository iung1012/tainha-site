import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Fish, CheckCircle, Clock, Ticket, Star, ChevronRight, Waves } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api, { formatBRL } from '../lib/api';

interface Product { id: number; name: string; description: string; price: number; image_url: string; }

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    api.get('/products').then((r) => setProducts(r.data)).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar transparent />

      {/* HERO */}
      <section className="relative min-h-screen flex items-center bg-ocean-gradient overflow-hidden">
        {/* Decorative bubbles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="absolute rounded-full bg-white opacity-5 animate-float"
              style={{ width: `${40 + i * 20}px`, height: `${40 + i * 20}px`, left: `${10 + i * 11}%`, top: `${10 + i * 8}%`, animationDelay: `${i * 0.5}s` }} />
          ))}
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-32 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
            <span className="text-white/90 text-sm font-medium">O melhor prato de tainha da região</span>
          </div>

          <h1 className="font-display font-bold text-5xl sm:text-6xl md:text-7xl text-white leading-tight mb-6">
            Tainha do Mar
            <span className="block text-sea-accent italic">Sabor Único</span>
          </h1>

          <p className="text-ocean-100 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Tainha fresca, grelhada na brasa com técnica artesanal e servida com acompanhamentos da casa.
            Garanta já o seu ingresso e viva essa experiência.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/checkout"
              className="bg-white text-sea-dark font-bold text-lg px-8 py-4 rounded-2xl hover:bg-ocean-50 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5 active:scale-95 flex items-center gap-2">
              <Ticket className="w-5 h-5" />
              Garantir meu ingresso
              <ChevronRight className="w-5 h-5" />
            </Link>
            <a href="#como-funciona"
              className="text-white/80 font-medium text-base px-6 py-4 rounded-2xl border border-white/20 hover:bg-white/10 transition-all">
              Como funciona
            </a>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-4 max-w-lg mx-auto">
            {[['500+', 'Ingressos vendidos'], ['⭐ 4.9', 'Avaliação'], ['100%', 'Satisfação']].map(([v, l]) => (
              <div key={l} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <p className="text-white font-bold text-xl">{v}</p>
                <p className="text-ocean-200 text-xs mt-0.5">{l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Wave bottom */}
        <div className="wave-container absolute bottom-0 left-0 right-0">
          <svg className="wave-svg" viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ height: 80 }}>
            <path d="M0 40 C180 80 360 0 540 40 C720 80 900 0 1080 40 C1260 80 1440 0 1440 40 L1440 80 L0 80 Z" fill="#F0F9FF" />
            <path d="M1440 40 C1620 80 1800 0 1980 40 C2160 80 2340 0 2520 40 C2700 80 2880 0 2880 40 L2880 80 L1440 80 Z" fill="#F0F9FF" />
          </svg>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 bg-ocean-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: Fish, title: 'Peixe Fresco', desc: 'Tainha capturada diariamente, selecionada com rigor para garantir o máximo de sabor e qualidade.', color: 'text-sea' },
              { icon: Clock, title: 'Servido na Hora', desc: 'Preparado na hora do seu pedido. Cada prato sai da brasa diretamente para a sua mesa.', color: 'text-emerald-600' },
              { icon: CheckCircle, title: 'Reserva Garantida', desc: 'Compre online e tenha a certeza do seu lugar reservado. Sem filas, sem surpresas.', color: 'text-amber-500' },
            ].map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="card p-8 text-center hover:shadow-md transition-shadow">
                <div className={`inline-flex items-center justify-center w-14 h-14 bg-ocean-50 rounded-2xl mb-4 ${color}`}>
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="font-display font-bold text-xl text-slate-800 mb-2">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CARDÁPIO */}
      <section id="cardapio" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-sea font-semibold text-sm uppercase tracking-wider">Nosso Cardápio</span>
            <h2 className="font-display font-bold text-4xl text-slate-800 mt-2">Escolha o seu prato</h2>
            <p className="text-slate-500 mt-3 max-w-md mx-auto">Cada prato é uma experiência única. Escolha e garanta já o seu ingresso.</p>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Fish className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Cardápio em breve...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => (
                <div key={p.id} className="card group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="aspect-video overflow-hidden bg-ocean-100">
                    {p.image_url
                      ? <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      : <div className="w-full h-full flex items-center justify-center"><Fish className="w-12 h-12 text-ocean-300" /></div>
                    }
                  </div>
                  <div className="p-6">
                    <h3 className="font-display font-bold text-xl text-slate-800 mb-2">{p.name}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-3">{p.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-2xl text-sea">{formatBRL(p.price)}</span>
                      <Link to={`/checkout?product=${p.id}`}
                        className="btn-primary text-sm px-5 py-2.5 flex items-center gap-1.5">
                        <Ticket className="w-4 h-4" /> Comprar
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="como-funciona" className="py-24 bg-ocean-gradient-light">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-sea font-semibold text-sm uppercase tracking-wider">Simples e Rápido</span>
            <h2 className="font-display font-bold text-4xl text-slate-800 mt-2">Como funciona</h2>
          </div>

          <div className="relative">
            <div className="hidden md:block absolute top-8 left-[16.5%] right-[16.5%] h-0.5 bg-gradient-to-r from-sea via-sea-light to-sea-light" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { step: '01', icon: Ticket, title: 'Compre online', desc: 'Escolha o prato e informe seus dados. Pagamento 100% seguro via PIX.' },
                { step: '02', icon: CheckCircle, title: 'Receba no email', desc: 'Seu ingresso com QR Code é enviado imediatamente ao seu email após a confirmação.' },
                { step: '03', icon: Fish, title: 'Apresente e aproveite', desc: 'No dia, apresente o QR Code na entrada e aproveite o melhor prato de tainha!' },
              ].map(({ step, icon: Icon, title, desc }) => (
                <div key={step} className="text-center relative">
                  <div className="relative inline-flex items-center justify-center w-16 h-16 bg-ocean-gradient rounded-2xl mb-4 shadow-lg">
                    <Icon className="w-7 h-7 text-white" />
                    <span className="absolute -top-2 -right-2 bg-white text-sea-dark text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow border border-ocean-100">{step}</span>
                  </div>
                  <h3 className="font-display font-bold text-xl text-slate-800 mb-2">{title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-14">
            <Link to="/checkout" className="btn-primary inline-flex items-center gap-2 text-base px-8 py-4">
              <Ticket className="w-5 h-5" /> Comprar ingresso agora
            </Link>
          </div>
        </div>
      </section>

      {/* CTA BAND */}
      <section className="py-20 bg-sea-dark">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Waves className="w-10 h-10 text-sea-accent mx-auto mb-4" />
          <h2 className="font-display font-bold text-4xl text-white mb-4">Vagas limitadas!</h2>
          <p className="text-ocean-200 text-lg mb-8">Garanta já o seu lugar e não perca essa experiência gastronômica única.</p>
          <Link to="/checkout" className="inline-flex items-center gap-2 bg-white text-sea-dark font-bold text-lg px-8 py-4 rounded-2xl hover:bg-ocean-50 transition-all shadow-xl hover:-translate-y-0.5">
            <Ticket className="w-5 h-5" /> Garantir meu ingresso
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
