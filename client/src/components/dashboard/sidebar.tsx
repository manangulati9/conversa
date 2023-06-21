import Image from "next/image";
import Logo from "../../../public/Logo.svg";
import Edit from "../../../public/edit.svg";
import { Avatar, AvatarFallback, AvatarImage } from "../primitives/avatar";
import { ScrollArea } from "../primitives/scrollarea";
import { useChatStore, useUserStore } from "@/lib/stores";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../primitives/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../primitives/command";
import { useRouter } from "next/navigation";

export default function ({ socket }: { socket: any }) {
  return (
    <section className="flex flex-col items-center justify-around md:w-[35rem] w-screen h-screen md:border-r-2 border-slate-500 p-8 gap-8 ">
      <Image src={Logo} alt="" />
      <PastMessages socket={socket} />
      <Profile />
    </section>
  );
}

function PastMessages({ socket }: { socket: any }) {
  return (
    <Command className="flex flex-col w-full grow bg-background text-white border-b-2 rounded-none border-slate-500 ">
      <div className="mb-7 ">
        <div className="flex justify-between items-center mb-4">
          <p className="text-3xl font-medium ">Messages</p>
          <Dialog>
            <DialogTrigger asChild>
              <button>
                <Image
                  src={Edit}
                  alt=""
                  width={32}
                  className="hover:opacity-80 transition-opacity"
                />
              </button>
            </DialogTrigger>
            <DialogContent className="self-center">
              <DialogHeader>
                <DialogTitle>New Chat</DialogTitle>
              </DialogHeader>
              <ScrollArea className="border-t-2 py-5 pr-8 border-slate-500">
                <div className="flex flex-col gap-6">
                  <MessageItem name="Yoru" socket={socket} />
                  <MessageItem name="Reyna" socket={socket} />
                  <MessageItem name="Jett" socket={socket} />
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </div>
        <div className="border-2 rounded-full px-3">
          <CommandInput
            placeholder="Search a chat"
            className="  placeholder:text-slate-400 "
          />
        </div>
      </div>
      <CommandList className="grow">
        <CommandEmpty>No results found</CommandEmpty>
        <CommandGroup>
          <div>
            <CommandItem>
              <MessageItem name="Yoru" socket={socket} />
            </CommandItem>
            <CommandItem>
              <MessageItem name="Reyna" socket={socket} />
            </CommandItem>
            <CommandItem>
              <MessageItem name="Manan" socket={socket} />
            </CommandItem>
          </div>
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

function MessageItem({ name, socket }: { name: string; socket: any }) {
  const sender = useChatStore((state) => state.username);
  const setContact = useChatStore((state) => state.setContact);
  const receiver = name;
  const handleClick = () => {
    if (sender && receiver) {
      setContact(receiver);
      socket.emit("join_room", { sender: sender, receiver: receiver });
    }
  };
  return (
    <button
      className="flex justify-between items-center w-full bg-background text-white p-3 hover:bg-[#1D2C4E] rounded-lg"
      onClick={handleClick}
    >
      <div className="flex gap-4">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-base">{name}</p>
          <p className="text-slate-400">message</p>
        </div>
      </div>
      <p className="text-slate-400 text-center">09:10</p>
    </button>
  );
}

function Profile() {
  const user = useChatStore((state) => state.username);
  const logout = useUserStore((state) => state.logout);
  const router = useRouter();
  return (
    <div className="flex gap-5 items-center w-full">
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div>
        <p className="font-semibold text-base">{user}</p>
        <button
          className="text-slate-400"
          onClick={() => {
            logout();
            router.push("/login");
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
