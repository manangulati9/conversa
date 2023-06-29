import { useState, useEffect } from "react";
import { DecodedToken, Message, getMessages, isTokenValid } from "./functions";
import { useStore } from "./store";
import { OnlineUsers, getUserData, initializeSocket } from "@/lib/functions";
import { useRouter } from "next/navigation";
import decode from "jwt-decode";

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

export function useInitHome() {
  const router = useRouter();
  const {
    initStates,
    setToken,
    username,
    setSocket,
    socket,
    setOnlineUsers,
    onlineUsers,
  } = useStore();

  useEffect(() => {
    const checkTokenAndUserData = async () => {
      const storedToken = localStorage.getItem("token");

      if (!isTokenValid(storedToken)) {
        router.push("/login");
        return;
      }

      const decodedToken = decode<DecodedToken>(storedToken as string);
      const decodedUsername = decodedToken?.username;
      setSocket(initializeSocket(decodedUsername));
      if (!username) {
        const userData = await getUserData(decodedUsername);
        if (userData) initStates(userData);
      }

      setToken(storedToken as string);
    };

    checkTokenAndUserData();

    return () => {
      socket && socket.disconnect();
    };
  }, []);

  useEffect(() => {
    socket &&
      socket.on("online-users", (users: OnlineUsers[]) => {
        setOnlineUsers(users);
        console.log(onlineUsers);
      });

    return () => {
      socket && socket.off("online-users");
    };
  }, [socket]);
}
