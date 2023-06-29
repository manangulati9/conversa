import { useState, useEffect } from "react";
import { Message, getMessages, getTokenData } from "./functions";
import { useStore } from "./store";
import { OnlineUsers, getUserData, initializeSocket } from "@/lib/functions";
import { useRouter } from "next/navigation";

export function useMessages() {
  const { username, contactUsername, addMessage, socket, setMessages } =
    useStore();

  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  useEffect(() => {
    socket &&
      socket.on("typing", (sender: string) => {
        setTypingUsers((prevTypingUsers) => {
          if (!prevTypingUsers.includes(sender)) {
            return [...prevTypingUsers, sender];
          }
          return prevTypingUsers;
        });
      });

    socket &&
      socket.on("stopTyping", (sender: string) => {
        setTypingUsers((prevTypingUsers) =>
          prevTypingUsers.filter((user) => user !== sender)
        );
      });

    return () => {
      socket && socket.off("typing");
      socket && socket.off("stopTyping");
    };
  }, []);

  useEffect(() => {
    getMessages(username, contactUsername).then((msgs) => {
      if (msgs) setMessages(msgs);
    });
  }, [contactUsername]);

  useEffect(() => {
    {
      socket &&
        socket.on("receive_message", (data: Message) => {
          addMessage(data);
        });
    }

    return () => {
      socket && socket.off("receive_message");
    };
  }, [socket]);

  return { typingUsers };
}

export function useInitApp() {
  const router = useRouter();

  const { initStates, setToken, username, setSocket, socket, setOnlineUsers } =
    useStore();

  const { token, decodedUsername } = getTokenData();

  useEffect(() => {
    if (!token && !decodedUsername) {
      router.push("/login");
      return;
    }
    setSocket(initializeSocket(decodedUsername));

    return () => {
      socket && socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (token && decodedUsername) {
      getUserData(decodedUsername).then((userData) => {
        if (userData) {
          initStates(userData);
        }
        setToken(token);
      });
    }
  }, [username]);

  useEffect(() => {
    socket &&
      socket.on("online-users", (users: OnlineUsers[]) => {
        setOnlineUsers(users);
      });

    return () => {
      socket && socket.off("online-users");
    };
  }, [socket]);
}
