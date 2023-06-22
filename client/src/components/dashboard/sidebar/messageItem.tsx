import { Avatar, AvatarFallback, AvatarImage } from "../../primitives/avatar";
import { useChatStore } from "@/lib/stores";

export function MessageItem({
  name,
  username,
  lastMessage,
  time,
  socket,
}: {
  name: string;
  username: string;
  lastMessage?: string;
  time?: string;
  socket: any;
}) {
  const sender = useChatStore((state) => state.username);
  const setContactName = useChatStore((state) => state.setContactName);
  const handleClick = () => {
    if (sender && username) {
      setContactName(name);
      socket.emit("join_room", { sender: sender, receiver: username });
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
