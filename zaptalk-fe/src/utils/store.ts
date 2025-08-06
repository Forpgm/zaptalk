import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../types/user.type";
import { clearLocalStorage } from "./auth";

export interface AuthState {
  isAuthenticated: boolean;
  profile: User | null;
  access_token: string | null;
  session_id: string | null;
  setAuthenticated: (
    profile: User,
    access_token: string,
    session_id: string
  ) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      profile: null,
      access_token: null,
      session_id: null,

      setAuthenticated: (profile, access_token, session_id) => {
        set({ isAuthenticated: true, profile, access_token, session_id });
      },

      logout: () => {
        clearLocalStorage();
        set({
          isAuthenticated: false,
          profile: null,
          access_token: null,
          session_id: null,
        });
      },
    }),
    {
      name: "auth",
    }
  )
);
