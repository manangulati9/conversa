import React, { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useStore } from "@/lib/stores";
import {
  Message,
  getCurrentDate,
  getCurrentTime,
  getMessages,
} from "@/lib/utils";
import Image from "next/image";
import beginChat from "../../../../public/begin_chat.svg";

const Messages = React.memo(({ socket }: { socket: any }) => {
  const {
    username,
    contactUsername,
    messages,
    setMessages,
    addMessage,
    contactName,
  } = useStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMessages(username, contactUsername);
        setMessages(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [contactUsername]);

  useEffect(() => {
    socket.on("receive_message", (data: Message) => {
      addMessage(data);
    });
  }, [socket]);

  useEffect(() => {
    console.log(messages.length);
  }, [messages.length]);

  return (
    <>
      {messages.length !== 0 ? (
        <div className="flex flex-col-reverse gap-4 px-10 py-4 overflow-y-auto scroll-smooth grow">
          {messages.map((msg) => {
            const sender = msg.sender;
            const receiver = msg.receiver;
            if (
              (receiver === contactUsername || receiver === username) &&
              (sender === contactUsername || sender === username)
            ) {
              if (sender === username) {
                return (
                  <MessageBubble key={uuidv4()} message={msg} type="send" />
                );
              } else {
                return (
                  <MessageBubble key={uuidv4()} message={msg} type="receive" />
                );
              }
            } else return null;
          })}
        </div>
      ) : (
        <div className="grow flex flex-col items-center justify-center gap-8">
          <p className="text-xl font-semibold text-slate-300">
            Say Hi to {contactName.split(" ")[0]}!
          </p>
          <button
            onClick={() => {
              socket.emit("send_message", {
                sender: username,
                receiver: contactUsername,
                message: `Hi ${contactName.split(" ")[0]}!`,
                date: getCurrentDate(),
                time: getCurrentTime(),
              });
            }}
          >
            <Image src={beginChat} alt="" height={200} className="opacity-80" />
          </button>
        </div>
      )}
    </>
  );
});

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

export default Messages;
