import { useState, useEffect } from "react";
import { Message, getMessages } from "./functions";
import { useStore } from "./store";

export function useMessages() {
  const { username, contactUsername, addMessage, socket, setMessages } =
    useStore();

  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  useEffect(() => {
    socket.on("typing", (sender: string) => {
      setTypingUsers((prevTypingUsers) => {
        if (!prevTypingUsers.includes(sender)) {
          return [...prevTypingUsers, sender];
        }
        return prevTypingUsers;
      });
    });

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
