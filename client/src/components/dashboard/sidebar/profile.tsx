import { Avatar, AvatarFallback, AvatarImage } from "../../primitives/avatar";
import { useChatStore, useUserStore } from "@/lib/stores";
import { useRouter } from "next/navigation";

export function Profile({ socket }: { socket: any }) {
  const name = useChatStore((state) => state.name);
  const logout = useUserStore((state) => state.logout);
  const username = useChatStore((state) => state.username);
  const contactUsername = useChatStore((state) => state.contactUsername);
  const router = useRouter();
  return (
    <div className="flex gap-5 items-center w-full">
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div>
        <p className="font-semibold text-base">{name}</p>
        <button
          className="text-slate-400"
          onClick={() => {
            logout();
            socket.emit("leave_room", {
              sender: username,
              receiver: contactUsername,
            });
            socket.disconnect();
            router.push("/login");
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
