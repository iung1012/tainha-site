import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-ink border-t border-white/[0.06]">
      <div className="max-w-[1400px] mx-auto px-8 sm:px-12 py-16 sm:py-20">

        {/* Top */}
        <div className="grid grid-cols-1 sm:grid-cols-[2fr_1fr_1fr] gap-12 mb-16 pb-16 border-b border-white/[0.06]">
          <div>
            <p className="font-display font-bold text-parch text-xl mb-1">Tainha do Mar</p>
            <p className="text-white/20 text-[10px] tracking-[0.2em] uppercase mb-6">Santa Catarina, Brasil</p>
            <p className="text-white/25 text-sm leading-relaxed max-w-xs">
              Tradição catarinense de prato em prato. Peixe fresco, grelhado na brasa, sem enrolação.
            </p>
          </div>

          <div>
            <p className="text-white/20 text-[10px] tracking-[0.2em] uppercase mb-5">Navegação</p>
            <ul className="space-y-3">
              {[['/', 'Início'], ['/#cardapio', 'Cardápio'], ['/checkout', 'Comprar ingresso'], ['/login', 'Entrar'], ['/admin', 'Admin']].map(([href, label]) => (
                <li key={href}>
                  <Link to={href} className="text-white/30 hover:text-parch text-sm transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-white/20 text-[10px] tracking-[0.2em] uppercase mb-5">Contato</p>
            <ul className="space-y-3 text-sm">
              <li><a href="mailto:contato@tainhadomar.com.br" className="text-white/30 hover:text-parch transition-colors flex items-center gap-1.5">Email <ArrowUpRight className="w-3 h-3" /></a></li>
              <li><a href="https://instagram.com/tainhadomar" className="text-white/30 hover:text-parch transition-colors flex items-center gap-1.5">Instagram <ArrowUpRight className="w-3 h-3" /></a></li>
              <li><a href="tel:+5548999990000" className="text-white/30 hover:text-parch transition-colors">(48) 99999-0000</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-white/15 text-[10px] tracking-[0.15em] uppercase">
            © {new Date().getFullYear()} Tainha do Mar · Todos os direitos reservados
          </p>
          <p className="text-white/12 text-[10px] tracking-[0.12em] uppercase">
            Pagamentos via Syncpay · Hospedado no Railway
          </p>
        </div>
      </div>
    </footer>
  );
}
