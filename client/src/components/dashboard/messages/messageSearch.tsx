import Search2 from "../../../../public/search2.svg";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Search } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { useStore } from "@/lib/store";
import { useState, useRef } from "react";
import Image from "next/image";
import { Message } from "@/lib/functions";

export default function MessageSearch() {
  const messageStore = useStore((state) => state.messages);
  const [messages, setMessages] = useState<Message[]>([]);
  const searchRef = useRef<HTMLInputElement>(null);
  const searchButtonRef = useRef<HTMLDivElement>(null);

  const handleSearchChange = () => {
    const queryString = searchRef.current?.value.toLowerCase();
    if (queryString) {
      const filteredMessages = messageStore.filter((msg) =>
        msg.message.toLowerCase().includes(queryString)
      );
      setMessages(filteredMessages);
    } else {
      setMessages([]);
    }
  };

  const handleResultClick = () => {
    const queryString = searchRef.current?.value;
    const msgs = document.getElementsByClassName("bubble");

    if (msgs && queryString) {
      for (let i = 0; i < msgs.length; i++) {
        const message = msgs[i];
        const messageText = message.textContent;

        if (messageText && messageText.includes(queryString)) {
          message.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
          searchButtonRef.current?.click();
          break;
        }
      }
    }
  };

  return (
    <Sheet>
      <SheetTrigger>
        <div
          className="p-2 rounded-full hover:bg-[#1D2C4E] transition-colors"
          ref={searchButtonRef}
          onClick={() => setMessages([])}
        >
          <Image src={Search2} alt="" width={25} />
        </div>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Search Messages</SheetTitle>
          <SheetDescription>
            <div className="flex items-center border-2 rounded-full px-3 mt-3">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-80 text-white" />
              <input
                className="h-9 w-full bg-transparent text-white text-sm border-0 placeholder:text-slate-400 focus:outline-none"
                placeholder="Search..."
                ref={searchRef}
                onChange={handleSearchChange}
              />
            </div>
          </SheetDescription>
        </SheetHeader>
        <div>
          {messages.map((msg) => (
            <button
              key={uuidv4()}
              className="flex w-full justify-between py-3 px-5 bg-[#1D2C4E] rounded-lg m-3 items-center"
              onClick={handleResultClick}
            >
              <p className="font-bold">{msg.message}</p>
              <div className="text-xs">
                <p className="mb-2">{msg.time}</p>
                <p> {msg.date}</p>
              </div>
            </button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
