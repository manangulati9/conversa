import { create } from "zustand";
import { User } from "@/lib/utils";

interface UserState {
  user: User;
  setUser: (d: User) => void;
}

interface TokenState {
  token: string | null;
  settoken: (s: string) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: {
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    token: "",
  },
  setUser: (userData: User) => set({ user: userData }),
}));

export const useToken = create<TokenState>((set) => ({
  token: localStorage.getItem("token"),
  settoken: (s: string) => set({ token: s }),
  logout: () => set({ token: null }),
}));
