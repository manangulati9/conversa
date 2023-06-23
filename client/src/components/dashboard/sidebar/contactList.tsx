import { ScrollArea } from "../../ui/scrollarea";
import { useChatStore } from "@/lib/stores";
import { v4 as uuidv4 } from "uuid";
import { MessageItem } from "./messageItem";
import { AddContact } from "./addContact";
import Search1 from "../../../../public/search1.svg";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";

export function ContactList({ socket }: { socket: any }) {
  const contactList = useChatStore((state) => state.contacts);
  const [contacts, setContacts] = useState(contactList);
  const [toggleSearchBox, setToggle] = useState(false);
  const searchBoxRef = useRef<HTMLInputElement>(null);
  const messages = useChatStore((state) => state.messages);
  const contactUsername = useChatStore((state) => state.contactUsername);
  useEffect(() => {
    if (toggleSearchBox && searchBoxRef.current) {
      searchBoxRef.current.focus();
    }
  }, [toggleSearchBox]);

  useEffect(() => {
    setContacts(contactList);
  }, [contactList]);

  return (
    <div className="flex flex-col w-full grow bg-background text-white border-b-2 rounded-none border-slate-500 ">
      <div>
        <div className="flex justify-between items-center mb-4">
          <p className="text-3xl font-medium ">Messages</p>
          <div className="flex gap-5">
            <button>
              <Image
                src={Search1}
                alt=""
                width={32}
                className="hover:opacity-80 transition-opacity"
                onClick={() => {
                  setToggle(!toggleSearchBox);
                }}
              />
            </button>
            <AddContact socket={socket} />
          </div>
        </div>
        <div
          className={`flex items-center border-2 rounded-full px-3 transition-opacity ${
            toggleSearchBox ? "visible" : "hidden"
          }`}
        >
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-80 text-white" />
          <input
            className="h-9 w-full bg-transparent p-3 text-sm border-0 placeholder:text-slate-400 focus:outline-none "
            placeholder="Search a contact..."
            ref={searchBoxRef}
            onChange={() => {
              setContacts(
                contactList.filter((contact) => {
                  const queryString = searchBoxRef.current?.value;
                  if (queryString) {
                    return contact.name.toLowerCase().includes(queryString);
                  } else {
                    return true;
                  }
                })
              );
            }}
          />
        </div>
      </div>
      <ScrollArea className="py-3 border-slate-500">
        <div className="flex flex-col gap-6">
          {contacts.map((contact) => {
            const msgs = messages.filter((msg) => {
              return msg.sender === contactUsername;
            });
            const [lastEntry] = msgs;
            let lastMessage = "";
            let time = "";
            if (lastEntry) {
              lastMessage = lastEntry.message;
              time = lastEntry.time;
            }
            return (
              <MessageItem
                name={contact.name}
                username={contact.username}
                socket={socket}
                lastMessage={lastMessage}
                time={time}
                key={uuidv4()}
              />
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
