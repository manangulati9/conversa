import React, { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useStore } from "@/lib/stores";
import { Message, getCurrentDate, getCurrentTime } from "@/lib/utils";
import Image from "next/image";
import beginChat from "../../../../public/begin_chat.svg";
import chatBg from "../../../../public/chat_bg.jpg";

export default function Chat() {
  const {
    username,
    contactUsername,
    addMessage,
    contactName,
    messages,
    socket,
  } = useStore();

  useEffect(() => {
    socket &&
      socket.on("receive_message", (data: Message) => {
        addMessage(data);
      });
  }, [socket]);

  const renderMessageBubbles = () => {
    const filteredMessages = messages().filter((msg) => {
      const sender = msg.sender;
      const receiver = msg.receiver;
      return (
        (receiver === contactUsername || receiver === username) &&
        (sender === contactUsername || sender === username)
      );
    });

    return filteredMessages
      .reverse()
      .map((msg) => (
        <MessageBubble
          key={uuidv4()}
          message={msg}
          type={msg.sender === username ? "send" : "receive"}
        />
      ));
  };

  return (
    <div className="flex flex-col-reverse gap-4 px-10 py-4 overflow-y-auto scroll-smooth h-full grow bg-gradient-to-t from-background to-blue-950">
      {messages().length !== 0 ? (
        renderMessageBubbles()
      ) : (
        <div className="grid place-content-center text-center h-full gap-10">
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
            <Image
              src={beginChat}
              alt=""
              height={window.innerWidth < 850 ? 100 : 150}
              className="opacity-80"
            />
          </button>
        </div>
      )}
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
