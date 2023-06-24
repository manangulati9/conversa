import { create } from "zustand";
import { Contact, Message, User, getUserData } from "@/lib/utils";

import { RefObject } from "react";

interface StoreType {
  name: string;
  username: string;
  contactName: string;
  contactUsername: string;
  messages: Message[];
  contacts: Contact[];
  token: string;
  initStates: (data: User) => void;
  setToken: (t: string) => void;
  setContacts: (c: Contact[]) => void;
  addContact: (c: Contact) => void;
  setContactName: (s: string) => void;
  setContactUsername: (s: string) => void;
  setName: (s: string) => void;
  setUsername: (s: string) => void;
  setMessages: (m: Message[]) => void;
  addMessage: (m: Message) => void;
}

export const useStore = create<StoreType>((set) => ({
  name: "",
  username: "",
  contactName: "",
  contactUsername: "",
  contacts: [],
  messages: [],
  token: "",
  initStates: (userData: User) => {
    set({
      name: userData.name,
      username: userData.username,
    });
    if (userData.contacts.length !== 0) {
      set({
        contactName: userData.contacts[0].name,
        contactUsername: userData.contacts[0].username,
        contacts: userData.contacts,
      });
    }
  },
  setToken: (t: string) => set({ token: t }),
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
}));
