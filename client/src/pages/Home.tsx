import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowDown, Check } from 'lucide-react';
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
    <div className="min-h-screen flex flex-col bg-cream-light">
      <Navbar overlay />

      {/* ─── HERO ─── */}
      <section className="relative min-h-screen bg-ink flex flex-col justify-end overflow-hidden">
        {/* Background photo */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1559847844-5315695dadae?w=1920&q=80"
            alt="Tainha grelhada"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/75 to-ink/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/60 via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 sm:px-10 pb-16 sm:pb-24 pt-32">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10">

            {/* Left: headline */}
            <div className="max-w-2xl">
              <p className="section-label text-gold mb-5">
                Santa Catarina · Temporada 2025
              </p>
              <h1 className="font-display font-bold leading-[0.88] text-cream-light"
                style={{ fontSize: 'clamp(4.5rem, 13vw, 12rem)' }}>
                TAINHA
              </h1>
              <h1 className="font-display font-bold italic leading-[0.88] text-gold"
                style={{ fontSize: 'clamp(4.5rem, 13vw, 12rem)' }}>
                do Mar.
              </h1>
              <p className="mt-7 text-cream/55 text-base sm:text-lg leading-relaxed max-w-md text-balance">
                O prato mais esperado do ano. Tainha fresca da lagoa, grelhada na brasa
                com técnica e tradição catarinense.
              </p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-10">
                <Link to="/checkout" className="btn-gold">
                  Garantir meu ingresso <ArrowRight className="w-4 h-4" />
                </Link>
                <a href="#cardapio" className="btn-outline-cream text-xs">
                  Ver cardápio
                </a>
              </div>
            </div>

            {/* Right: price callout */}
            <div className="lg:text-right flex-shrink-0 flex lg:flex-col gap-8 lg:gap-4">
              <div>
                <p className="text-cream/35 text-xs tracking-caps uppercase mb-1">A partir de</p>
                <p className="font-display text-4xl font-bold text-cream">R$ 85,00</p>
                <p className="text-cream/35 text-xs mt-0.5">por prato</p>
              </div>
              <div>
                <p className="text-cream/35 text-xs tracking-caps uppercase mb-1">Disponível</p>
                <p className="text-cream text-sm font-medium">Enquanto durar</p>
                <p className="text-cream/35 text-xs">pagamento via PIX</p>
              </div>
            </div>
          </div>

          {/* Scroll cue */}
          <div className="mt-16 hidden sm:flex items-center gap-3 text-cream/25">
            <div className="w-px h-10 bg-cream/20" />
            <span className="text-xs tracking-caps uppercase">Rolar</span>
          </div>
        </div>
      </section>

      {/* ─── MANIFESTO ─── */}
      <section className="bg-cream-light overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <div className="grid lg:grid-cols-2 gap-0 min-h-[520px]">

            {/* Text */}
            <div className="flex flex-col justify-center py-20 lg:pr-16">
              <span className="section-label">Nossa história</span>
              <blockquote className="font-display text-fluid-lg font-bold leading-tight text-ink mt-2">
                "A tainha é mais do<br />que um peixe.
                <span className="italic text-gold"> É o mês<br />de junho, é a lagoa,<br />é a brasa ao pôr do sol."</span>
              </blockquote>
              <p className="mt-8 text-ink/55 leading-relaxed max-w-sm">
                Cada prato carrega décadas de tradição catarinense. A tainha é capturada fresca,
                limpa e grelhada na hora — sem congelados, sem enrolação.
              </p>
              <div className="mt-10 flex items-center gap-5">
                <div className="w-10 h-px bg-gold" />
                <span className="text-xs tracking-caps uppercase text-ink/40">Desde a lagoa até sua mesa</span>
              </div>
            </div>

            {/* Image */}
            <div className="relative min-h-[360px] lg:min-h-0 -mx-6 sm:-mx-0">
              <img
                src="https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=900&q=85"
                alt="Tainha grelhada"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-cream-light/60 to-transparent lg:bg-none" />
            </div>
          </div>
        </div>
      </section>

      {/* ─── CARDÁPIO ─── */}
      <section id="cardapio" className="bg-ink py-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <div className="flex items-end justify-between mb-14">
            <div>
              <span className="section-label">Cardápio</span>
              <h2 className="font-display text-fluid-xl font-bold text-cream leading-tight">
                Escolha o seu<br /><span className="italic text-gold">prato.</span>
              </h2>
            </div>
            <Link to="/checkout" className="hidden sm:inline-flex btn-outline-cream text-xs">
              Ver todos <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-20 text-cream/25 text-sm tracking-caps uppercase">
              Carregando cardápio...
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-cream/10">
              {products.map((p, i) => (
                <ProductCard key={p.id} product={p} featured={i === 0} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── COMO FUNCIONA ─── */}
      <section id="como-funciona" className="bg-cream py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <div className="mb-16">
            <span className="section-label">Simples assim</span>
            <h2 className="font-display text-fluid-xl font-bold text-ink leading-tight">
              Em três<br /><span className="italic">passos.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-ink/10">
            {[
              {
                num: '01',
                title: 'Compre online',
                body: 'Escolha o prato, informe seus dados e pague via PIX. Leva menos de dois minutos.',
              },
              {
                num: '02',
                title: 'Receba no email',
                body: 'Confirmado o pagamento, seu ingresso com QR Code chega direto na sua caixa de entrada.',
              },
              {
                num: '03',
                title: 'Chegue e aproveite',
                body: 'Mostre o QR Code na entrada. Sem fila, sem estresse. Sente-se e curta o melhor da temporada.',
              },
            ].map(({ num, title, body }) => (
              <div key={num} className="sm:px-10 first:pl-0 last:pr-0 py-8 sm:py-0">
                <span className="font-display font-bold text-6xl text-ink/8 leading-none block -mb-2">
                  {num}
                </span>
                <h3 className="font-display font-bold text-xl text-ink mt-4 mb-3">{title}</h3>
                <p className="text-ink/55 text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 pt-16 border-t border-ink/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex flex-wrap gap-4">
              {['PIX instantâneo', 'Email em minutos', 'QR Code no celular', 'Sem cadastro obrigatório'].map((f) => (
                <span key={f} className="inline-flex items-center gap-2 text-sm text-ink/60">
                  <Check className="w-3.5 h-3.5 text-gold flex-shrink-0" /> {f}
                </span>
              ))}
            </div>
            <Link to="/checkout" className="btn-outline-ink flex-shrink-0">
              Comprar agora <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── DEPOIMENTOS ─── */}
      <section className="bg-ink py-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <span className="section-label text-gold">O que dizem</span>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-px bg-cream/10">
            {[
              { quote: 'Nunca comi uma tainha tão fresca. A grelha deixa um sabor que não tem igual. Já reservei para o ano que vem.', name: 'Carolina M.', city: 'Florianópolis, SC' },
              { quote: 'O processo de compra foi rapidíssimo — paguei no PIX e recebi o ingresso em menos de um minuto no email.', name: 'Rafael T.', city: 'Joinville, SC' },
              { quote: 'Tradição de verdade. Levei minha família inteira e todos amaram. O Combo Família vale muito a pena.', name: 'Dona Lurdes', city: 'Laguna, SC' },
            ].map(({ quote, name, city }) => (
              <div key={name} className="bg-ink-light p-8 flex flex-col justify-between gap-8">
                <p className="font-display italic text-cream/80 text-lg leading-snug">"{quote}"</p>
                <div>
                  <p className="text-cream font-semibold text-sm">{name}</p>
                  <p className="text-cream/35 text-xs mt-0.5">{city}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA FINAL ─── */}
      <section className="bg-gold py-24">
        <div className="max-w-4xl mx-auto px-6 sm:px-10 text-center">
          <p className="text-ink/50 text-xs tracking-caps uppercase mb-4">Vagas limitadas</p>
          <h2 className="font-display font-bold text-fluid-xl text-ink leading-tight mb-6">
            Não perca a<br /><span className="italic">temporada.</span>
          </h2>
          <p className="text-ink/60 max-w-sm mx-auto mb-10 text-sm leading-relaxed">
            A tainha tem época. Quando acabar, acabou. Garanta já o seu ingresso e viva essa experiência.
          </p>
          <Link to="/checkout"
            className="inline-flex items-center gap-3 bg-ink text-cream font-bold text-sm tracking-caps uppercase px-10 py-5 hover:bg-ink-lighter transition-colors">
            Comprar ingresso <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function ProductCard({ product: p, featured }: { product: Product; featured: boolean }) {
  return (
    <div className="group relative bg-ink-light overflow-hidden min-h-[380px] flex flex-col justify-end">
      {/* Image */}
      {p.image_url && (
        <div className="absolute inset-0">
          <img
            src={p.image_url}
            alt={p.name}
            className="w-full h-full object-cover opacity-50 group-hover:opacity-65 group-hover:scale-105 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-transparent" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 p-8">
        <h3 className="font-display font-bold text-xl text-cream leading-snug mb-2">{p.name}</h3>
        <p className="text-cream/45 text-sm leading-relaxed mb-6 line-clamp-2">{p.description}</p>
        <div className="flex items-center justify-between">
          <span className="font-display font-bold text-2xl text-gold">{formatBRL(p.price)}</span>
          <Link
            to={`/checkout?product=${p.id}`}
            className="inline-flex items-center gap-2 bg-gold text-ink text-xs font-semibold tracking-caps uppercase px-5 py-2.5 hover:bg-gold-light transition-colors"
          >
            Comprar <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
