import { Avatar, AvatarFallback, AvatarImage } from "../../primitives/avatar";
import { useChatStore, useUserStore } from "@/lib/stores";
import { useRouter } from "next/navigation";

export function Profile() {
  const name = useChatStore((state) => state.name);
  const logout = useUserStore((state) => state.logout);
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
            router.push("/login");
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
