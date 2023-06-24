import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "axios";

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

export async function getMessages(
  url: string,
  client1: string,
  client2: string
) {
  const res = await axios.post(url, { client1: client1, client2: client2 });
  return res.data;
}

export async function getUserData(username: string) {
  const res = await axios.post(process.env.NEXT_PUBLIC_GET_USER_DATA!, {
    username: username,
  });
  return res.data;
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
