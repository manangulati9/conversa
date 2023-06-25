import { ScrollArea } from "../../ui/scrollarea";
import { useStore } from "@/lib/stores";
import { v4 as uuidv4 } from "uuid";
import { ContactItem } from "./contactItem";
import { AddContact } from "./addContact";
import Search1 from "../../../../public/search1.svg";
import Image from "next/image";
import {
  Dispatch,
  RefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { Search } from "lucide-react";
import noData from "../../../../public/no_data.svg";
import { ChatInfo } from "@/lib/utils";

export function ContactList() {
  const { contacts } = useStore();
  const [toggleSearchBox, setToggleSearchBox] = useState(false);
  const searchBoxRef = useRef<HTMLInputElement>(null);
  const [list, setList] = useState<ChatInfo[]>(contacts);

  useEffect(() => {
    if (toggleSearchBox && searchBoxRef.current) {
      searchBoxRef.current.focus();
    }
  }, [toggleSearchBox]);

  useEffect(() => {
    setList(contacts);
  }, [contacts]);

  return (
    <div className="flex flex-col w-full grow bg-background text-white border-b-2 rounded-none border-slate-500 ">
      <div>
        <ChatsHeader
          toggleSearchBox={toggleSearchBox}
          setToggleSearchBox={setToggleSearchBox}
        />
        <SearchBox
          toggleSearchBox={toggleSearchBox}
          searchBoxRef={searchBoxRef}
          contacts={contacts}
          setList={setList}
          setToggleSearchBox={setToggleSearchBox}
        />
      </div>
      {contacts.length !== 0 ? (
        <ScrollArea className="py-3 border-slate-500">
          <div className="flex flex-col gap-6">{renderContactItems(list)}</div>
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

function renderContactItems(list: ChatInfo[]) {
  if (list.length === 0) {
    return <NoResults title="No results found" />;
  }

  const renderedItems = list.map((contact) => {
    return renderContactItem(contact);
  });

  return renderedItems;
}

function renderContactItem(contact: ChatInfo) {
  const msgs = contact.messages
    .filter((msg) => msg.sender === contact.contactInfo.username)
    .reverse();

  const [lastMessage] = msgs;
  const { name, username } = contact.contactInfo;

  return (
    <ContactItem
      name={name}
      contactUsername={username}
      lastMessage={lastMessage ? lastMessage.message : ""}
      time={lastMessage ? lastMessage.time : ""}
      key={uuidv4()}
    />
  );
}

function ChatsHeader({
  toggleSearchBox,
  setToggleSearchBox,
}: {
  toggleSearchBox: boolean;
  setToggleSearchBox: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <div className="flex justify-between items-center mb-4">
      <p className="text-3xl font-semibold">Chats</p>
      <div className="flex gap-5">
        <button>
          <Image
            src={Search1}
            alt=""
            width={32}
            className="hover:opacity-80 transition-opacity"
            onClick={() => {
              setToggleSearchBox(!toggleSearchBox);
            }}
          />
        </button>
        <AddContact />
      </div>
    </div>
  );
}

function SearchBox({
  toggleSearchBox,
  searchBoxRef,
  contacts,
  setList,
  setToggleSearchBox,
}: {
  toggleSearchBox: boolean;
  searchBoxRef: RefObject<HTMLInputElement>;
  contacts: ChatInfo[];
  setList: Dispatch<SetStateAction<ChatInfo[]>>;
  setToggleSearchBox: Dispatch<SetStateAction<boolean>>;
}) {
  const handleSearchInputChange = () => {
    const queryString = searchBoxRef.current?.value.toLowerCase();
    setList(
      contacts.filter((contact) => {
        if (queryString) {
          return contact.contactInfo.name.toLowerCase().includes(queryString);
        } else {
          return true;
        }
      })
    );
  };

  const handleSearchInputBlur = (e: any) => {
    setToggleSearchBox(!toggleSearchBox);
    setList(contacts);
    e.target!.value = "";
  };

  return (
    <div
      className={`flex items-center border-2 rounded-full px-3 transition-opacity ${
        toggleSearchBox ? "visible" : "hidden"
      }`}
    >
      <Search className="mr-2 h-4 w-4 shrink-0 opacity-80 text-white" />
      <input
        className="h-9 w-full bg-transparent p-3 text-sm border-0 placeholder:text-slate-400 focus:outline-none"
        placeholder="Search a contact..."
        ref={searchBoxRef}
        onChange={handleSearchInputChange}
        onBlur={(e) => handleSearchInputBlur(e)}
      />
    </div>
  );
}
