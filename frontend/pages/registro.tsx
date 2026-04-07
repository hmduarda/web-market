"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { toast } from "react-toastify";
import { useAuthStore } from "@/stores/useAuthStore";

export default function RegistroPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(name, email, password);
      toast.success("Conta criada! Faça login.");
      router.push("/login");
    } catch {
      toast.error("Erro ao criar conta. Tente outro email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm p-6 rounded-lg border flex flex-col gap-4"
        style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-light)" }}
      >
        <h1 className="text-xl font-bold text-center" style={{ color: "var(--text-dark)" }}>
          Criar Conta
        </h1>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium" style={{ color: "var(--text-dark)" }}>Nome</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="px-3 py-2 rounded-md border text-sm outline-none"
            style={{ borderColor: "var(--border-light)", backgroundColor: "var(--bg-input)" }}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium" style={{ color: "var(--text-dark)" }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="px-3 py-2 rounded-md border text-sm outline-none"
            style={{ borderColor: "var(--border-light)", backgroundColor: "var(--bg-input)" }}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium" style={{ color: "var(--text-dark)" }}>Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="px-3 py-2 rounded-md border text-sm outline-none"
            style={{ borderColor: "var(--border-light)", backgroundColor: "var(--bg-input)" }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="py-2 rounded-lg text-sm font-medium cursor-pointer disabled:opacity-50"
          style={{ backgroundColor: "var(--btn-cart)", color: "var(--text-dark)" }}
        >
          {loading ? "Criando..." : "Cadastrar"}
        </button>

        <p className="text-sm text-center" style={{ color: "var(--text-muted)" }}>
          Já tem conta?{" "}
          <Link href="/login" style={{ color: "var(--text-link)" }} className="font-medium">
            Entrar
          </Link>
        </p>
      </form>
    </div>
  );
}
