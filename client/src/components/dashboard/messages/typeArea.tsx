import Image from "next/image";
import Smiley from "../../../../public/smiley.svg";
import Airplane from "../../../../public/paper-airplane.svg";
import { FormEvent } from "react";
import { useStore } from "@/lib/stores";
import { getCurrentDate, getCurrentTime } from "@/lib/utils";

interface MessageForm extends HTMLFormControlsCollection {
  msg: HTMLInputElement;
}
export function TypeArea({ socket }: { socket: any }) {
  const username = useStore((state) => state.username);
  const contactUsername = useStore((state) => state.contactUsername);
  return (
    <form onSubmit={(e) => handleSubmit(e, socket, username, contactUsername)}>
      <footer className="flex w-full py-4 px-8 items-center gap-8 bg-[#090E1B]">
        <button>
          <Image src={Smiley} alt="" width={20} />
        </button>
        <input
          className="flex-grow text-base focus:outline-none text-white bg-[#090E1B]"
          placeholder="Start typing..."
          autoFocus
          name="msg"
          id="msg"
          autoComplete="off"
        />

        <button type="submit">
          <Image src={Airplane} alt="" width={20} />
        </button>
      </footer>
    </form>
  );
}

function handleSubmit(
  e: FormEvent<HTMLFormElement>,
  socket: any,
  username: string,
  contactUsername: string
) {
  e.preventDefault();
  if (e.target) {
    const elements = e.currentTarget.elements as MessageForm;
    const message = elements.msg.value;
    const data = {
      sender: username,
      receiver: contactUsername,
      message: message,
      date: getCurrentDate(),
      time: getCurrentTime(),
    };
    if (message) socket.emit("send_message", data);
    e.currentTarget.reset();
  }
}
