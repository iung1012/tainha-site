import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#0A0A0A', color: 'rgba(255,255,255,0.35)' }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-16 sm:py-20">

        <div className="grid grid-cols-1 sm:grid-cols-[2fr_1fr_1fr] gap-12 pb-12"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>

          <div>
            <p className="font-display font-light text-white mb-1" style={{ fontSize: '1.5rem' }}>Festa da Tainha 2026</p>
            <p style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', marginBottom: 16, fontFamily: 'DM Sans' }}>
              Tramandaí, Rio Grande do Sul
            </p>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.7, maxWidth: 280 }}>
              A festa mais esperada do litoral gaúcho. Tainha fresca, grelhada na brasa com carinho e tradição.
            </p>
          </div>

          <div>
            <p style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', marginBottom: 16, fontFamily: 'DM Sans' }}>Navegação</p>
            <ul style={{ fontSize: '0.875rem', lineHeight: 2 }}>
              {[['/', 'Início'], ['/#cardapio', 'Cardápio'], ['/checkout', 'Comprar ingresso'], ['/minha-conta', 'Minha conta']].map(([href, label]) => (
                <li key={href}>
                  <Link to={href} className="hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', marginBottom: 16, fontFamily: 'DM Sans' }}>Contato</p>
            <ul style={{ fontSize: '0.875rem', lineHeight: 2 }}>
              <li><a href="mailto:festivaltainha2026@pix.com.br" className="hover:text-white transition-colors">contato@tainhadomar.com.br</a></li>
              <li><a href="tel:+5548999990000" className="hover:text-white transition-colors">(48) 99999-0000</a></li>
              <li><span className="cursor-pointer hover:text-white transition-colors">@tainhadomar</span></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
          style={{ fontSize: '0.75rem' }}>
          <p>© {new Date().getFullYear()} Tainha do Mar. Todos os direitos reservados.</p>
          <p>Pagamentos via Syncpay · Hospedado no Railway</p>
        </div>
      </div>
    </footer>
  );
}
