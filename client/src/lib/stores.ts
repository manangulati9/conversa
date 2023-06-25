import { create } from "zustand";
import { ChatInfo, Contact, Message, User, getMessages } from "@/lib/utils";

interface StoreType {
  name: string;
  username: string;
  contactName: string;
  contactUsername: string;
  contacts: ChatInfo[];
  token: string;
  socket: any;
  setSocket: (s: any) => void;
  messages: () => Message[];
  initStates: (data: User) => void;
  setToken: (t: string) => void;
  setContactName: (s: string) => void;
  setContactUsername: (s: string) => void;
  setName: (s: string) => void;
  setUsername: (s: string) => void;
  setContacts: (c: ChatInfo[]) => void;
  addContact: (c: Contact) => void;
  addMessage: (m: Message) => void;
  deleteContact: (c: Contact) => void;
  deleteAllMessages: (c: Contact) => void;
  deleteMessage: (m: Message) => void;
  logout: () => void;
}

export const useStore = create<StoreType>((set, get) => ({
  name: "",
  username: "",
  contactName: "",
  contactUsername: "",
  contacts: [],
  token: "",
  socket: null,
  setSocket: (s: any) => set({ socket: s }),
  setToken: (t: string) => set({ token: t }),
  setName: (s: string) => set({ name: s }),
  setUsername: (s: string) => set({ username: s }),
  setContactName: (s: string) => set({ contactName: s }),
  setContactUsername: (s: string) => set({ contactUsername: s }),

  messages: () => {
    const contacts = get().contacts;
    const contactUsername = get().contactUsername;
    const contact = contacts.filter(
      (contact) => contact.contactInfo.username === contactUsername
    );
    return contact.length !== 0 ? contact[0].messages : [];
  },

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
        const contacts: ChatInfo[] = await Promise.all(
          userData.contacts.map(async (contact) => {
            const messages: Message[] = await getMessages(
              userData.username,
              contact.username
            );
            const chat: ChatInfo = {
              contactInfo: contact,
              messages: [],
            };
            if (messages) {
              chat.messages = messages;
            }
            return chat;
          })
        );
        set({ contacts: contacts });
      }
    }
  },

  logout: () => {
    set({
      name: "",
      username: "",
      contacts: [],
      contactName: "",
      contactUsername: "",
    });
    localStorage.removeItem("token");
  },

  addContact: async (c: Contact) => {
    const username = get().username;
    const msgs = await getMessages(username, c.username);
    const contacts = get().contacts;
    const newContact = { contactInfo: c, messages: [] };
    if (msgs) {
      newContact.messages = msgs;
    }
    contacts.push(newContact);
    set({ contacts: contacts });
  },

  addMessage: (m: Message) => {
    const username = get().username;
    const contactUsername = get().contactUsername;
    const contactList = get().contacts;
    if (
      (m.sender === username && m.receiver === contactUsername) ||
      (m.sender === contactUsername && m.receiver === username)
    ) {
      const updatedContactList = contactList.map((c) => {
        if (c && c.contactInfo.username === contactUsername) {
          return {
            ...c,
            messages: [...c.messages, m],
          };
        }
        return c;
      });
      set({ contacts: updatedContactList });
    }
  },

  deleteContact: (c: Contact) => {
    const newContactList = get().contacts.filter((contact) => {
      return contact.contactInfo.username !== c.username;
    });
    set({
      contacts: newContactList,
      contactName:
        newContactList.length !== 0 ? newContactList[0].contactInfo.name : "",
      contactUsername:
        newContactList.length !== 0
          ? newContactList[0].contactInfo.username
          : "",
    });
  },

  deleteAllMessages: (c: Contact) => {
    const newContactList = get().contacts.map((contact) => {
      if (c.username === contact.contactInfo.username) {
        return {
          ...contact,
          messages: [],
        };
      }
      return contact;
    });
    set({ contacts: newContactList });
  },

  deleteMessage: (m: Message) => {
    const newContactList = get().contacts.map((contact) => {
      return {
        ...contact,
        messages: contact.messages.filter((msg) => {
          msg.message === m.message;
        }),
      };
    });
    set({ contacts: newContactList });
  },

  setContacts: (c: ChatInfo[]) => set({ contacts: c }),
}));
