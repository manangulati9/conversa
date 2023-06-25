import { useStore } from "@/lib/stores";
import Messages from "./messages";
import { TypeArea } from "./typeArea";
import Header from "./header";
import Image from "next/image";
import illus from "../../../../public/chatting-illus.svg";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  weight: ["500"],
});

export default function ({ socket }: { socket: any }) {
  const { username, contactUsername, contacts } = useStore();
  if (username !== "" && contactUsername !== "") {
    socket.emit("join_room", { sender: username, receiver: contactUsername });
  }
  return (
    <>
      {contacts.length !== 0 ? (
        <section className="w-full flex flex-col h-screen">
          <Header socket={socket} />
          <Messages socket={socket} />
          <TypeArea socket={socket} />
        </section>
      ) : (
        <section
          className={`w-full flex flex-col justify-center items-center h-screen gap-10 text-center ${poppins.className}`}
        >
          <Image src={illus} alt="" height={500} />
          <p className="text-4xl">Add a new user to get started!</p>
        </section>
      )}
    </>
  );
}
