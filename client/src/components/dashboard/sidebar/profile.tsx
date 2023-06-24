import { useStore } from "@/lib/stores";
import { useRouter } from "next/navigation";
import Circle from "./avatar";

export function Profile({ socket }: { socket: any }) {
  const name = useStore((state) => state.name);
  const username = useStore((state) => state.username);
  const contactUsername = useStore((state) => state.contactUsername);
  const router = useRouter();
  return (
    <div className="flex gap-5 items-center w-full">
      <Circle letter={name[0]} bgColor="#54E346" />
      <div>
        <p className="font-semibold text-base">{name}</p>
        <button
          className="text-slate-400 hover:underline"
          onClick={() => {
            socket.emit("leave_room", {
              sender: username,
              receiver: contactUsername,
            });
            localStorage.removeItem("token");
            router.push("/login");
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
