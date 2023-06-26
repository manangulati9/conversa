import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "axios";
import { io } from "socket.io-client";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export interface FormElements extends HTMLFormControlsCollection {
  username: HTMLInputElement;
  pwd: HTMLInputElement;
  fname: HTMLInputElement;
  lname: HTMLInputElement;
  confirmPwd: HTMLInputElement;
}

export interface User {
  name: string;
  username: string;
  contacts: Contact[];
  token: string;
}

export interface Message {
  sender: string;
  receiver: string;
  message: string;
  time: string;
  date: string;
}

export interface Contact {
  name: string;
  username: string;
}

export interface ChatInfo {
  contactInfo: Contact;
  messages: Message[];
}

export async function getMessages(client1: string, client2: string) {
  try {
    const res = await axios.post(process.env.NEXT_PUBLIC_GET_MESSAGES!, {
      client1: client1,
      client2: client2,
    });
    return res.data as Message[];
  } catch (error: any) {
    console.error(error);
    return null;
  }
}

export async function getUserData(username: string) {
  try {
    const res = await axios.post(process.env.NEXT_PUBLIC_GET_USER_DATA!, {
      username: username,
    });
    return res.data as User;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export function initializeSocket(newUser: string) {
  const socket = io(process.env.NEXT_PUBLIC_SOCKET_SERVER_URL!, {
    query: { newUser },
  });
  return socket;
}

export function getCurrentDate() {
  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const year = currentDate.getFullYear();
  return `${day}/${month}/${year}`;
}

export function getCurrentTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const currentTime = hours + ":" + minutes;
  return currentTime;
}
