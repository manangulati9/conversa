import { Avatar, AvatarFallback, AvatarImage } from "../../primitives/avatar";
import Image from "next/image";
import Search2 from "../../../../public/search2.svg";
import Menu from "../../../../public/menu.svg";
import { useChatStore } from "@/lib/stores";
import { Messages } from "./messages";
import { TypeArea } from "./typeArea";

export default function ({ socket }: { socket: any }) {
  return (
    <section className="w-full h-screen flex flex-col">
      <Header />
      <Messages socket={socket} />
      <TypeArea socket={socket} />
    </section>
  );
}

function Header() {
  const contactName = useChatStore((state) => state.contactName);
  return (
    <header className="flex justify-between p-4 border-b-2 border-slate-500">
      <div className="flex gap-3">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-base font-semibold">{contactName}</p>
          <p className="text-primary font-medium">Chat status</p>
        </div>
      </div>
      <div className="flex gap-5">
        <Image src={Search2} alt="" width={25} />
        <Image src={Menu} alt="" height={25} />
      </div>
    </header>
  );
}
