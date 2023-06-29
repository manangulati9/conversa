import axios from "axios";
import { io } from "socket.io-client";
import decode, { JwtPayload } from "jwt-decode";
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

export interface FormElements extends HTMLFormControlsCollection {
  username: HTMLInputElement;
  pwd: HTMLInputElement;
  fname: HTMLInputElement;
  lname: HTMLInputElement;
  confirmPwd: HTMLInputElement;
}

export interface OnlineUsers {
  username: string;
  socketId: string;
}

export interface DecodedToken extends JwtPayload {
  username: string;
}

export async function getMessages(username: string, contactUsername: string) {
  try {
    const payload = {
      username: username,
      contactUsername: contactUsername,
    };
    const res = await axios.post(
      process.env.NEXT_PUBLIC_GET_MESSAGES!,
      payload
    );
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
  } catch (error: any) {
    console.error(error);
    return null;
  }
}

export async function addNewContactInDB(
  username: string,
  contactUsername: string
) {
  try {
    const payload = {
      username: username,
      contactUsername: contactUsername,
    };
    const res = await axios.post(process.env.NEXT_PUBLIC_ADD_CONTACT!, payload);
    return res.data as Contact;
  } catch (error: any) {
    console.error(error);
    return null;
  }
}

export async function deleteContactInDB(
  username: string,
  contactUsername: string
) {
  try {
    const payload = {
      username: username,
      contactUsername: contactUsername,
    };
    const res = await axios.post(
      process.env.NEXT_PUBLIC_DELETE_CONTACT!,
      payload
    );
    return res.data as string;
  } catch (error: any) {
    console.error(error);
    return null;
  }
}

export async function deletAllMessagesFromDB(
  username: string,
  contactUsername: string
) {
  try {
    const payload = {
      username: username,
      contactUsername: contactUsername,
    };
    const res = await axios.post(
      process.env.NEXT_PUBLIC_DELETE_ALL_MESSAGES!,
      payload
    );
    return res.data as string;
  } catch (error: any) {
    console.error(error);
    return null;
  }
}

export async function deleteMessageFromDB(
  username: string,
  contactUsername: string,
  messageToDelete: string
) {
  try {
    const payload = {
      username: username,
      contactUsername: contactUsername,
      messageToDelete: messageToDelete,
    };
    const res = await axios.post(
      process.env.NEXT_PUBLIC_DELETE_CONTACT!,
      payload
    );
    return res.data as string;
  } catch (error: any) {
    console.error(error);
    return null;
  }
}

export function initializeSocket(username: string) {
  const socket = io(process.env.NEXT_PUBLIC_SOCKET_SERVER_URL!, {
    query: { username },
  });
  return socket;
}

export function getTokenData() {
  let token = "";
  let decodedUsername = "";

  try {
    const storedToken = localStorage.getItem("token");
    const currentTime = Math.floor(Date.now() / 1000);

    if (storedToken) {
      const decodedToken = decode<DecodedToken>(storedToken);
      const { username, exp } = decodedToken;

      if (exp && exp > currentTime) {
        token = storedToken;
        decodedUsername = username;
      }
    }
  } catch (error) {
    console.error(error);
  }

  return { token, decodedUsername };
}
