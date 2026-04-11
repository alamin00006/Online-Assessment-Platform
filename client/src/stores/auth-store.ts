import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types";

// Authentication store persists user session for the assessment client.
// It stores token, user info, loading state, and errors.
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      login: (user, token) =>
        set({ user, token, isAuthenticated: true, error: null }),
      logout: () =>
        set({ user: null, token: null, isAuthenticated: false, error: null }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
    }),
    { name: "auth-storage" },
  ),
);

