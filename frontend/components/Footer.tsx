"use client";

import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto" style={{ backgroundColor: "var(--bg-header)", color: "var(--text-primary)" }}>
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <h3 className="text-lg font-bold mb-2" style={{ color: "var(--accent)" }}>WebMarket</h3>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Sua loja de roupas online com os melhores preços e qualidade.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Links úteis</h4>
          <ul className="flex flex-col gap-1 text-sm" style={{ color: "var(--text-muted)" }}>
            <li><Link href="/" className="hover:underline">Início</Link></li>
            <li><Link href="/carrinho" className="hover:underline">Carrinho</Link></li>
            <li><Link href="/pedidos" className="hover:underline">Meus Pedidos</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Redes sociais</h4>
          <ul className="flex flex-col gap-1 text-sm" style={{ color: "var(--text-muted)" }}>
            <li><a href="#" className="hover:underline">Instagram</a></li>
            <li><a href="#" className="hover:underline">Facebook</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Informações para contato</h4>
          <ul className="flex flex-col gap-2 text-sm" style={{ color: "var(--text-muted)" }}>
            <li className="flex items-center gap-2"><Phone size={14} /> (00) 0 0000-0000</li>
            <li className="flex items-center gap-2"><Mail size={14} /> contato@webmarket.com</li>
            <li className="flex items-center gap-2"><MapPin size={14} /> Campina Grande - PB</li>
          </ul>
        </div>
      </div>

      <div className="border-t px-6 py-4 text-center text-xs" style={{ borderColor: "var(--text-muted)", color: "var(--text-muted)" }}>
        © {new Date().getFullYear()} WebMarket. Todos os direitos reservados
      </div>
    </footer>
  );
}
