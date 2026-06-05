import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-ink text-cream/50">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">

        {/* Top */}
        <div className="py-16 grid grid-cols-1 sm:grid-cols-3 gap-12 border-b border-cream/10">
          <div className="sm:col-span-1">
            <p className="font-display font-bold text-2xl text-cream mb-2">Tainha do Mar</p>
            <p className="text-xs tracking-caps uppercase text-gold mb-5">Santa Catarina, Brasil</p>
            <p className="text-sm leading-relaxed text-cream/40 max-w-xs">
              Tradição catarinense de prato em prato. Tainha fresca da lagoa,
              grelhada na brasa com técnica e carinho.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold tracking-caps uppercase text-cream/25 mb-5">Links</p>
            <ul className="space-y-3 text-sm">
              {[['/', 'Início'], ['/#cardapio', 'Cardápio'], ['/checkout', 'Comprar ingresso'], ['/minha-conta', 'Minha conta'], ['/admin', 'Painel admin']].map(([href, label]) => (
                <li key={href}>
                  <Link to={href} className="hover:text-cream transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold tracking-caps uppercase text-cream/25 mb-5">Contato</p>
            <ul className="space-y-3 text-sm">
              <li><a href="mailto:contato@tainhadomar.com.br" className="hover:text-cream transition-colors">contato@tainhadomar.com.br</a></li>
              <li><a href="tel:+5548999990000" className="hover:text-cream transition-colors">(48) 99999-0000</a></li>
              <li><span className="hover:text-cream transition-colors cursor-pointer">@tainhadomar</span></li>
            </ul>
            <div className="mt-8">
              <p className="text-xs font-semibold tracking-caps uppercase text-cream/25 mb-3">Pagamentos</p>
              <p className="text-xs text-cream/30">PIX · processado via Syncpay</p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-cream/20">
          <p>© {new Date().getFullYear()} Tainha do Mar. Todos os direitos reservados.</p>
          <p>Feito com amor em Santa Catarina 🇧🇷</p>
        </div>
      </div>
    </footer>
  );
}
