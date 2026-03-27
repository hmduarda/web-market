import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "@/lib/api";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,

      login: async (email, password) => {
        const { data } = await api.post("/auth/login", { email, password });
        set({ token: data.token, user: data.user });
      },

      register: async (name, email, password) => {
        await api.post("/auth/register", { name, email, password });
      },

      logout: () => {
        set({ token: null, user: null });
      },
    }),
    { name: "auth-storage" }
  )
);
