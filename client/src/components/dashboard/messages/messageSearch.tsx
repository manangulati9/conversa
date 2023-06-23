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
import { Message } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";
import { useChatStore } from "@/lib/stores";
import { useState, useRef } from "react";
import Image from "next/image";

export default function MessageSearch() {
  const messageStore = useChatStore((state) => state.messages);
  const [messages, setMessages] = useState<Message[]>([]);
  const searchRef = useRef<HTMLInputElement>(null);
  const msgDivRef = useChatStore((state) => state.msgDivRef);
  const searchButtonRef = useRef<HTMLDivElement>(null);
  return (
    <Sheet>
      <SheetTrigger>
        <div
          className="p-2 rounded-full hover:bg-[#1D2C4E] transition-colors"
          ref={searchButtonRef}
          onClick={() => {
            setMessages([]);
          }}
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
                className="h-9 w-full bg-transparent text-white text-sm border-0 placeholder:text-slate-400 focus:outline-none "
                placeholder="Search..."
                ref={searchRef}
                onChange={() => {
                  setMessages(
                    messageStore.filter((msg) => {
                      const queryString = searchRef.current?.value;

                      if (queryString) {
                        return msg.message.includes(queryString);
                      } else {
                        return null;
                      }
                    })
                  );
                }}
              />
            </div>
          </SheetDescription>
        </SheetHeader>
        <div>
          {messages.map((msg) => {
            return (
              <button
                key={uuidv4()}
                className="flex w-full justify-between py-3 px-5 bg-[#1D2C4E] rounded-lg m-3 items-center"
                onClick={() => {
                  const messages =
                    msgDivRef?.current?.getElementsByClassName("bubble");
                  const queryString = searchRef.current?.value;

                  if (messages && queryString) {
                    for (let i = 0; i < messages.length; i++) {
                      const message = messages[i];
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
                }}
              >
                <p className="font-bold">{msg.message}</p>
                <p className="text-sm">{msg.time}</p>
              </button>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}
