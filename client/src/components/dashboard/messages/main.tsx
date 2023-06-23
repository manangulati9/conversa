import Image from "next/image";
import Search2 from "../../../../public/search2.svg";
import Menu from "../../../../public/menu.svg";
import { useChatStore } from "@/lib/stores";
import { Messages } from "./messages";
import { TypeArea } from "./typeArea";
import { useEffect, useRef, useState } from "react";
import Circle from "../sidebar/avatar";
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

export default function ({ socket }: { socket: any }) {
  const username = useChatStore((state) => state.username);
  const contactUsername = useChatStore((state) => state.contactUsername);
  socket.emit("join_room", { sender: username, receiver: contactUsername });
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
  const messageStore = useChatStore((state) => state.messages);
  const [messages, setMessages] = useState<Message[]>([]);
  const contactName = useChatStore((state) => state.contactName);
  const searchRef = useRef<HTMLInputElement>(null);
  const msgDivRef = useChatStore((state) => state.msgDivRef);
  const searchButtonRef = useRef<HTMLButtonElement>(null);
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
    <header className="flex justify-between py-4 px-8 border-b-2 border-slate-500">
      <div className="flex gap-3">
        <Circle letter={contactName[0]} bgColor="#0E49B5" />
        <div>
          <p className="text-base font-semibold">{contactName}</p>
          <p className="text-primary font-medium">{chatStatus}</p>
        </div>
      </div>
      <div className="flex gap-4 w-fit">
        <Sheet>
          <SheetTrigger>
            <button
              className="px-2 focus:opacity-50 transition-opacity"
              ref={searchButtonRef}
              onClick={() => {
                setMessages([]);
              }}
            >
              <Image src={Search2} alt="" width={25} />
            </button>
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
                          if (
                            messageText &&
                            messageText.includes(queryString)
                          ) {
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

        <button className="px-2">
          <Image src={Menu} alt="" height={25} />
        </button>
      </div>
    </header>
  );
}
