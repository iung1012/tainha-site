import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Fish, Clock, CheckCircle, Star } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api, { formatBRL } from '../lib/api';

interface Product { id: number; name: string; description: string; price: number; image_url: string; }

function useReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
      }),
      { threshold: 0.07, rootMargin: '0px 0px -30px 0px' }
    );
    document.querySelectorAll('[data-reveal],[data-reveal-stagger]').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

const MARQUEE_TEXT = Array(6).fill(
  'TAINHA DO MAR · SANTA CATARINA · TEMPORADA 2025 · PEIXE FRESCO · GRELHADO NA BRASA · '
).join('');

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  useReveal();
  useEffect(() => { api.get('/products').then(r => setProducts(r.data)).catch(() => {}); }, []);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FAFCFF' }}>
      <Navbar overlay />

      {/* ══════════════════════════════════════════════
          HERO — foto em destaque, texto sobreposto
      ══════════════════════════════════════════════ */}
      <section className="relative min-h-[100svh] flex flex-col justify-end overflow-hidden">

        {/* Foto de fundo — visível e real */}
        <img
          src="https://images.unsplash.com/photo-1559847844-5315695dadae?w=1920&q=85"
          alt="Tainha grelhada na brasa"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Camadas de gradiente para legibilidade */}
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(2,30,80,0.97) 0%, rgba(2,30,80,0.7) 40%, rgba(2,30,80,0.25) 75%, transparent 100%)' }} />
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to right, rgba(2,30,80,0.6) 0%, transparent 60%)' }} />

        {/* Conteúdo */}
        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 sm:px-12 pt-28 pb-0">
          <div className="max-w-3xl pb-16 sm:pb-24">
            <p className="text-white/50 text-[10px] tracking-[0.28em] uppercase mb-5">
              Santa Catarina · Temporada 2025
            </p>
            <h1 className="font-display font-bold text-white leading-[0.88] tracking-[-0.03em]"
              style={{ fontSize: 'clamp(3.5rem, 10vw, 10rem)' }}>
              O Melhor Prato<br />
              <span className="italic" style={{ color: '#90E0EF' }}>de Tainha.</span>
            </h1>
            <p className="mt-6 sm:mt-8 text-white/55 text-base sm:text-lg leading-relaxed max-w-lg">
              Tainha fresca da lagoa, grelhada na brasa com técnica e tradição catarinense.
              Garanta já o seu ingresso e viva essa experiência.
            </p>

            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Link to="/checkout"
                className="inline-flex items-center gap-2 font-bold text-sm tracking-widest uppercase px-8 py-4 transition-all hover:brightness-110 active:scale-95"
                style={{ backgroundColor: '#0077B6', color: '#ffffff' }}>
                Garantir meu ingresso <ArrowUpRight className="w-4 h-4" />
              </Link>
              <a href="#cardapio"
                className="inline-flex items-center gap-2 font-semibold text-sm px-6 py-4 transition-all"
                style={{ border: '1px solid rgba(255,255,255,0.25)', color: 'rgba(255,255,255,0.75)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
                onMouseLeave={e => (e.currentTarget.style.background = '')}>
                Ver cardápio
              </a>
            </div>

            {/* Social proof inline */}
            <div className="mt-10 flex items-center gap-4">
              <div className="flex">
                {['bg-blue-400','bg-blue-500','bg-blue-600'].map((c,i) => (
                  <div key={i} className={`w-8 h-8 rounded-full ${c} border-2 border-blue-900 -ml-2 first:ml-0`} />
                ))}
              </div>
              <div>
                <div className="flex text-yellow-400">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 fill-yellow-400" />)}
                </div>
                <p className="text-white/40 text-xs mt-0.5">+500 ingressos vendidos nesta temporada</p>
              </div>
            </div>
          </div>

          {/* Marquee */}
          <div className="overflow-hidden border-t py-3" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
            <div className="animate-marquee whitespace-nowrap inline-block"
              style={{ color: 'rgba(255,255,255,0.15)', fontSize: '10px', letterSpacing: '0.22em' }}>
              {MARQUEE_TEXT}
            </div>
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ lineHeight: 0 }}>
          <svg viewBox="0 0 1440 56" fill="none" xmlns="http://www.w3.org/2000/svg"
            style={{ display: 'block', width: '100%', height: 56 }} preserveAspectRatio="none">
            <path d="M0 28 C360 56 720 0 1080 28 C1260 42 1380 14 1440 28 L1440 56 L0 56 Z"
              fill="#FAFCFF" />
          </svg>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          FACTS STRIP
      ══════════════════════════════════════════════ */}
      <section style={{ backgroundColor: '#FAFCFF' }} className="py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px" style={{ background: 'rgba(13,27,42,0.08)' }}
            data-reveal-stagger>
            {[
              { icon: Fish,        label: 'Peixe fresco',      text: 'Capturado diariamente. Zero congelado, zero atalho.' },
              { icon: Clock,       label: 'Grelhado na hora',  text: 'Sai da brasa para o seu prato. Cada ingresso reserva seu lugar.' },
              { icon: CheckCircle, label: 'Reserva garantida', text: 'Pague online, chegue tranquilo. Sem fila, sem surpresas.' },
            ].map(({ icon: Icon, label, text }) => (
              <div key={label} style={{ backgroundColor: '#FAFCFF' }} className="px-8 py-10">
                <Icon className="w-6 h-6 mb-4" style={{ color: '#0077B6' }} />
                <h3 className="font-display font-bold text-xl mb-2" style={{ color: '#0D1B2A' }}>{label}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(13,27,42,0.45)' }}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          ABOUT — split screen com foto grande e visível
      ══════════════════════════════════════════════ */}
      <section style={{ backgroundColor: '#EAF4FF' }} className="overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 min-h-[560px]">

          {/* Foto */}
          <div className="relative overflow-hidden min-h-[400px] lg:min-h-0">
            <img
              src="https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=900&q=85"
              alt="Tainha sendo preparada"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Texto */}
          <div className="px-10 sm:px-16 py-16 sm:py-20 flex flex-col justify-center" data-reveal>
            <p className="text-[10px] tracking-[0.25em] uppercase mb-6" style={{ color: '#0077B6' }}>Nossa história</p>
            <h2 className="font-display font-bold leading-[0.92] tracking-[-0.025em] mb-6"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: '#0D1B2A' }}>
              A tainha é mais<br />
              do que um peixe.<br />
              <span className="italic" style={{ color: '#0077B6' }}>É tradição.</span>
            </h2>
            <p className="text-sm sm:text-base leading-relaxed mb-10 max-w-md"
              style={{ color: 'rgba(13,27,42,0.5)' }}>
              Cada prato carrega décadas de tradição da pesca artesanal de Santa Catarina.
              Sem congelados, sem intermediários — direto da lagoa para a brasa, preparado na hora.
            </p>
            <div className="grid grid-cols-2 gap-8 pt-8" style={{ borderTop: '1px solid rgba(13,27,42,0.1)' }}>
              {[['100%', 'Peixe fresco'], ['Artesanal', 'Captura diária']].map(([v, l]) => (
                <div key={l}>
                  <p className="font-display font-bold text-3xl" style={{ color: '#023E8A' }}>{v}</p>
                  <p className="text-[10px] tracking-[0.15em] uppercase mt-1" style={{ color: 'rgba(13,27,42,0.35)' }}>{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          CARDÁPIO — cards grandes com foto em destaque
      ══════════════════════════════════════════════ */}
      <section id="cardapio" style={{ backgroundColor: '#FAFCFF' }} className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">

          <div className="flex items-end justify-between mb-12" data-reveal>
            <div>
              <p className="text-[10px] tracking-[0.25em] uppercase mb-3" style={{ color: '#0077B6' }}>Cardápio</p>
              <h2 className="font-display font-bold leading-[0.9] tracking-[-0.025em]"
                style={{ fontSize: 'clamp(2.5rem, 5vw, 5rem)', color: '#0D1B2A' }}>
                Escolha o<br /><span className="italic" style={{ color: '#0077B6' }}>seu prato.</span>
              </h2>
            </div>
            <Link to="/checkout"
              className="hidden sm:inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase px-6 py-3 transition-colors"
              style={{ border: '1px solid rgba(13,27,42,0.15)', color: 'rgba(13,27,42,0.5)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor='#0077B6'; (e.currentTarget as HTMLElement).style.color='#0077B6'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor='rgba(13,27,42,0.15)'; (e.currentTarget as HTMLElement).style.color='rgba(13,27,42,0.5)'; }}>
              Ver todos <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-20" style={{ color: 'rgba(13,27,42,0.2)' }}>
              <Fish className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Carregando cardápio...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" data-reveal-stagger>
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          FOTO ATMOSFÉRICA — seção imersiva
      ══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ minHeight: 420 }}>
        <img
          src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=85"
          alt="Experiência gastronômica"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, rgba(2,62,138,0.88) 0%, rgba(0,119,182,0.65) 100%)' }} />
        <div className="relative z-10 max-w-7xl mx-auto px-8 sm:px-12 py-24 sm:py-32">
          <div className="max-w-2xl" data-reveal>
            <p className="text-[10px] tracking-[0.25em] uppercase mb-6" style={{ color: 'rgba(202,240,248,0.7)' }}>
              Por que reservar?
            </p>
            <blockquote className="font-display font-bold italic text-white leading-[0.92] tracking-[-0.025em]"
              style={{ fontSize: 'clamp(1.8rem, 4vw, 3.8rem)' }}>
              "A tainha tem época. Quando acabar, acabou.
              <span style={{ color: '#CAF0F8' }}> Não perca a temporada."</span>
            </blockquote>
            <Link to="/checkout"
              className="mt-10 inline-flex items-center gap-2 font-bold text-xs tracking-widest uppercase px-8 py-4"
              style={{ backgroundColor: '#ffffff', color: '#023E8A' }}>
              Comprar ingresso <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          COMO FUNCIONA
      ══════════════════════════════════════════════ */}
      <section id="como-funciona" style={{ backgroundColor: '#EAF4FF' }} className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-8 sm:px-12">
          <div className="text-center mb-16" data-reveal>
            <p className="text-[10px] tracking-[0.25em] uppercase mb-3" style={{ color: '#0077B6' }}>Simples assim</p>
            <h2 className="font-display font-bold leading-tight tracking-[-0.025em]"
              style={{ fontSize: 'clamp(2rem, 4vw, 4rem)', color: '#0D1B2A' }}>
              Em três passos.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-0 sm:divide-x divide-ink/10" data-reveal-stagger>
            {[
              { n:'01', t:'Compre online',     b:'Escolha o prato, informe seus dados e pague via PIX. Leva menos de dois minutos.' },
              { n:'02', t:'Receba no email',   b:'QR Code enviado na confirmação. Sem espera, sem burocracia.' },
              { n:'03', t:'Chegue e aproveite',b:'Mostre o QR Code na entrada. Sente-se. Aproveite o melhor da temporada.' },
            ].map(({ n, t, b }) => (
              <div key={n} className="text-center sm:px-12 first:pl-0 last:pr-0">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-6"
                  style={{ backgroundColor: '#0077B6', color: '#ffffff' }}>
                  <span className="font-display font-bold text-lg">{n}</span>
                </div>
                <h3 className="font-display font-bold text-xl mb-3" style={{ color: '#0D1B2A' }}>{t}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(13,27,42,0.45)' }}>{b}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 text-center">
            <Link to="/checkout"
              className="inline-flex items-center gap-2 font-bold text-sm tracking-widest uppercase px-10 py-4"
              style={{ backgroundColor: '#0077B6', color: '#ffffff' }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.backgroundColor = '#023E8A')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.backgroundColor = '#0077B6')}>
              Comprar meu ingresso agora <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          DEPOIMENTOS
      ══════════════════════════════════════════════ */}
      <section style={{ backgroundColor: '#FAFCFF' }} className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <div className="text-center mb-14" data-reveal>
            <p className="text-[10px] tracking-[0.25em] uppercase mb-3" style={{ color: '#0077B6' }}>O que dizem</p>
            <h2 className="font-display font-bold" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', color: '#0D1B2A' }}>
              Quem foi, aprovou.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6" data-reveal-stagger>
            {[
              { q: 'Nunca comi uma tainha tão fresca. A grelha deixa um sabor que não tem igual. Já reservei para o ano que vem.', name: 'Carolina M.', city: 'Florianópolis, SC' },
              { q: 'O processo foi rapidíssimo — paguei no PIX e recebi o ingresso em menos de um minuto no email. Perfeito.', name: 'Rafael T.', city: 'Joinville, SC' },
              { q: 'Tradição de verdade. Levei minha família inteira e todos adoraram. O Combo Família vale muito a pena!', name: 'Dona Lurdes', city: 'Laguna, SC' },
            ].map(({ q, name, city }) => (
              <div key={name} className="p-8 flex flex-col gap-6" style={{ backgroundColor: '#EAF4FF' }}>
                <div className="flex text-yellow-400">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-yellow-400" />)}
                </div>
                <p className="font-display italic leading-snug text-lg flex-1" style={{ color: '#0D1B2A' }}>"{q}"</p>
                <div>
                  <p className="font-semibold text-sm" style={{ color: '#0D1B2A' }}>{name}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(13,27,42,0.35)' }}>{city}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          CTA FINAL
      ══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden py-24 sm:py-36"
        style={{ background: 'linear-gradient(135deg, #023E8A 0%, #0077B6 50%, #0096C7 100%)' }}>
        <div className="absolute inset-0 opacity-10">
          <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920&q=50"
            alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-8 sm:px-12 text-center">
          <p className="text-[10px] tracking-[0.3em] uppercase mb-5" style={{ color: 'rgba(202,240,248,0.7)' }}>
            Vagas limitadas
          </p>
          <h2 className="font-display font-bold text-white leading-[0.9] tracking-[-0.03em] mb-6"
            style={{ fontSize: 'clamp(2.5rem, 7vw, 7rem)' }}>
            Não perca<br /><span className="italic" style={{ color: '#CAF0F8' }}>a temporada.</span>
          </h2>
          <p className="text-white/55 max-w-md mx-auto mb-10 leading-relaxed">
            A tainha tem época. Garanta já o seu ingresso e viva essa experiência gastronômica única.
          </p>
          <Link to="/checkout"
            className="inline-flex items-center gap-3 font-bold text-sm tracking-widest uppercase px-10 py-5 transition-all hover:brightness-90"
            style={{ backgroundColor: '#ffffff', color: '#023E8A' }}>
            Comprar ingresso <ArrowUpRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

/* ══ Componente do card de produto ══ */
function ProductCard({ product: p }: { product: Product }) {
  return (
    <div className="group relative overflow-hidden" style={{ borderRadius: 4 }}>
      {/* Imagem grande e visível */}
      <div className="relative overflow-hidden" style={{ height: 460 }}>
        {p.image_url ? (
          <img
            src={p.image_url}
            alt={p.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: '#EAF4FF' }}>
            <Fish className="w-16 h-16" style={{ color: 'rgba(0,119,182,0.3)' }} />
          </div>
        )}

        {/* Gradiente para legibilidade do texto */}
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(2,30,80,0.92) 0%, rgba(2,30,80,0.4) 50%, transparent 100%)' }} />

        {/* Conteúdo sobre a foto */}
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
          <h3 className="font-display font-bold text-white mb-2"
            style={{ fontSize: 'clamp(1.25rem, 2vw, 1.6rem)' }}>
            {p.name}
          </h3>
          <p className="text-white/55 text-sm leading-relaxed mb-5 line-clamp-2 font-display italic">
            {p.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="font-display font-bold text-2xl text-white">{formatBRL(p.price)}</span>
            <Link
              to={`/checkout?product=${p.id}`}
              className="inline-flex items-center gap-2 font-bold text-[11px] tracking-widest uppercase px-5 py-3 transition-all hover:brightness-110"
              style={{ backgroundColor: '#0077B6', color: '#ffffff' }}>
              Comprar <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
