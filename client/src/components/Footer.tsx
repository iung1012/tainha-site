import { Link } from 'react-router-dom';
import { Fish, Instagram, Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#0D1B2A' }}>
      <div className="max-w-7xl mx-auto px-8 sm:px-12 py-16 sm:py-20">

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 pb-14"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>

          {/* Marca */}
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <Fish className="w-5 h-5" style={{ color: '#48CAE4' }} />
              <span className="font-display font-bold text-xl text-white">Tainha do Mar</span>
            </div>
            <p className="text-[10px] tracking-[0.2em] uppercase mb-5" style={{ color: '#48CAE4' }}>
              Santa Catarina, Brasil
            </p>
            <p className="text-sm leading-relaxed max-w-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
              Tradição catarinense de prato em prato. Peixe fresco, grelhado na brasa, sem enrolação.
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="text-[10px] tracking-[0.2em] uppercase mb-5" style={{ color: 'rgba(255,255,255,0.2)' }}>Navegação</p>
            <ul className="space-y-3 text-sm">
              {[['/', 'Início'], ['/#cardapio', 'Cardápio'], ['/checkout', 'Comprar ingresso'], ['/minha-conta', 'Minha conta'], ['/admin', 'Admin']].map(([href, label]) => (
                <li key={href}>
                  <Link to={href} className="transition-colors" style={{ color: 'rgba(255,255,255,0.3)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contato */}
          <div>
            <p className="text-[10px] tracking-[0.2em] uppercase mb-5" style={{ color: 'rgba(255,255,255,0.2)' }}>Contato</p>
            <ul className="space-y-3 text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>
              <li className="flex items-center gap-2"><Mail className="w-4 h-4 flex-shrink-0" style={{ color: '#48CAE4' }} />contato@tainhadomar.com.br</li>
              <li className="flex items-center gap-2"><Phone className="w-4 h-4 flex-shrink-0" style={{ color: '#48CAE4' }} />(48) 99999-0000</li>
              <li className="flex items-center gap-2"><Instagram className="w-4 h-4 flex-shrink-0" style={{ color: '#48CAE4' }} />@tainhadomar</li>
            </ul>
            <div className="mt-8">
              <p className="text-[10px] tracking-[0.18em] uppercase mb-1.5" style={{ color: 'rgba(255,255,255,0.15)' }}>Pagamentos</p>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>PIX via Syncpay · Seguro e instantâneo</p>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[10px] tracking-[0.12em] uppercase" style={{ color: 'rgba(255,255,255,0.15)' }}>
            © {new Date().getFullYear()} Tainha do Mar · Todos os direitos reservados
          </p>
          <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.1)' }}>
            Feito com amor em Santa Catarina 🇧🇷
          </p>
        </div>
      </div>
    </footer>
  );
}
