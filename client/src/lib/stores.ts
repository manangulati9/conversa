import { create } from "zustand";
import { Message, User } from "@/lib/utils";
import decode from "jwt-decode";

interface UserState {
  user: User;
  token: string | null;
  setUser: (d: User) => void;
  setToken: (s: string) => void;
  logout: () => void;
}

interface ChatState {
  username: string;
  contact: string;
  messages: Message[];
  setContact: (s: string) => void;
  setUsername: (s: string) => void;
  setMessages: (m: Message[]) => void;
  addMessage: (m: Message) => void;
}

const token = localStorage.getItem("token");
let username: string;
if (token) {
  const decoded: { name: string; email: string } = decode(token);
  username = decoded.name;
}

export const useUserStore = create<UserState>((set) => ({
  user: {
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    token: "",
  },
  token: token,
  setUser: (userData: User) => set({ user: userData }),
  setToken: (s: string) => set({ token: s }),
  logout: () => {
    set({ token: null });
    localStorage.removeItem("token");
  },
}));

export const useChatStore = create<ChatState>((set) => ({
  username: username,
  contact: "Yoru",
  messages: [],
  setContact: (s: string) => set({ contact: s }),
  setUsername: (s: string) => set({ username: s }),
  setMessages: (m: Message[]) => set({ messages: m }),
  addMessage: (m: Message) =>
    set((state) => ({ messages: [...state.messages, m] })),
}));
