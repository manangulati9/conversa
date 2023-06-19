import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
export interface FormElements extends HTMLFormControlsCollection {
  email: HTMLInputElement;
  pwd: HTMLInputElement;
  fname: HTMLInputElement;
  lname: HTMLInputElement;
}

export interface User {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  token: string;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
