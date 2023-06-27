import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useStore } from "@/lib/store";
import { getCurrentDate, getCurrentTime } from "@/lib/utils";
import Image from "next/image";
import beginChat from "../../../../public/begin_chat.svg";
import { Message, getMessages } from "@/lib/functions";
import loader from "../../../../public/loader.svg";
import InfiniteScroll from "react-infinite-scroll-component";

export default function Chat() {
  const {
    username,
    contactUsername,
    addMessage,
    contactName,
    messages,
    socket,
    setMessages,
  } = useStore();

  const [page, setPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true);

  useEffect(() => {
    loadMessages();
  }, []);

  useEffect(() => {
    {
      socket &&
        socket.on("receive_message", (data: Message) => {
          addMessage(data);
        });
    }
  }, [socket]);

  const loadMessages = async () => {
    const newMessages = await getMessages(username, contactUsername, page);
    if (newMessages) {
      setMessages(newMessages.messages);
      setHasMorePages(newMessages.hasMorePages);
      setPage((prev) => prev + 1);
    }
  };

  const GreetUser = () => {
    return (
      <div className="grid place-content-center text-center h-full gap-10 bg-gradient-to-t from-background to-blue-950">
        <p className="text-xl font-semibold text-slate-300">
          Say Hi to {contactName.split(" ")[0]}!
        </p>
        <button
          onClick={() => {
            socket &&
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
    );
  };

  const Messages = () => {
    return (
      <div
        className="flex flex-col-reverse px-10 py-4 overflow-y-auto scroll-smooth grow bg-gradient-to-t from-background to-blue-950"
        style={{
          overflowAnchor: "none",
        }}
        id="scrollableDiv"
      >
        <InfiniteScroll
          dataLength={page * 20}
          next={loadMessages}
          style={{
            display: "flex",
            flexDirection: "column-reverse",
            gap: "0.5rem",
          }}
          inverse={true}
          hasMore={hasMorePages}
          loader={
            <Image
              src={loader}
              alt=""
              className="absolute lg:left-[61%] top-[10%] left-[42%]"
            />
          }
          scrollableTarget="scrollableDiv"
        >
          {messages.map((msg) => (
            <MessageBubble
              key={uuidv4()}
              message={msg}
              type={msg.sender === username ? "send" : "receive"}
            />
          ))}
        </InfiniteScroll>
      </div>
    );
  };

  return <>{messages.length !== 0 ? <Messages /> : <GreetUser />}</>;
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
