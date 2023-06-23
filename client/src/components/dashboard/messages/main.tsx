import { useChatStore } from "@/lib/stores";
import { Messages } from "./messages";
import { TypeArea } from "./typeArea";
import Header from "./header";

export default function ({ socket }: { socket: any }) {
  const username = useChatStore((state) => state.username);
  const contactUsername = useChatStore((state) => state.contactUsername);
  socket.emit("join_room", { sender: username, receiver: contactUsername });
  return (
    <section className="w-full h-screen flex flex-col">
      <Header socket={socket} />
      <Messages socket={socket} />
      <TypeArea socket={socket} />
    </section>
  );
}
