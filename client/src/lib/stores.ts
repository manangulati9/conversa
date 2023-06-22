import { create } from "zustand";
import { Contact, Message, User } from "@/lib/utils";
import decode from "jwt-decode";
import axios from "axios";

interface UserState {
  userInfo: User;
  token: string | null;
  setUserInfo: (d: User) => void;
  setToken: (s: string) => void;
  logout: () => void;
}

interface ChatState {
  name: string;
  username: string;
  contactName: string;
  contactUsername: string;
  messages: Message[];
  contacts: Contact[];
  chatHistory: Message[];
  setContacts: (c: Contact[]) => void;
  addContact: (c: Contact) => void;
  setContactName: (s: string) => void;
  setContactUsername: (s: string) => void;
  setName: (s: string) => void;
  setMessages: (m: Message[]) => void;
  addMessage: (m: Message) => void;
}

const token = localStorage.getItem("token");
let name = "";
let username = "";
if (token) {
  const decoded: { name: string; username: string } = decode(token);
  name = decoded.name;
  username = decoded.username;
}
const res = await axios.post(process.env.NEXT_PUBLIC_GET_CHAT_DATA!, {
  username,
});
let contactList: Contact[] = [];
if (Array.isArray(res.data)) contactList = res.data;

export const useUserStore = create<UserState>((set) => ({
  userInfo: {
    first_name: "",
    last_name: "",
    username: "",
    password: "",
    token: "",
    contacts: [],
  },
  token: token,
  setUserInfo: (userData: User) => set({ userInfo: userData }),
  setToken: (s: string) => set({ token: s }),
  logout: () => {
    set({ token: null });
    localStorage.removeItem("token");
  },
}));

export const useChatStore = create<ChatState>((set) => ({
  name: name,
  username: username,
  contactName: "",
  contactUsername: "",
  messages: [],
  contacts: contactList,
  chatHistory: [],
  setName: (s: string) => set({ name: s }),
  setContactName: (s: string) => set({ contactName: s }),
  setContactUsername: (s: string) => set({ contactUsername: s }),
  setContacts: (c: Contact[]) => set({ contacts: c.sort() }),
  addContact: (c: Contact) =>
    set((state) => ({ contacts: [...state.contacts, c].sort() })),
  setMessages: (m: Message[]) => set({ messages: m.reverse() }),
  addMessage: (m: Message) =>
    set((state) => ({ messages: [m, ...state.messages] })),
}));
