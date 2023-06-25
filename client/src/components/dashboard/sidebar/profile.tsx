import { useStore } from "@/lib/stores";
import Circle from "./avatar";
import { useRouter } from "next/navigation";

export function Profile() {
  const router = useRouter();
  const { name, username, contactUsername, logout, socket } = useStore();
  return (
    <div className="flex gap-5 items-center w-full">
      <Circle letter={name[0]} bgColor="#54E346" />
      <div>
        <p className="font-semibold text-base">{name}</p>
        <button
          className="text-slate-400 hover:underline"
          onClick={() => {
            router.push("/login");
            logout();
            socket.emit("leave_room", {
              username: username,
              contact: contactUsername,
            });
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
