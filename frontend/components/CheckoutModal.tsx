"use client";

import { CheckCircle, X } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CheckoutModal({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="relative rounded-xl p-8 max-w-sm w-full mx-4 text-center flex flex-col items-center gap-4"
        style={{ backgroundColor: "var(--bg-card)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-3 right-3" style={{ color: "var(--text-muted)" }}>
          <X size={20} />
        </button>

        <CheckCircle size={64} className="text-green-500" />

        <h2 className="text-xl font-bold" style={{ color: "var(--text-dark)" }}>
          Transferência Concluída!
        </h2>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Seu pedido foi realizado com sucesso. Você pode acompanhar o status em &quot;Meus Pedidos&quot;.
        </p>

        <button
          onClick={onClose}
          className="w-full py-2 rounded-lg text-sm font-medium mt-2 cursor-pointer"
          style={{ backgroundColor: "var(--btn-cart)", color: "var(--text-dark)" }}
        >
          Fechar
        </button>
      </div>
    </div>
  );
}
