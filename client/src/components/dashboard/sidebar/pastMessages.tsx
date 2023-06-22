import { ScrollArea } from "../../primitives/scrollarea";
import { useChatStore } from "@/lib/stores";
import { v4 as uuidv4 } from "uuid";
import { MessageItem } from "./messageItem";
import { AddContact } from "./addContact";
import Search1 from "../../../../public/search1.svg";
import Image from "next/image";

export function PastMessages({ socket }: { socket: any }) {
  const contactList = useChatStore((state) => state.contacts);
  return (
    <div className="flex flex-col w-full grow bg-background text-white border-b-2 rounded-none border-slate-500 ">
      <div className="flex justify-between items-center mb-4">
        <p className="text-3xl font-medium ">Messages</p>
        <div className="flex gap-5">
          <button>
            <Image src={Search1} alt="" width={32} />
          </button>
          <AddContact socket={socket} />
        </div>
      </div>

      <ScrollArea className="border-t-2 py-3 border-slate-500">
        <div className="flex flex-col gap-6">
          {contactList.map((contact) => {
            return (
              <MessageItem
                name={contact.name}
                username={contact.username}
                socket={socket}
                key={uuidv4()}
              />
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
