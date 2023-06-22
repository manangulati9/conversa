import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export interface FormElements extends HTMLFormControlsCollection {
  username: HTMLInputElement;
  pwd: HTMLInputElement;
  fname: HTMLInputElement;
  lname: HTMLInputElement;
}

export interface User {
  first_name: string;
  last_name: string;
  username: string;
  password: string;
  token: string;
  contacts: Contact[];
}

export interface Message {
  sender: string;
  receiver: string;
  message: string;
  time: string;
}

export interface Contact {
  name: string;
  username: string;
}

export function getCurrentTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const currentTime = hours + ":" + minutes;
  return currentTime;
}

export async function getMessages(
  url: string,
  client1: string,
  client2: string
) {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ client1: client1, client2: client2 }),
  });
  return res.json();
}
