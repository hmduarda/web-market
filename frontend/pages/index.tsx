"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import api from "@/lib/api";
import { useAuthStore } from "@/stores/useAuthStore";
import { useCartStore } from "@/stores/useCartStore";
import ProductCard from "@/components/ProductCard";
import CategoryFilter from "@/components/CategoryFilter";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
}

interface Category {
  _id: string;
  name: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const { token } = useAuthStore();
  const { addToCart } = useCartStore();
  const router = useRouter();

  useEffect(() => {
    api
      .get("/category")
      .then((res) => setCategories(res.data))
      .catch(() => toast.error("Erro ao carregar categorias"));
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = selectedCategory
          ? await api.get("/products/by-category", {
              params: { categories: selectedCategory },
            })
          : await api.get("/products");

        setProducts(response.data);
      } catch (error) {
        setProducts([]);
        toast.error("Erro ao carregar produtos");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  const handleAddToCart = async (productId: string) => {
    if (!token) {
      toast.info("Faça login para adicionar ao carrinho");
      router.push("/login");
      return;
    }
    try {
      await addToCart(productId);
      toast.success("Produto adicionado ao carrinho!");
    } catch {
      toast.error("Erro ao adicionar produto");
    }
  };

  const filtered = products;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <section className="mb-6">
        <h1 className="text-2xl font-bold mb-4" style={{ color: "var(--text-dark)" }}>
          Novidades em Moda
        </h1>
        {categories.length > 0 && (
          <CategoryFilter
            categories={categories}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
        )}
      </section>

      {loading ? (
        <p className="text-center py-12" style={{ color: "var(--text-muted)" }}>Carregando...</p>
      ) : filtered.length === 0 ? (
        <p className="text-center py-12" style={{ color: "var(--text-muted)" }}>Nenhum produto encontrado.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map((product) => (
            <ProductCard key={product._id} product={product} onAddToCart={handleAddToCart} />
          ))}
        </div>
      )}
    </div>
  );
}
