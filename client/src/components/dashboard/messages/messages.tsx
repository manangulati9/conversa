import { v4 as uuidv4 } from "uuid";
import { useStore } from "@/lib/store";
import { getCurrentDate, getCurrentTime } from "@/lib/utils";
import Image from "next/image";
import beginChat from "../../../../public/begin_chat.svg";
import { Message } from "@/lib/functions";
import typing from "../../../../public/typing.svg";
import { useMessages } from "@/lib/hooks";

export default function Chat() {
  const { contactName, socket, username, contactUsername, messages } =
    useStore();
  const { typingUsers } = useMessages();

  const GreetUser = () => {
    return (
      <div className="grid place-content-center text-center h-full gap-10">
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
      <div className="flex overflow-y-auto flex-col-reverse gap-3 px-10 py-4 grow">
        {typingUsers.length !== 0 ? (
          <div className="receive bubble">
            <Image src={typing} alt="" height={50} className="w-8 h-5" />
          </div>
        ) : null}
        {messages.map((msg) => (
          <MessageBubble
            key={uuidv4()}
            message={msg}
            type={msg.sender === username ? "send" : "receive"}
          />
        ))}
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
