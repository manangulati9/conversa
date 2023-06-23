import { useChatStore } from "@/lib/stores";
import Circle from "./avatar";

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
      className="flex justify-between items-center w-full bg-background transition-colors text-white p-3 hover:bg-[#1D2C4E] rounded-lg"
      onClick={handleClick}
    >
      <div className="flex gap-4 items-center">
        <Circle letter={name[0]} bgColor="#0E49B5" />
        <div className="text-left">
          <p className="text-base">{name}</p>
          <p className="text-slate-400">{lastMessage}</p>
        </div>
      </div>
      <p className="text-slate-400 text-center">{time}</p>
    </button>
  );
}
