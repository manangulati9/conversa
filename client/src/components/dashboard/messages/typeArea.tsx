import Image from "next/image";
import Smiley from "../../../../public/smiley.svg";
import Mention from "../../../../public/mention.svg";
import Airplane from "../../../../public/paper-airplane.svg";
import { FormEvent } from "react";
import { useChatStore } from "@/lib/stores";
import { getCurrentTime } from "@/lib/utils";

interface MessageForm extends HTMLFormControlsCollection {
  msg: HTMLInputElement;
}
export function TypeArea({ socket }: { socket: any }) {
  const username = useChatStore((state) => state.username);
  const contact = useChatStore((state) => state.contact);
  return (
    <form onSubmit={(e) => handleSubmit(e, socket, username, contact)}>
      <footer className="flex w-full p-4 items-center gap-5 bg-[#090E1B]">
        <button>
          <Image src={Smiley} alt="" width={20} />
        </button>
        <input
          className="flex-grow text-base font-semibold focus:outline-none text-white bg-[#090E1B]"
          placeholder="Start typing..."
          autoFocus
          name="msg"
          id="msg"
          autoComplete="off"
        />
        <div className="flex gap-5">
          <button>
            <Image src={Mention} alt="" width={20} />
          </button>
          <button type="submit">
            <Image src={Airplane} alt="" width={20} />
          </button>
        </div>
      </footer>
    </form>
  );
}

function handleSubmit(
  e: FormEvent<HTMLFormElement>,
  socket: any,
  username: string,
  contact: string
) {
  e.preventDefault();
  if (e.target) {
    const elements = e.currentTarget.elements as MessageForm;
    const message = elements.msg.value;
    const data = {
      sender: username,
      reciever: contact,
      message: message,
      time: getCurrentTime(),
    };
    if (message) socket.emit("send_message", data);
    e.currentTarget.reset();
  }
}
