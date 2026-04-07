"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuthStore } from "@/stores/useAuthStore";
import api from "@/lib/api";
import OrderCard from "@/components/OrderCard";
import { Package } from "lucide-react";
import Link from "next/link";

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

export default function PedidosPage() {
  const { token } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }
    api.get("/orders")
      .then(({ data }) => setOrders(data))
      .finally(() => setLoading(false));
  }, [token, router]);

  if (loading) {
    return <p className="text-center py-12" style={{ color: "var(--text-muted)" }}>Carregando...</p>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6" style={{ color: "var(--text-dark)" }}>
        Meus Pedidos
      </h1>

      {orders.length === 0 ? (
        <div className="text-center py-16 flex flex-col items-center gap-4">
          <Package size={48} style={{ color: "var(--text-muted)" }} />
          <p style={{ color: "var(--text-muted)" }}>Você ainda não fez nenhum pedido</p>
          <Link
            href="/"
            className="px-4 py-2 rounded-lg text-sm font-medium"
            style={{ backgroundColor: "var(--btn-cart)", color: "var(--text-dark)" }}
          >
            Ir às compras
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
