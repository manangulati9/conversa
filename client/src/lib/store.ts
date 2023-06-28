import { create } from "zustand";
import {
  Contact,
  Message,
  OnlineUsers,
  User,
  addNewContactInDB,
  deletAllMessagesFromDB,
  deleteContactInDB,
  deleteMessageFromDB,
} from "@/lib/functions";

interface StoreType {
  name: string;
  username: string;
  contactName: string;
  contactUsername: string;
  contacts: Contact[];
  messages: Message[];
  token: string;
  socket: any;
  onlineUsers: OnlineUsers[];
  setOnlineUsers: (s: { username: string; socketId: string }[]) => void;
  setSocket: (s: any) => void;
  initStates: (data: User) => void;
  setToken: (t: string) => void;
  setContactName: (s: string) => void;
  setContactUsername: (s: string) => void;
  setName: (s: string) => void;
  setUsername: (s: string) => void;
  addContact: (u: string) => void;
  addMessage: (m: Message) => void;
  setMessages: (m: Message[]) => void;
  deleteContact: (s: string) => void;
  deleteAllMessages: () => void;
  deleteMessageForMe: (m: Message) => void;
}

export const useStore = create<StoreType>((set, get) => ({
  name: "",
  username: "",
  contactName: "",
  contactUsername: "",
  contacts: [],
  messages: [],
  token: "",
  socket: null,
  onlineUsers: [],

  setOnlineUsers: (s: OnlineUsers[]) => set({ onlineUsers: s }),
  setSocket: (s: any) => set({ socket: s }),
  setToken: (t: string) => set({ token: t }),
  setName: (s: string) => set({ name: s }),
  setUsername: (s: string) => set({ username: s }),
  setContactName: (s: string) => set({ contactName: s }),
  setContactUsername: (s: string) => set({ contactUsername: s }),

  initStates: async (userData: User) => {
    if (userData) {
      set({
        name: userData.name,
        username: userData.username,
      });
      if (userData.contacts.length !== 0) {
        set({
          contactName: userData.contacts[0].name,
          contactUsername: userData.contacts[0].username,
        });
        set({ contacts: userData.contacts });
      }
    }
  },

  addContact: async (u: string) => {
    const username = get().username;
    const contactUsername = get().contactUsername;
    const contact = await addNewContactInDB(username, u);
    const contacts = get().contacts;
    if (contact && !contactUsername) {
      set({
        contactUsername: contact.username,
        contactName: contact.name,
      });
    }
    if (contact) {
      contacts.push(contact);
      set({ contacts: contacts });
    }
  },

  addMessage: (m: Message) => {
    const messages = get().messages;
    set({ messages: [m, ...messages] });
  },

  deleteContact: (contactUsername: string) => {
    const username = get().username;
    const contacts = get().contacts;
    const newContactList = contacts.filter((c) => {
      return c.username !== contactUsername;
    });
    set({
      contacts: newContactList,
      contactName: newContactList.length !== 0 ? newContactList[0].name : "",
      contactUsername:
        newContactList.length !== 0 ? newContactList[0].username : "",
    });
    deleteContactInDB(username, contactUsername);
  },

  deleteAllMessages: async () => {
    const username = get().username;
    const contactUsername = get().contactUsername;
    set({ messages: [] });
    deletAllMessagesFromDB(username, contactUsername);
  },

  deleteMessageForMe: (m: Message) => {
    const username = get().username;
    const contactUsername = get().contactUsername;
    const messages = get().messages;
    const newMsgList = messages.filter((msg) => {
      return msg !== m;
    });
    set({ messages: newMsgList });
    deleteMessageFromDB(username, contactUsername, m.message);
  },

  setMessages: (m: Message[]) => set({ messages: m }),
}));
