import { useStore } from "@/lib/store";
import Circle from "./avatar";

export function Profile() {
  const { name, username, contactUsername, socket } = useStore();
  return (
    <div className="flex gap-5 items-center w-full">
      <Circle letter={name[0]} bgColor="#54E346" />
      <div>
        <p className="font-semibold text-base">{name}</p>
        <button
          className="text-slate-400 hover:underline"
          onClick={() => {
            window.location.href = "/login";
            localStorage.removeItem("token");
            socket &&
              socket.emit("stopTyping", {
                username: username,
                contact: contactUsername,
              });
            socket.disconnect();
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
