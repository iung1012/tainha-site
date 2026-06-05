import { Fish, Instagram, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-sea-dark text-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Fish className="w-6 h-6 text-sea-accent" />
              <span className="font-display font-bold text-xl">Tainha do Mar</span>
            </div>
            <p className="text-ocean-200 text-sm leading-relaxed">
              O sabor único do mar, direto para sua mesa. Tainha fresca, preparada com amor e tradição.
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="font-semibold text-sm text-ocean-200 uppercase tracking-wider mb-4">Links</p>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-ocean-200 hover:text-white transition-colors">Início</Link></li>
              <li><Link to="/#cardapio" className="text-ocean-200 hover:text-white transition-colors">Cardápio</Link></li>
              <li><Link to="/checkout" className="text-ocean-200 hover:text-white transition-colors">Comprar ingresso</Link></li>
              <li><Link to="/minha-conta" className="text-ocean-200 hover:text-white transition-colors">Minha conta</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="font-semibold text-sm text-ocean-200 uppercase tracking-wider mb-4">Contato</p>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-ocean-200">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span>contato@tainhadomar.com.br</span>
              </li>
              <li className="flex items-center gap-2 text-ocean-200">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>(48) 99999-0000</span>
              </li>
              <li className="flex items-center gap-2 text-ocean-200 hover:text-white transition-colors cursor-pointer">
                <Instagram className="w-4 h-4 flex-shrink-0" />
                <span>@tainhadomar</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-sea border-opacity-30 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-ocean-300 text-xs">© {new Date().getFullYear()} Tainha do Mar. Todos os direitos reservados.</p>
          <p className="text-ocean-300 text-xs">Pagamentos processados com segurança via Syncpay</p>
        </div>
      </div>
    </footer>
  );
}
