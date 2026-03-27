"use client";

import Link from "next/link";
import { ShoppingCart, User, LogOut, Package, Search } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useCartStore } from "@/stores/useCartStore";
import { useEffect, useState } from "react";

export default function Header() {
  const { user, token, logout } = useAuthStore();
  const { items, fetchCart } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (token) fetchCart();
  }, [token, fetchCart]);

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header>
      <div className="flex items-center px-8 py-3" style={{ backgroundColor: "var(--bg-header)" }}>
        <Link href="/" className="text-2xl font-bold shrink-0" style={{ color: "var(--accent)" }}>
          WebMarket
        </Link>

        <div className="flex max-w-md ml-6">
          <input
            type="text"
            placeholder="Buscar produtos..."
            className="w-80 px-4 py-2 rounded-l-md text-sm outline-none"
            style={{ backgroundColor: "var(--bg-input)", color: "var(--text-dark)" }}
          />
          <button
            className="px-4 rounded-r-md"
            style={{ backgroundColor: "var(--accent)", color: "var(--text-dark)" }}
          >
            <Search size={18} />
          </button>
        </div>

        <div className="flex items-center gap-6 ml-auto">
          {mounted && token && user ? (
            <>
              <span className="text-xs" style={{ color: "var(--text-primary)" }}>
                Olá, <strong>{user.name.split(" ")[0]}</strong>
              </span>
              <Link href="/pedidos" style={{ color: "var(--text-primary)" }} title="Meus Pedidos">
                <Package size={20} />
              </Link>
              <button onClick={logout} style={{ color: "var(--text-primary)" }} title="Sair">
                <LogOut size={20} />
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1 text-sm"
              style={{ color: "var(--text-primary)" }}
            >
              <User size={18} />
              Entrar
            </Link>
          )}

          <Link href="/carrinho" className="relative" style={{ color: "var(--text-primary)" }}>
            <ShoppingCart size={24} />
            {mounted && totalItems > 0 && (
              <span
                className="absolute -top-2 -right-2 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                style={{ backgroundColor: "var(--btn-buy)", color: "var(--text-dark)" }}
              >
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
