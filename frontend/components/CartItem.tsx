"use client";

import Image from "next/image";
import { Trash2, Plus, Minus } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface CartProduct {
  _id: string;
  name: string;
  price: number;
  image: string;
}

interface Props {
  item: {
    productId: CartProduct;
    quantity: number;
    unitPrice: number;
  };
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function CartItem({ item, onUpdateQuantity, onRemove }: Props) {
  const { productId: product, quantity, unitPrice } = item;

  return (
    <div
      className="flex gap-4 p-4 rounded-lg border"
      style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-light)" }}
    >
      <div className="relative w-24 h-24 shrink-0 rounded" style={{ backgroundColor: "var(--bg-hover)" }}>
        <Image
          src={`${API_URL}${product.image}`}
          alt={product.name}
          fill
          className="object-contain p-1"
          sizes="96px"
        />
      </div>

      <div className="flex flex-col flex-1 gap-1">
        <h3 className="text-sm font-medium" style={{ color: "var(--text-dark)" }}>
          {product.name}
        </h3>
        <span className="text-sm font-bold" style={{ color: "var(--text-price)" }}>
          {formatPrice(unitPrice)}
        </span>

        <div className="flex items-center gap-2 mt-auto">
          <button
            onClick={() => quantity > 1 && onUpdateQuantity(product._id, quantity - 1)}
            className="p-1 rounded border"
            style={{ borderColor: "var(--border-light)" }}
            disabled={quantity <= 1}
          >
            <Minus size={14} />
          </button>
          <span className="text-sm font-medium w-6 text-center">{quantity}</span>
          <button
            onClick={() => onUpdateQuantity(product._id, quantity + 1)}
            className="p-1 rounded border"
            style={{ borderColor: "var(--border-light)" }}
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      <div className="flex flex-col items-end justify-between">
        <button onClick={() => onRemove(product._id)} style={{ color: "var(--danger)" }}>
          <Trash2 size={18} />
        </button>
        <span className="text-sm font-bold" style={{ color: "var(--text-dark)" }}>
          {formatPrice(unitPrice * quantity)}
        </span>
      </div>
    </div>
  );
}
