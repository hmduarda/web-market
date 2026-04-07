"use client";

import Image from "next/image";
import { formatPrice } from "@/lib/utils";

const STATUS_LABELS: Record<string, string> = {
  pending: "Pendente",
  paid: "Pago",
  shipped: "Enviado",
  delivered: "Entregue",
  cancelled: "Cancelado",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "#f59e0b",
  paid: "#3b82f6",
  shipped: "#8b5cf6",
  delivered: "#22c55e",
  cancelled: "#ef4444",
};

interface OrderItem {
  productId: { _id: string; name: string; image: string };
  quantity: number;
  unitPrice: number;
}

interface Order {
  _id: string;
  items: OrderItem[];
  total: number;
  status: string;
  createdAt: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function OrderCard({ order }: { order: Order }) {
  const date = new Date(order.createdAt).toLocaleDateString("pt-BR");

  return (
    <div
      className="rounded-lg border p-4 flex flex-col gap-3"
      style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-light)" }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
          Pedido em {date}
        </span>
        <span
          className="text-xs font-bold px-2 py-0.5 rounded-full"
          style={{ backgroundColor: STATUS_COLORS[order.status] + "20", color: STATUS_COLORS[order.status] }}
        >
          {STATUS_LABELS[order.status] || order.status}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {order.items.map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="relative w-12 h-12 shrink-0 rounded" style={{ backgroundColor: "var(--bg-hover)" }}>
              <Image
                src={`${API_URL}${item.productId.image}`}
                alt={item.productId.name}
                fill
                className="object-contain p-0.5"
                sizes="48px"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm truncate" style={{ color: "var(--text-dark)" }}>{item.productId.name}</p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Qtd: {item.quantity} × {formatPrice(item.unitPrice)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="text-right text-sm font-bold pt-2 border-t" style={{ borderColor: "var(--border-light)", color: "var(--text-dark)" }}>
        Total: {formatPrice(order.total)}
      </div>
    </div>
  );
}
