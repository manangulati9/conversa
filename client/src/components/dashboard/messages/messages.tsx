import { useChatStore } from "@/lib/stores";
import { Message, getMessages } from "@/lib/utils";
import { useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

export function Messages({ socket }: { socket: any }) {
  const username = useChatStore((state) => state.username);
  const contactUsername = useChatStore((state) => state.contactUsername);
  const messages = useChatStore((state) => state.messages);
  const setMessages = useChatStore((state) => state.setMessages);
  const addMessage = useChatStore((state) => state.addMessage);
  const containerRef = useRef<HTMLDivElement>(null);
  const setmsgDivRef = useChatStore((state) => state.setMsgDivRef);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMessages(
          process.env.NEXT_PUBLIC_GET_MESSAGES!,
          username,
          contactUsername
        );
        setMessages(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
    setmsgDivRef(containerRef);
  }, [username, contactUsername]);

  useEffect(() => {
    socket.on("receive_message", (data: Message) => {
      addMessage(data);
    });
    return () => socket.off("receive_message");
  }, [socket]);

  return (
    <div
      className="flex flex-col-reverse gap-4 px-10 py-4 overflow-y-auto scroll-smooth grow"
      ref={containerRef}
    >
      {messages &&
        messages.map((msg) => {
          const sender = msg.sender;
          const receiver = msg.receiver;
          if (
            (receiver === contactUsername || receiver === username) &&
            (sender === contactUsername || sender === username)
          ) {
            if (sender === username) {
              return <MessageBubble key={uuidv4()} message={msg} type="send" />;
            } else {
              return (
                <MessageBubble key={uuidv4()} message={msg} type="receive" />
              );
            }
          } else return null;
        })}
    </div>
  );
}
function MessageBubble({ message, type }: { message: Message; type: string }) {
  return (
    <div className={`${type} bubble w-fit flex gap-3`}>
      <p>{message.message}</p>
      <p
        className={`text-[0.7rem] leading-3 ${
          type === "send" ? "text-slate-800" : "text-slate-500"
        } h-fit self-end`}
      >
        {message.time}
      </p>
    </div>
  );
}
