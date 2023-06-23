import { create } from "zustand";
import { Contact, Message, User } from "@/lib/utils";
import decode from "jwt-decode";
import { RefObject } from "react";

interface UserState {
  userInfo: User;
  token: string | null;
  setUserInfo: (d: User) => void;
  logout: () => void;
}

interface ChatState {
  name: string;
  username: string;
  contactName: string;
  contactUsername: string;
  messages: Message[];
  contacts: Contact[];
  msgDivRef: RefObject<HTMLDivElement> | null;
  setContacts: (c: Contact[]) => void;
  addContact: (c: Contact) => void;
  setContactName: (s: string) => void;
  setContactUsername: (s: string) => void;
  setName: (s: string) => void;
  setUsername: (s: string) => void;
  setMessages: (m: Message[]) => void;
  addMessage: (m: Message) => void;
  setMsgDivRef: (d: RefObject<HTMLDivElement>) => void;
}

const token = localStorage.getItem("token");
let userInfo: User = {
  first_name: "",
  last_name: "",
  username: "",
  password: "",
  token: "",
  contacts: [{ name: "", username: "" }],
};
if (token) {
  const decoded: { user: User } = decode(token);
  const user = decoded.user;
  userInfo = user;
}

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
  logout: () => {
    set({ token: null });
    localStorage.removeItem("token");
  },
}));

export const useChatStore = create<ChatState>((set) => ({
  name: userInfo.first_name,
  username: userInfo.username,
  contactName: userInfo.contacts[0].name,
  contactUsername: userInfo.contacts[0].username,
  contacts: userInfo.contacts,
  messages: [],
  msgDivRef: null,
  setName: (s: string) => set({ name: s }),
  setUsername: (s: string) => set({ username: s }),
  setContactName: (s: string) => set({ contactName: s }),
  setContactUsername: (s: string) => set({ contactUsername: s }),
  setContacts: (c: Contact[]) => set({ contacts: c.sort() }),
  addContact: (c: Contact) =>
    set((state) => ({ contacts: [...state.contacts, c].sort() })),
  setMessages: (m: Message[]) => set({ messages: m.reverse() }),
  addMessage: (m: Message) =>
    set((state) => ({ messages: [m, ...state.messages] })),
  setMsgDivRef: (d: RefObject<HTMLDivElement>) => set({ msgDivRef: d }),
}));
