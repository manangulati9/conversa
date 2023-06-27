import { useStore } from "@/lib/stores";
import Circle from "./avatar";
import { useRouter } from "next/navigation";

export function ContactItem({
  name,
  contactUsername,
  lastMessage,
  time,
}: {
  name: string;
  contactUsername: string;
  lastMessage?: string;
  time?: string;
}) {
  const { username, setContactName, setContactUsername, socket } = useStore();
  const router = useRouter();
  const handleClick = () => {
    if (contactUsername !== "" && username !== "") {
      socket.emit("join_room", { username, contactUsername });
      setContactName(name);
      setContactUsername(contactUsername);
      if (window.innerWidth < 850) {
        router.push(`/${username}-${contactUsername}`);
      }
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
