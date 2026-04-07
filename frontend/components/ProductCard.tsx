"use client";

import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
}

interface Props {
  product: Product;
  onAddToCart: (productId: string) => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function ProductCard({ product, onAddToCart }: Props) {
  const outOfStock = product.stock <= 0;

  return (
    <div
      className="flex flex-col rounded-lg overflow-hidden border transition-shadow hover:shadow-md"
      style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-card)" }}
    >
      <div className="relative w-full aspect-square" style={{ backgroundColor: "var(--bg-hover)" }}>
        <Image
          src={`${API_URL}${product.image}`}
          alt={product.name}
          fill
          className="object-contain p-2"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
      </div>

      <div className="flex flex-col flex-1 p-3 gap-1">
        <h3 className="text-sm font-medium line-clamp-2" style={{ color: "var(--text-dark)" }}>
          {product.name}
        </h3>
        <p className="text-xs line-clamp-2" style={{ color: "var(--text-muted)" }}>
          {product.description}
        </p>
        <span className="text-lg font-bold mt-auto" style={{ color: "var(--text-price)" }}>
          {formatPrice(product.price)}
        </span>

        {outOfStock ? (
          <span className="text-xs font-medium" style={{ color: "var(--danger)" }}>
            Indisponível
          </span>
        ) : (
          <button
            onClick={() => onAddToCart(product._id)}
            className="flex items-center justify-center gap-2 mt-1 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors"
            style={{ backgroundColor: "var(--btn-cart)", color: "var(--text-dark)" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--btn-cart-hover)")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--btn-cart)")}
          >
            <ShoppingCart size={16} />
            Adicionar
          </button>
        )}
      </div>
    </div>
  );
}
