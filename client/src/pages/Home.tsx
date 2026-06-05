import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api, { formatBRL } from '../lib/api';

interface Product { id: number; name: string; description: string; price: number; image_url: string; }

const MARQUEE = Array(6).fill('TAINHA DO MAR · SANTA CATARINA · TEMPORADA 2025 · PEIXE FRESCO · GRELHADO NA BRASA · ').join('');

function useReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } }),
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

  useEffect(() => { api.get('/products').then(r => setProducts(r.data)).catch(() => {}); }, []);

  return (
    <div>
      <Navbar overlay />

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section className="relative min-h-[100svh] bg-ink flex flex-col overflow-hidden select-none">

        {/* Photo texture — very subtle */}
        <div className="absolute inset-0 pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1559847844-5315695dadae?w=1920&q=60"
            alt=""
            className="w-full h-full object-cover grayscale"
            style={{ opacity: 0.1, mixBlendMode: 'luminosity' }}
          />
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 100% at 40% 60%, #1a0d00 0%, #080808 70%)' }} />
        </div>

        {/* Header bar */}
        <div className="relative z-10 mt-14 flex items-center justify-between px-8 sm:px-12 py-4 border-b border-white/[0.07]">
          <p className="text-white/25 text-[10px] tracking-[0.25em] uppercase">Santa Catarina · Temporada 2025</p>
          <p className="text-white/25 text-[10px] tracking-[0.25em] uppercase hidden sm:block">Reservas abertas · PIX</p>
        </div>

        {/* Headline — takes over the screen */}
        <div className="relative z-10 flex-1 flex flex-col justify-center px-6 sm:px-10 py-10">
          <h1
            className="font-display font-bold text-parch leading-[0.84] tracking-[-0.03em] break-keep"
            style={{ fontSize: 'clamp(5rem, 21vw, 21rem)' }}
          >
            TAINHA
          </h1>
          <h1
            className="font-display font-bold italic text-gold leading-[0.84] tracking-[-0.03em]"
            style={{ fontSize: 'clamp(5rem, 21vw, 21rem)' }}
          >
            do Mar.
          </h1>

          {/* Subline */}
          <p className="mt-8 sm:mt-10 text-white/35 text-sm sm:text-base leading-relaxed max-w-sm"
            style={{ paddingLeft: '2px' }}>
            O prato mais esperado do ano — direto<br />
            da lagoa para a brasa, sem enrolação.
          </p>
        </div>

        {/* Bottom action bar */}
        <div className="relative z-10 px-8 sm:px-12 pb-6 pt-6 border-t border-white/[0.07]
          flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-baseline gap-5">
            <div>
              <p className="text-white/20 text-[9px] tracking-[0.22em] uppercase">A partir de</p>
              <p className="font-display font-bold text-parch text-3xl sm:text-4xl leading-none mt-0.5">R$ 85</p>
            </div>
            <span className="text-white/15 text-sm">/por prato</span>
          </div>

          <div className="flex items-center gap-4">
            <a href="#cardapio" className="text-white/30 text-[10px] tracking-[0.2em] uppercase hover:text-white/60 transition-colors">
              Ver cardápio ↓
            </a>
            <Link to="/checkout"
              className="group flex items-center gap-2 bg-gold text-ink font-bold text-[11px] tracking-[0.18em] uppercase px-7 py-4 hover:brightness-110 transition-all">
              Garantir meu lugar
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-px group-hover:-translate-y-px transition-transform" />
            </Link>
          </div>
        </div>

        {/* Rolling marquee */}
        <div className="relative z-10 overflow-hidden border-t border-white/[0.05] py-3 bg-ink/60">
          <div className="animate-marquee whitespace-nowrap text-white/10 text-[10px] tracking-[0.22em] uppercase inline-block">
            {MARQUEE}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          STATEMENT
      ══════════════════════════════════════ */}
      <section className="bg-parch overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-8 sm:px-12 py-28 sm:py-44">
          <div data-reveal>
            <p className="text-ink/25 text-[10px] tracking-[0.25em] uppercase mb-12">Nossa filosofia</p>
            <blockquote
              className="font-display font-bold italic text-ink leading-[0.88] tracking-[-0.025em]"
              style={{ fontSize: 'clamp(2.2rem, 6.5vw, 7rem)' }}
            >
              "A tainha é mais do que<br />
              um peixe.{' '}
              <span className="text-gold not-italic">É o mês de junho,<br />
              a lagoa, o cheiro<br />
              da brasa."</span>
            </blockquote>
            <div className="mt-14 flex items-center gap-6">
              <div className="w-20 h-px bg-gold" />
              <p className="text-ink/30 text-[10px] tracking-[0.22em] uppercase">Desde a lagoa até sua mesa, sem atalhos</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          ABOUT SPLIT
      ══════════════════════════════════════ */}
      <section className="bg-ink overflow-hidden">
        <div className="max-w-[1400px] mx-auto grid lg:grid-cols-2 min-h-[60vh]">
          {/* Image */}
          <div className="relative overflow-hidden min-h-[400px]">
            <img
              src="https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=900&q=85"
              alt="Tainha grelhada"
              className="w-full h-full object-cover"
              style={{ opacity: 0.6 }}
            />
            <div className="absolute inset-0"
              style={{ background: 'linear-gradient(to right, transparent 60%, #080808 100%)' }} />
          </div>

          {/* Text */}
          <div className="px-10 sm:px-16 py-20 flex flex-col justify-center" data-reveal>
            <p className="text-gold text-[10px] tracking-[0.25em] uppercase mb-8">Tradição catarinense</p>
            <p className="font-display font-bold text-parch text-2xl sm:text-3xl leading-snug mb-6">
              Capturada fresca,<br />
              <span className="italic text-gold">grelhada na hora.</span>
            </p>
            <p className="text-white/35 text-sm leading-relaxed max-w-sm">
              Cada prato carrega décadas de tradição da pesca artesanal de Santa Catarina.
              Sem congelados, sem intermediários — direto da lagoa para a brasa.
            </p>

            <div className="mt-12 pt-10 border-t border-white/8 grid grid-cols-2 gap-8">
              {[['100%', 'Peixe fresco'], ['Dia a dia', 'Captura artesanal']].map(([v, l]) => (
                <div key={l}>
                  <p className="font-display font-bold text-parch text-3xl">{v}</p>
                  <p className="text-white/25 text-[10px] tracking-[0.18em] uppercase mt-1">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CARDÁPIO — restaurant menu format
      ══════════════════════════════════════ */}
      <section id="cardapio" className="bg-parch">
        <div className="max-w-[1400px] mx-auto">

          {/* Section header */}
          <div className="px-8 sm:px-12 pt-20 pb-10 flex items-end justify-between border-b border-ink/8">
            <div data-reveal>
              <p className="text-gold text-[10px] tracking-[0.25em] uppercase mb-3">Cardápio</p>
              <h2 className="font-display font-bold text-ink leading-[0.88] tracking-[-0.03em]"
                style={{ fontSize: 'clamp(2.5rem, 5.5vw, 6rem)' }}>
                O que<br /><span className="italic">servimos.</span>
              </h2>
            </div>
            <p className="hidden sm:block text-ink/20 text-[10px] tracking-[0.18em] uppercase text-right">
              Pratos da<br />temporada
            </p>
          </div>

          {/* Menu list + sticky image */}
          <div className="flex">

            {/* Items */}
            <div className="flex-1 divide-y divide-ink/8" data-reveal-stagger>
              {products.length === 0 && (
                <p className="px-12 py-20 text-ink/20 text-sm text-center">A carregar...</p>
              )}
              {products.map((p, i) => (
                <div
                  key={p.id}
                  className="group px-8 sm:px-12 py-10 sm:py-12 flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-12 hover:bg-ink/[0.02] transition-colors cursor-default"
                  onMouseEnter={() => setHovered(p)}
                  onMouseLeave={() => setHovered(null)}
                >
                  {/* Number */}
                  <span className="font-display text-ink/12 text-lg flex-shrink-0 pt-2 hidden sm:block">
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  {/* Name + description */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-bold text-ink group-hover:text-gold transition-colors duration-200"
                      style={{ fontSize: 'clamp(1.35rem, 2.5vw, 2rem)' }}>
                      {p.name}
                    </h3>
                    <p className="font-display italic text-ink/35 text-sm sm:text-base leading-relaxed mt-2 max-w-lg">
                      {p.description}
                    </p>
                  </div>

                  {/* Price + CTA */}
                  <div className="flex items-center gap-5 flex-shrink-0">
                    <span className="font-display font-bold text-ink text-2xl">{formatBRL(p.price)}</span>
                    <Link
                      to={`/checkout?product=${p.id}`}
                      className="flex items-center gap-1.5 bg-ink text-parch text-[10px] font-bold tracking-[0.15em] uppercase px-5 py-3 hover:bg-mist transition-colors opacity-0 group-hover:opacity-100"
                    >
                      Comprar <ArrowUpRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Sticky image panel — desktop only */}
            <div className="hidden xl:block w-80 border-l border-ink/8 flex-shrink-0">
              <div className="sticky top-14 h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center p-8">
                {hovered?.image_url ? (
                  <img
                    key={hovered.id}
                    src={hovered.image_url.replace('w=800', 'w=600')}
                    alt={hovered.name}
                    className="w-full aspect-[4/5] object-cover animate-img-in"
                  />
                ) : (
                  <div className="w-full aspect-[4/5] border border-ink/8 flex items-center justify-center">
                    <p className="text-ink/20 text-[10px] tracking-[0.2em] uppercase text-center leading-relaxed">
                      Passe o cursor<br />em um prato
                    </p>
                  </div>
                )}
                {hovered && (
                  <div className="mt-4 w-full">
                    <p className="font-display font-bold text-ink text-sm">{hovered.name}</p>
                    <p className="text-ink/35 text-xs mt-0.5">{formatBRL(hovered.price)}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="px-8 sm:px-12 py-8 border-t border-ink/8">
            <Link to="/checkout" className="inline-flex items-center gap-2 text-ink/40 hover:text-ink text-[11px] tracking-[0.18em] uppercase transition-colors">
              Comprar ingresso agora <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          COMO FUNCIONA
      ══════════════════════════════════════ */}
      <section id="como-funciona" className="bg-ink py-28 sm:py-40">
        <div className="max-w-[1400px] mx-auto px-8 sm:px-12">

          <div className="flex items-end gap-8 mb-20" data-reveal>
            <h2 className="font-display font-bold text-parch leading-[0.88] tracking-[-0.03em]"
              style={{ fontSize: 'clamp(2rem, 4.5vw, 5rem)' }}>
              Em três<br /><span className="italic text-gold">passos.</span>
            </h2>
            <div className="flex-1 h-px bg-white/8 mb-3 hidden sm:block" />
            <p className="text-white/20 text-[10px] tracking-[0.2em] uppercase mb-3 hidden sm:block flex-shrink-0">
              Simples assim
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/8" data-reveal-stagger>
            {[
              { n: '01', t: 'Escolha e pague', b: 'Selecione o prato, informe seus dados e pague via PIX. Menos de dois minutos.' },
              { n: '02', t: 'Receba no email', b: 'QR Code enviado no ato da confirmação. Sem espera, sem burocracia.' },
              { n: '03', t: 'Chegue e curta', b: 'Mostre o QR Code na entrada. Sente-se. Aproveite o melhor da temporada.' },
            ].map(({ n, t, b }) => (
              <div key={n} className="sm:px-10 first:pl-0 last:pr-0 py-10 sm:py-0">
                <p className="font-display font-bold text-parch/8 text-[5rem] leading-none select-none">{n}</p>
                <h3 className="font-display font-bold text-parch text-xl mt-3 mb-3">{t}</h3>
                <p className="text-white/30 text-sm leading-relaxed">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          TESTIMONIAL
      ══════════════════════════════════════ */}
      <section className="bg-parch overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-8 sm:px-12 py-28 sm:py-44">
          <div data-reveal>
            <p className="text-gold text-[10px] tracking-[0.25em] uppercase mb-14">Quem foi, aprovou</p>

            <blockquote
              className="font-display font-bold italic text-ink leading-[0.9] tracking-[-0.025em]"
              style={{ fontSize: 'clamp(1.8rem, 5vw, 5.5rem)' }}
            >
              "Nunca comi uma tainha tão fresca.
              Paguei no PIX, recebi o ingresso em segundos.
              <span className="text-gold"> No ano que vem já reservei."</span>
            </blockquote>

            <div className="mt-12 flex items-center gap-6">
              <div className="w-12 h-px bg-gold" />
              <p className="text-ink/40 text-sm">
                Carolina M.
                <span className="text-ink/20 ml-2">· Florianópolis, SC</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CTA FINAL
      ══════════════════════════════════════ */}
      <section className="bg-gold overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-8 sm:px-12 py-24 sm:py-36 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-10">
          <div data-reveal>
            <p className="text-ink/40 text-[10px] tracking-[0.25em] uppercase mb-5">Vagas limitadas</p>
            <h2 className="font-display font-bold text-ink leading-[0.88] tracking-[-0.03em]"
              style={{ fontSize: 'clamp(2.5rem, 7vw, 8rem)' }}>
              Não perca<br /><span className="italic">a temporada.</span>
            </h2>
          </div>
          <Link to="/checkout"
            className="flex-shrink-0 flex items-center gap-3 bg-ink text-parch font-bold text-xs tracking-[0.2em] uppercase px-10 py-5 hover:bg-mist transition-colors">
            Comprar ingresso <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
