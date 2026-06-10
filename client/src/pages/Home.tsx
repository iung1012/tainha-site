import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api, { formatBRL } from '../lib/api';

interface Product { id: number; name: string; description: string; price: number; image_url: string; }

function useReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } }),
      { threshold: 0.06, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('[data-reveal],[data-reveal-stagger]').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

const MARQUEE = 'TAINHA DO MAR · SANTA CATARINA · TEMPORADA 2025 · PEIXE FRESCO · GRELHADO NA BRASA · ';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  useReveal();
  useEffect(() => { api.get('/products').then(r => setProducts(r.data)).catch(() => {}); }, []);

  return (
    <div style={{ backgroundColor: '#F9F6F0' }}>
      <Navbar overlay />

      {/* ─────────────────────────────────────────
          HERO
      ───────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ minHeight: '100svh' }}>
        <img
          src="/images/hero.png"
          alt="Tainha grelhada"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* overlay gradiente — mais leve, foto fica visível */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(8,40,74,0.92) 0%, rgba(8,40,74,0.55) 45%, rgba(8,40,74,0.15) 100%)' }} />

        <div className="relative z-10 flex flex-col justify-end min-h-[100svh] max-w-7xl mx-auto px-6 sm:px-12 pb-12 sm:pb-16 pt-24">

          {/* Eyebrow */}
          <p className="text-white/40 mb-4" style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', fontFamily: 'DM Sans' }}>
            Tramandaí, RS · Edição 2026
          </p>

          {/* Headline — Cormorant thin, enorme */}
          <h1 className="font-display font-light text-white leading-[0.88]"
            style={{ fontSize: 'clamp(3.8rem, 11vw, 12rem)', letterSpacing: '-0.02em' }}>
            O melhor prato<br />
            <em style={{ fontStyle: 'italic', color: '#90CAF9' }}>de tainha.</em>
          </h1>

          {/* Linha separadora */}
          <div className="my-8 sm:my-10 w-full border-t" style={{ borderColor: 'rgba(255,255,255,0.15)' }} />

          {/* Bottom bar */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8">
            <div className="max-w-sm">
              <p className="text-white/50 leading-relaxed" style={{ fontSize: '0.9375rem' }}>
                Tainha fresca do litoral gaúcho grelhada na brasa.
                Sem fila, sem surpresa — o prato mais esperado de Tramandaí.
              </p>
            </div>
            <div className="flex flex-col sm:items-end gap-4 flex-shrink-0">
              <div className="sm:text-right">
                <p className="text-white/30" style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase' }}>a partir de</p>
                <p className="font-display font-light text-white" style={{ fontSize: '3rem', lineHeight: 1 }}>R$ 85</p>
              </div>
              <Link to="/checkout"
                className="inline-flex items-center gap-3 font-sans font-medium px-8 py-4 transition-all hover:gap-4"
                style={{ backgroundColor: '#fff', color: '#08284A', fontSize: 13, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                Garantir meu ingresso <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Marquee faixa */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden py-2.5" style={{ borderTop: '1px solid rgba(255,255,255,0.07)', background: 'rgba(8,40,74,0.5)' }}>
          <div className="animate-marquee inline-block whitespace-nowrap select-none"
            style={{ color: 'rgba(255,255,255,0.18)', fontSize: 10, letterSpacing: '0.24em', textTransform: 'uppercase', fontFamily: 'DM Sans' }}>
            {MARQUEE}{MARQUEE}{MARQUEE}{MARQUEE}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────
          STATEMENT — frase editorial
      ───────────────────────────────────────── */}
      <section style={{ backgroundColor: '#F9F6F0', borderBottom: '1px solid #E5E0D8' }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-12 py-20 sm:py-28">
          <div className="grid sm:grid-cols-[1fr_2fr] gap-10 sm:gap-16 items-start" data-reveal>
            <div>
              <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#6B7280', fontFamily: 'DM Sans' }}>
                Nossa filosofia
              </p>
            </div>
            <div>
              <p className="font-display font-light text-ink leading-[1.15]"
                style={{ fontSize: 'clamp(1.7rem, 3.8vw, 3.5rem)', letterSpacing: '-0.01em' }}>
                A tainha é mais do que um peixe —{' '}
                <em className="font-light" style={{ fontStyle: 'italic', color: '#0B5FA5' }}>
                  é o mês de junho, é a lagoa, é o cheiro da brasa ao pôr do sol.
                </em>
              </p>
              <div className="mt-8 flex items-center gap-4">
                <div style={{ width: 40, height: 1, backgroundColor: '#0B5FA5' }} />
                <span style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#9CA3AF', fontFamily: 'DM Sans' }}>
                  Desde a lagoa até sua mesa
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────
          CARDÁPIO — imagem ACIMA, texto ABAIXO
      ───────────────────────────────────────── */}
      <section id="cardapio" style={{ backgroundColor: '#fff', borderBottom: '1px solid #E5E0D8' }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-12 py-20 sm:py-28">

          {/* Header */}
          <div className="flex items-end justify-between mb-14" data-reveal>
            <div>
              <p className="label">Cardápio</p>
              <h2 className="font-display font-light text-ink" style={{ fontSize: 'clamp(2.4rem, 5vw, 5rem)', letterSpacing: '-0.02em', lineHeight: 0.9 }}>
                Escolha o seu<br /><em style={{ fontStyle: 'italic' }}>prato.</em>
              </h2>
            </div>
            <Link to="/checkout" className="hidden sm:inline-flex items-center gap-2 text-ink/40 hover:text-ink transition-colors"
              style={{ fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: 'DM Sans', fontWeight: 500 }}>
              Ver todos <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Grid de produtos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10" data-reveal-stagger>
            {products.length === 0
              ? [1,2,3].map(i => <ProductSkeleton key={i} />)
              : products.map(p => <ProductCard key={p.id} product={p} />)
            }
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────
          SPLIT — foto à esquerda, texto à direita
      ───────────────────────────────────────── */}
      <section style={{ backgroundColor: '#F9F6F0', borderBottom: '1px solid #E5E0D8' }}>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2" style={{ minHeight: 540 }}>

          {/* Foto */}
          <div className="relative overflow-hidden" style={{ minHeight: 380 }}>
            <img
              src="/images/grelha.png"
              alt="Peixe fresco"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Texto */}
          <div className="px-10 sm:px-16 py-16 sm:py-20 flex flex-col justify-center" data-reveal>
            <p className="label">Tradição gaúcha</p>
            <h2 className="font-display font-light text-ink mt-2 mb-6"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.8rem)', letterSpacing: '-0.02em', lineHeight: 1 }}>
              Capturado fresco,<br />
              <em style={{ fontStyle: 'italic', color: '#0B5FA5' }}>grelhado na hora.</em>
            </h2>
            <p className="text-muted leading-relaxed mb-10" style={{ fontSize: '0.9375rem', maxWidth: 380 }}>
              Sem congelados, sem intermediários. A tainha chega direto do litoral gaúcho para a brasa,
              selecionada com rigor e preparada por quem entende de peixe.
            </p>
            <div className="grid grid-cols-2 gap-8 pt-8" style={{ borderTop: '1px solid #E5E0D8' }}>
              {[['100%', 'Peixe fresco'], ['Artesanal', 'Todo dia']].map(([v, l]) => (
                <div key={l}>
                  <p className="font-display font-light text-ink" style={{ fontSize: '2.5rem', lineHeight: 1 }}>{v}</p>
                  <p style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#9CA3AF', marginTop: 4, fontFamily: 'DM Sans' }}>{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────
          COMO FUNCIONA
      ───────────────────────────────────────── */}
      <section id="como-funciona" style={{ backgroundColor: '#fff', borderBottom: '1px solid #E5E0D8' }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-12 py-20 sm:py-28">
          <div className="mb-16" data-reveal>
            <p className="label">Como funciona</p>
            <h2 className="font-display font-light text-ink" style={{ fontSize: 'clamp(2.2rem, 4.5vw, 4.5rem)', letterSpacing: '-0.02em', lineHeight: 0.92 }}>
              Em três passos<br /><em style={{ fontStyle: 'italic' }}>simples.</em>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border" data-reveal-stagger>
            {[
              { n: '01', t: 'Compre online', b: 'Escolha o prato e pague com PIX. Rápido, sem cadastro obrigatório.' },
              { n: '02', t: 'Receba no email', b: 'Seu ingresso com QR Code chega na caixa de entrada na hora.' },
              { n: '03', t: 'Chegue e aproveite', b: 'Mostre o QR Code na entrada. Seu lugar está reservado.' },
            ].map(({ n, t, b }) => (
              <div key={n} className="py-10 sm:py-0 sm:px-10 first:pl-0 last:pr-0">
                <p className="font-display font-light text-ink/10 select-none" style={{ fontSize: '5rem', lineHeight: 1, marginBottom: 12 }}>{n}</p>
                <h3 className="font-display font-light text-ink mb-3" style={{ fontSize: '1.5rem' }}>{t}</h3>
                <p className="text-muted" style={{ fontSize: '0.875rem', lineHeight: 1.7 }}>{b}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 pt-14 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <p className="text-muted" style={{ fontSize: '0.875rem' }}>
              Dúvidas? Fale com a gente em <span style={{ color: '#0B5FA5' }}>contato@tainhadomar.com.br</span>
            </p>
            <Link to="/checkout"
              className="inline-flex items-center gap-3 font-sans font-medium px-8 py-4 transition-all hover:gap-4 flex-shrink-0"
              style={{ backgroundColor: '#0B5FA5', color: '#fff', fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
              Comprar ingresso <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────
          FOTO IMERSIVA
      ───────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ minHeight: 500 }}>
        <img
          src="/images/brasa.png"
          alt="Experiência gastronômica"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: 'rgba(8,40,74,0.72)' }} />
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 py-24 sm:py-32 flex flex-col justify-center" style={{ minHeight: 500 }}>
          <div className="max-w-2xl" data-reveal>
            <p style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 24, fontFamily: 'DM Sans' }}>
              A experiência
            </p>
            <blockquote className="font-display font-light text-white leading-[1.05]"
              style={{ fontSize: 'clamp(2rem, 4.5vw, 4.2rem)', letterSpacing: '-0.02em' }}>
              "A tainha tem época. Quando a temporada acaba,{' '}
              <em style={{ fontStyle: 'italic', color: '#90CAF9' }}>acabou.</em>"
            </blockquote>
            <Link to="/checkout"
              className="mt-10 inline-flex items-center gap-3 font-sans font-medium transition-all hover:gap-4"
              style={{ backgroundColor: '#fff', color: '#08284A', padding: '14px 32px', fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
              Garantir meu lugar <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────
          DEPOIMENTOS
      ───────────────────────────────────────── */}
      <section style={{ backgroundColor: '#F9F6F0', borderBottom: '1px solid #E5E0D8' }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-12 py-20 sm:py-28">
          <div className="mb-14" data-reveal>
            <p className="label">Depoimentos</p>
            <h2 className="font-display font-light text-ink" style={{ fontSize: 'clamp(2rem, 4vw, 4rem)', letterSpacing: '-0.02em', lineHeight: 0.92 }}>
              Quem foi,<br /><em style={{ fontStyle: 'italic' }}>aprovou.</em>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-border" data-reveal-stagger>
            {[
              { q: 'Nunca comi uma tainha tão fresca. A grelha deixa um sabor que não tem igual. Já reservei para o ano que vem.', name: 'Carolina M.', city: 'Florianópolis, SC' },
              { q: 'O processo foi rapidíssimo — paguei no PIX e recebi o ingresso em menos de um minuto. Sem complicação.', name: 'Rafael T.', city: 'Joinville, SC' },
              { q: 'Levei a família toda e todos adoraram. O Combo Família vale muito. Tradição de verdade.', name: 'Lurdes F.', city: 'Laguna, SC' },
            ].map(({ q, name, city }) => (
              <div key={name} style={{ backgroundColor: '#F9F6F0', padding: '2.5rem' }}>
                <p className="font-display font-light text-ink leading-snug flex-1 mb-8"
                  style={{ fontSize: '1.2rem', fontStyle: 'italic' }}>"{q}"</p>
                <div>
                  <p style={{ fontSize: '0.875rem', fontWeight: 500, color: '#0A0A0A' }}>{name}</p>
                  <p style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: 2 }}>{city}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ─────────────────────────────────────────
          GALERIA — fotos reais do evento
      ───────────────────────────────────────── */}
      <section style={{ backgroundColor: '#fff', borderBottom: '1px solid #E5E0D8' }}>
        <div className='max-w-7xl mx-auto px-6 sm:px-12 py-20 sm:py-24'>
          <div className='mb-12' data-reveal>
            <p className='label'>Edições anteriores</p>
            <h2 className='font-display font-light text-ink' style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', letterSpacing: '-0.02em', lineHeight: 0.95 }}>
              Como é a festa,<br /><em style={{ fontStyle: 'italic' }}>de verdade.</em>
            </h2>
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4' data-reveal-stagger>
            <div className='overflow-hidden' style={{ aspectRatio: '16/10' }}>
              <img src='/images/evento.png' alt='Balcão da Festa da Tainha Tramandaí'
                className='w-full h-full object-cover hover:scale-105 transition-transform duration-700' />
            </div>
            <div className='grid grid-rows-2 gap-4'>
              <div className='overflow-hidden' style={{ aspectRatio: '16/7' }}>
                <img src='/images/grelha.png' alt='Tainha sendo grelhada'
                  className='w-full h-full object-cover hover:scale-105 transition-transform duration-700' />
              </div>
              <div className='overflow-hidden' style={{ aspectRatio: '16/7' }}>
                <img src='/images/prato.png' alt='Prato de tainha completo'
                  className='w-full h-full object-cover hover:scale-105 transition-transform duration-700' />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────
          CTA FINAL
      ───────────────────────────────────────── */}
      <section style={{ backgroundColor: '#08284A' }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-12 py-24 sm:py-36 flex flex-col sm:flex-row sm:items-end justify-between gap-12">
          <div data-reveal>
            <p style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 20, fontFamily: 'DM Sans' }}>
              Vagas limitadas
            </p>
            <h2 className="font-display font-light text-white leading-[0.9]"
              style={{ fontSize: 'clamp(3rem, 8vw, 8rem)', letterSpacing: '-0.025em' }}>
              Não perca<br />
              <em style={{ fontStyle: 'italic', color: '#90CAF9' }}>a temporada.</em>
            </h2>
          </div>
          <div className="flex-shrink-0">
            <p className="text-white/30 mb-6" style={{ fontSize: '0.875rem' }}>
              Pague com PIX · receba na hora · ingresso no email
            </p>
            <Link to="/checkout"
              className="inline-flex items-center gap-3 font-sans font-medium transition-all hover:gap-5"
              style={{ backgroundColor: '#fff', color: '#08284A', padding: '18px 40px', fontSize: 13, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
              Comprar ingresso <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function ProductCard({ product: p }: { product: Product }) {
  return (
    <div className="group flex flex-col">
      {/* Imagem acima — destaque total */}
      <div className="overflow-hidden" style={{ aspectRatio: '4/3', backgroundColor: '#E5E0D8' }}>
        {p.image_url ? (
          <img
            src={p.image_url}
            alt={p.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span style={{ color: '#9CA3AF', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Sem foto</span>
          </div>
        )}
      </div>

      {/* Texto abaixo — limpo, sem overlay */}
      <div className="pt-5 flex flex-col flex-1">
        <h3 className="font-display font-light text-ink mb-2" style={{ fontSize: '1.5rem', letterSpacing: '-0.01em' }}>
          {p.name}
        </h3>
        <p className="text-muted flex-1 leading-relaxed" style={{ fontSize: '0.875rem' }}>
          {p.description}
        </p>
        <div className="mt-5 pt-5 flex items-center justify-between" style={{ borderTop: '1px solid #E5E0D8' }}>
          <span className="font-display font-light text-ink" style={{ fontSize: '1.5rem' }}>
            {formatBRL(p.price)}
          </span>
          <Link to={`/checkout?product=${p.id}`}
            className="inline-flex items-center gap-2 font-sans font-medium transition-all hover:gap-3"
            style={{ color: '#0B5FA5', fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Comprar <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function ProductSkeleton() {
  return (
    <div className="flex flex-col animate-pulse">
      <div style={{ aspectRatio: '4/3', backgroundColor: '#E5E0D8', borderRadius: 2 }} />
      <div className="pt-5 space-y-3">
        <div style={{ height: 28, width: '60%', backgroundColor: '#E5E0D8', borderRadius: 2 }} />
        <div style={{ height: 16, backgroundColor: '#E5E0D8', borderRadius: 2 }} />
        <div style={{ height: 16, width: '75%', backgroundColor: '#E5E0D8', borderRadius: 2 }} />
      </div>
    </div>
  );
}
