import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Fish, Clock, CheckCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api, { formatBRL } from '../lib/api';

interface Product { id: number; name: string; description: string; price: number; image_url: string; }

const MARQUEE = Array(5).fill(
  'TAINHA DO MAR · SANTA CATARINA · TEMPORADA 2025 · PEIXE FRESCO · GRELHADO NA BRASA · '
).join('');

function useReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
      }),
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('[data-reveal],[data-reveal-stagger]').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [hovered, setHovered] = useState<Product | null>(null);
  useReveal();

  useEffect(() => {
    api.get('/products').then(r => setProducts(r.data)).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-ocean-bg">
      <Navbar overlay />

      {/* ══ HERO — gradiente oceano + tipografia editorial ══ */}
      <section className="relative min-h-[100svh] flex flex-col overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #023E8A 0%, #0077B6 55%, #0096C7 80%, #48CAE4 100%)' }}>

        {/* Foto textura — muito sutil */}
        <div className="absolute inset-0 pointer-events-none">
          <img src="https://images.unsplash.com/photo-1559847844-5315695dadae?w=1920&q=50"
            alt="" className="w-full h-full object-cover"
            style={{ opacity: 0.08, mixBlendMode: 'overlay' }} />
        </div>

        {/* Barra superior */}
        <div className="relative z-10 mt-16 border-b border-white/10 px-8 sm:px-12 py-3.5 flex items-center justify-between">
          <p className="text-white/40 text-[10px] tracking-[0.25em] uppercase">Santa Catarina · Temporada 2025</p>
          <p className="text-white/40 text-[10px] tracking-[0.25em] uppercase hidden sm:block">Reservas abertas</p>
        </div>

        {/* Headline */}
        <div className="relative z-10 flex-1 flex flex-col justify-center px-6 sm:px-10 py-10">
          <h1 className="font-display font-bold text-white leading-[0.84] tracking-[-0.03em]"
            style={{ fontSize: 'clamp(4.5rem, 19vw, 19rem)' }}>
            TAINHA
          </h1>
          <h1 className="font-display font-bold italic text-sea-pale leading-[0.84] tracking-[-0.03em]"
            style={{ fontSize: 'clamp(4.5rem, 19vw, 19rem)' }}>
            do Mar.
          </h1>
          <p className="mt-8 text-white/50 text-sm sm:text-base leading-relaxed max-w-sm">
            O prato mais esperado do ano — direto<br />
            da lagoa para a brasa, sem enrolação.
          </p>
        </div>

        {/* Barra inferior */}
        <div className="relative z-10 px-8 sm:px-12 pb-5 pt-5 border-t border-white/10
          flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-baseline gap-4">
            <div>
              <p className="text-white/30 text-[9px] tracking-[0.22em] uppercase">A partir de</p>
              <p className="font-display font-bold text-white text-3xl sm:text-4xl leading-none mt-0.5">R$ 85</p>
            </div>
            <span className="text-white/20 text-sm">/por prato</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#cardapio" className="text-white/40 text-[10px] tracking-[0.2em] uppercase hover:text-white/70 transition-colors">
              Ver cardápio ↓
            </a>
            <Link to="/checkout"
              className="group flex items-center gap-2 bg-white text-sea-dark font-bold text-[11px] tracking-[0.18em] uppercase px-7 py-4 hover:bg-sea-pale transition-colors">
              Garantir meu lugar
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-px group-hover:-translate-y-px transition-transform" />
            </Link>
          </div>
        </div>

        {/* Marquee */}
        <div className="relative z-10 overflow-hidden border-t border-white/[0.08] py-3"
          style={{ background: 'rgba(2,62,138,0.4)' }}>
          <div className="animate-marquee whitespace-nowrap text-white/15 text-[10px] tracking-[0.22em] uppercase inline-block">
            {MARQUEE}
          </div>
        </div>

        {/* Wave para próxima seção */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none" style={{ lineHeight: 0 }}>
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg"
            style={{ display:'block', width:'100%', height:60 }} preserveAspectRatio="none">
            <path d="M0 30 C360 60 720 0 1080 30 C1260 45 1380 20 1440 30 L1440 60 L0 60 Z"
              fill="#FAFCFF" />
          </svg>
        </div>
      </section>

      {/* ══ FEATURES — 3 diferenciais (do v2, estilo editorial) ══ */}
      <section className="bg-ocean-bg pt-8 pb-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-ink/6" data-reveal-stagger>
            {[
              { icon: Fish,         title: 'Peixe fresco',      desc: 'Tainha capturada diariamente. Zero congelado, zero atalho — selecionada na manhã do preparo.' },
              { icon: Clock,        title: 'Grelhado na hora',  desc: 'Saí da brasa direto para o prato. Cada ingresso reserva o seu lugar na fila da grelha.' },
              { icon: CheckCircle,  title: 'Reserva garantida', desc: 'Pague online e chegue tranquilo. Sem fila, sem risco de vaga esgotada na porta.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-ocean-bg px-8 py-10 hover:bg-ocean-subtle transition-colors">
                <Icon className="w-6 h-6 mb-5" style={{ color: '#0077B6' }} />
                <h3 className="font-display font-bold text-xl text-ink mb-3">{title}</h3>
                <p className="text-ink/45 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ MANIFESTO — blockquote editorial em azul claro ══ */}
      <section className="bg-ocean-subtle overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 sm:px-12 py-24 sm:py-36">
          <div data-reveal>
            <p className="text-[10px] tracking-[0.25em] uppercase mb-10" style={{ color: '#0077B6' }}>
              Nossa filosofia
            </p>
            <blockquote className="font-display font-bold italic text-ink leading-[0.9] tracking-[-0.025em]"
              style={{ fontSize: 'clamp(2rem, 5.5vw, 6rem)' }}>
              "A tainha é mais do que um peixe.
              <span style={{ color: '#0077B6' }}> É o mês de junho, é a lagoa,
              é o cheiro da brasa ao pôr do sol."</span>
            </blockquote>
            <div className="mt-12 flex items-center gap-5">
              <div className="w-16 h-px" style={{ backgroundColor: '#0077B6' }} />
              <p className="text-ink/30 text-[10px] tracking-[0.2em] uppercase">Desde a lagoa até sua mesa, sem atalhos</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══ CARDÁPIO — carta de restaurante em fundo escuro ══ */}
      <section id="cardapio" style={{ backgroundColor: '#0D1B2A' }}>
        <div className="max-w-7xl mx-auto">

          {/* Header da seção */}
          <div className="px-8 sm:px-12 pt-20 pb-12 border-b flex items-end justify-between" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
            <div data-reveal>
              <p className="text-[10px] tracking-[0.25em] uppercase mb-3" style={{ color: '#48CAE4' }}>Cardápio</p>
              <h2 className="font-display font-bold text-white leading-[0.88] tracking-[-0.03em]"
                style={{ fontSize: 'clamp(2.5rem, 5vw, 5.5rem)' }}>
                O que<br /><span className="italic" style={{ color: '#CAF0F8' }}>servimos.</span>
              </h2>
            </div>
            <p className="hidden sm:block text-[10px] tracking-[0.18em] uppercase text-right" style={{ color: 'rgba(255,255,255,0.18)' }}>
              Pratos da<br />temporada
            </p>
          </div>

          {/* Lista de pratos + painel lateral */}
          <div className="flex">
            {/* Items */}
            <div className="flex-1" data-reveal-stagger>
              {products.length === 0 && (
                <p className="px-12 py-20 text-center text-sm" style={{ color: 'rgba(255,255,255,0.2)' }}>A carregar...</p>
              )}
              {products.map((p, i) => (
                <div key={p.id}
                  className="group px-8 sm:px-12 py-10 sm:py-12 flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-10 cursor-default transition-colors"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
                  onMouseEnter={() => setHovered(p)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setHovered(p)}
                >
                  <span className="font-display leading-none pt-2 flex-shrink-0 hidden sm:block"
                    style={{ color: 'rgba(255,255,255,0.1)', fontSize: '1.1rem' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-bold text-white transition-colors duration-200"
                      style={{ fontSize: 'clamp(1.25rem, 2.2vw, 1.8rem)' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#48CAE4')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#ffffff')}>
                      {p.name}
                    </h3>
                    <p className="font-display italic text-sm sm:text-base leading-relaxed mt-2 max-w-lg"
                      style={{ color: 'rgba(255,255,255,0.35)' }}>
                      {p.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-5 flex-shrink-0">
                    <span className="font-display font-bold text-white text-2xl">{formatBRL(p.price)}</span>
                    <Link to={`/checkout?product=${p.id}`}
                      className="flex items-center gap-1.5 text-[10px] font-bold tracking-[0.15em] uppercase px-5 py-3 transition-all opacity-0 group-hover:opacity-100"
                      style={{ backgroundColor: '#0077B6', color: '#ffffff' }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#023E8A')}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#0077B6')}>
                      Comprar <ArrowUpRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Painel lateral sticky — desktop */}
            <div className="hidden xl:block w-72 flex-shrink-0" style={{ borderLeft: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="sticky top-16 h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-8">
                {hovered?.image_url ? (
                  <img key={hovered.id}
                    src={hovered.image_url.replace('w=800','w=600')}
                    alt={hovered.name}
                    className="w-full aspect-[4/5] object-cover animate-img-in" />
                ) : (
                  <div className="w-full aspect-[4/5] flex items-center justify-center"
                    style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
                    <p className="text-center text-[10px] tracking-[0.2em] uppercase leading-relaxed"
                      style={{ color: 'rgba(255,255,255,0.15)' }}>
                      Passe o cursor<br />em um prato
                    </p>
                  </div>
                )}
                {hovered && (
                  <div className="mt-4 w-full">
                    <p className="font-display font-bold text-sm text-white">{hovered.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#48CAE4' }}>{formatBRL(hovered.price)}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="px-8 sm:px-12 py-7" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            <Link to="/checkout"
              className="inline-flex items-center gap-2 text-[11px] tracking-[0.18em] uppercase transition-colors"
              style={{ color: 'rgba(255,255,255,0.3)' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#48CAE4')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}>
              Comprar ingresso agora <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ══ COMO FUNCIONA ══ */}
      <section id="como-funciona" className="bg-ocean-bg py-24 sm:py-36">
        <div className="max-w-7xl mx-auto px-8 sm:px-12">
          <div className="flex items-end gap-8 mb-20" data-reveal>
            <h2 className="font-display font-bold text-ink leading-[0.88] tracking-[-0.03em]"
              style={{ fontSize: 'clamp(2rem, 4.5vw, 5rem)' }}>
              Em três<br />
              <span className="italic" style={{ color: '#0077B6' }}>passos.</span>
            </h2>
            <div className="flex-1 h-px bg-ink/8 mb-3 hidden sm:block" />
            <p className="text-ink/25 text-[10px] tracking-[0.2em] uppercase mb-3 hidden sm:block flex-shrink-0">Simples assim</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-ink/8" data-reveal-stagger>
            {[
              { n:'01', t:'Escolha e pague',  b:'Selecione o prato, informe seus dados e pague via PIX. Menos de dois minutos.' },
              { n:'02', t:'Receba no email',  b:'QR Code enviado no ato da confirmação. Sem espera, sem burocracia.' },
              { n:'03', t:'Chegue e curta',   b:'Mostre o QR Code na entrada. Sente-se. Aproveite o melhor da temporada.' },
            ].map(({ n, t, b }) => (
              <div key={n} className="sm:px-10 first:pl-0 last:pr-0 py-10 sm:py-0">
                <p className="font-display font-bold leading-none select-none mb-4"
                  style={{ fontSize: '4.5rem', color: 'rgba(13,27,42,0.06)' }}>{n}</p>
                <h3 className="font-display font-bold text-xl text-ink mb-3">{t}</h3>
                <p className="text-ink/45 text-sm leading-relaxed">{b}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 pt-14 border-t border-ink/8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {['PIX instantâneo', 'Email em minutos', 'QR Code no celular', 'Sem cadastro obrigatório'].map(f => (
                <span key={f} className="flex items-center gap-2 text-sm text-ink/40">
                  <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#0077B6' }} /> {f}
                </span>
              ))}
            </div>
            <Link to="/checkout" className="btn-primary flex-shrink-0 flex items-center gap-2">
              Comprar agora <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ══ DEPOIMENTO ══ */}
      <section style={{ background: 'linear-gradient(135deg, #023E8A 0%, #0077B6 60%, #0096C7 100%)' }}
        className="py-24 sm:py-40 overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 sm:px-12" data-reveal>
          <p className="text-[10px] tracking-[0.25em] uppercase mb-12" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Quem foi, aprovou
          </p>
          <blockquote className="font-display font-bold italic text-white leading-[0.92] tracking-[-0.025em]"
            style={{ fontSize: 'clamp(1.8rem, 4.5vw, 5rem)' }}>
            "Nunca comi uma tainha tão fresca. Paguei no PIX,
            recebi o ingresso em segundos.
            <span style={{ color: '#CAF0F8' }}> No ano que vem já reservei."</span>
          </blockquote>
          <div className="mt-10 flex items-center gap-5">
            <div className="w-10 h-px bg-white/30" />
            <p className="text-white/50 text-sm">
              Carolina M. <span className="text-white/25 ml-1">· Florianópolis, SC</span>
            </p>
          </div>
        </div>
      </section>

      {/* ══ CTA FINAL ══ */}
      <section className="bg-ocean-bg py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-8 sm:px-12 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-10">
          <div data-reveal>
            <p className="text-ink/30 text-[10px] tracking-[0.25em] uppercase mb-5">Vagas limitadas</p>
            <h2 className="font-display font-bold text-ink leading-[0.88] tracking-[-0.03em]"
              style={{ fontSize: 'clamp(2.5rem, 6.5vw, 7.5rem)' }}>
              Não perca<br />
              <span className="italic" style={{ color: '#0077B6' }}>a temporada.</span>
            </h2>
          </div>
          <Link to="/checkout"
            className="flex-shrink-0 btn-primary flex items-center gap-3 text-sm px-10 py-5">
            Comprar ingresso <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
