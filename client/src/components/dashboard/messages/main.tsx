import { Avatar, AvatarFallback, AvatarImage } from "../../primitives/avatar";
import Image from "next/image";
import Search2 from "../../../../public/search2.svg";
import Menu from "../../../../public/menu.svg";
import { useChatStore } from "@/lib/stores";
import { Messages } from "./messages";
import { TypeArea } from "./typeArea";
import { useEffect, useState } from "react";

export default function ({ socket }: { socket: any }) {
  return (
    <section className="w-full h-screen flex flex-col">
      <Header socket={socket} />
      <Messages socket={socket} />
      <TypeArea socket={socket} />
    </section>
  );
}

function Header({ socket }: { socket: any }) {
  const [chatStatus, setChatStatus] = useState("");
  const contactName = useChatStore((state) => state.contactName);
  useEffect(() => {
    socket.on("chat_status", (value: boolean) => {
      if (value) {
        setChatStatus("online");
      } else {
        setChatStatus("offline");
      }
    });
  }, [socket]);
  return (
    <header className="flex justify-between p-4 border-b-2 border-slate-500">
      <div className="flex gap-3">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-base font-semibold">{contactName}</p>
          <p className="text-primary font-medium">{chatStatus}</p>
        </div>
      </div>
      <div className="flex gap-5">
        <Image src={Search2} alt="" width={25} />
        <Image src={Menu} alt="" height={25} />
      </div>
    </header>
  );
}
