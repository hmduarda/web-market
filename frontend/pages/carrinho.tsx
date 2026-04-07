"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useAuthStore } from "@/stores/useAuthStore";
import { useCartStore } from "@/stores/useCartStore";
import CartItem from "@/components/CartItem";
import CheckoutModal from "@/components/CheckoutModal";
import { formatPrice } from "@/lib/utils";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function CarrinhoPage() {
  const { token } = useAuthStore();
  const { items, loading, fetchCart, updateQuantity, removeItem, checkout } = useCartStore();
  const [showModal, setShowModal] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }
    fetchCart();
  }, [token, router, fetchCart]);

  const total = items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);

  const handleCheckout = async () => {
    setCheckingOut(true);
    try {
      await checkout();
      setShowModal(true);
      toast.success("Pedido realizado com sucesso!");
    } catch {
      toast.error("Erro ao finalizar pedido");
    } finally {
      setCheckingOut(false);
    }
  };

  if (loading) {
    return <p className="text-center py-12" style={{ color: "var(--text-muted)" }}>Carregando...</p>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6" style={{ color: "var(--text-dark)" }}>
        Carrinho
      </h1>

      {items.length === 0 ? (
        <div className="text-center py-16 flex flex-col items-center gap-4">
          <ShoppingBag size={48} style={{ color: "var(--text-muted)" }} />
          <p style={{ color: "var(--text-muted)" }}>Seu carrinho está vazio</p>
          <Link
            href="/"
            className="px-4 py-2 rounded-lg text-sm font-medium"
            style={{ backgroundColor: "var(--btn-cart)", color: "var(--text-dark)" }}
          >
            Continuar comprando
          </Link>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3">
            {items.map((item, i) => (
              <CartItem
                key={i}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeItem}
              />
            ))}
          </div>

          <div
            className="mt-6 p-4 rounded-lg border flex items-center justify-between"
            style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-light)" }}
          >
            <div>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                Total ({items.reduce((a, i) => a + i.quantity, 0)} itens)
              </p>
              <p className="text-xl font-bold" style={{ color: "var(--text-price)" }}>
                {formatPrice(total)}
              </p>
            </div>
            <button
              onClick={handleCheckout}
              disabled={checkingOut}
              className="px-6 py-2.5 rounded-lg text-sm font-medium cursor-pointer disabled:opacity-50"
              style={{ backgroundColor: "var(--btn-buy)", color: "var(--text-dark)" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--btn-buy-hover)")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--btn-buy)")}
            >
              {checkingOut ? "Finalizando..." : "Finalizar Compra"}
            </button>
          </div>
        </>
      )}

      <CheckoutModal open={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}
