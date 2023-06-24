import { ScrollArea } from "../../ui/scrollarea";
import { useStore } from "@/lib/stores";
import { v4 as uuidv4 } from "uuid";
import { MessageItem } from "./messageItem";
import { AddContact } from "./addContact";
import Search1 from "../../../../public/search1.svg";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import noData from "../../../../public/no_data.svg";

export function ContactList({ socket }: { socket: any }) {
  const { contacts, messages, contactUsername } = useStore();
  const [chats, setChats] = useState(contacts);
  const [toggleSearchBox, setToggle] = useState(false);
  const searchBoxRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (toggleSearchBox && searchBoxRef.current) {
      searchBoxRef.current.focus();
    }
  }, [toggleSearchBox]);

  useEffect(() => {
    setChats(contacts);
  }, [contacts]);

  return (
    <div className="flex flex-col w-full grow bg-background text-white border-b-2 rounded-none border-slate-500 ">
      <div>
        <div className="flex justify-between items-center mb-4">
          <p className="text-3xl font-semibold ">Chats</p>
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
              setChats(
                contacts.filter((contact) => {
                  const queryString = searchBoxRef.current?.value;
                  if (queryString) {
                    return contact.name.toLowerCase().includes(queryString);
                  } else {
                    return true;
                  }
                })
              );
            }}
            onBlur={(e) => {
              setToggle(!toggleSearchBox);
              setChats(contacts);
              e.target.value = "";
            }}
          />
        </div>
      </div>
      {contacts.length !== 0 ? (
        <ScrollArea className="py-3 border-slate-500">
          <div className="flex flex-col gap-6">
            {chats.length !== 0 ? (
              chats.map((contact) => {
                const msgs = messages.filter((msg) => {
                  return msg.sender === contactUsername;
                });
                const [lastMessage] = msgs;
                return (
                  <MessageItem
                    name={contact.name}
                    contactUsername={contact.username}
                    socket={socket}
                    lastMessage={lastMessage ? lastMessage.message : ""}
                    time={lastMessage ? lastMessage.time : ""}
                    key={uuidv4()}
                  />
                );
              })
            ) : (
              <NoResults title="No results found" />
            )}
          </div>
        </ScrollArea>
      ) : (
        <NoResults title="No contacts added" />
      )}
    </div>
  );
}

function NoResults({ title }: { title: string }) {
  return (
    <div className="text-center mt-10 grid place-content-center gap-8">
      <p className="text-lg font-semibold text-slate-400">{title}</p>
      <Image src={noData} alt="" height={150} className="opacity-80" />
    </div>
  );
}
