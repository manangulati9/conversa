import Image from "next/image";
import Smiley from "../../../../public/smiley.svg";
import Airplane from "../../../../public/paper-airplane.svg";
import { useRef, useState } from "react";
import { useStore } from "@/lib/stores";
import { getCurrentDate, getCurrentTime } from "@/lib/utils";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
interface MessageForm extends HTMLFormControlsCollection {
  msg: HTMLInputElement;
}
export function TypeArea({ socket }: { socket: any }) {
  const { username, contactUsername } = useStore();
  const [toggle, setToggle] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <footer>
      <form
        onSubmit={(e) => {
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
            if (message) {
              socket.emit("send_message", data);
            }
            setInputValue("");
          }
        }}
        className="flex w-full py-4 px-8 items-center gap-8 bg-[#090E1B]"
      >
        {toggle && (
          <div
            className="absolute bottom-2"
            onBlur={() => {
              setToggle(!toggle);
            }}
          >
            <Picker
              data={data}
              onEmojiSelect={(data: any) => {
                const str = inputRef.current?.value;
                setInputValue(str + " " + data.native);
                inputRef.current?.focus();
                setToggle(!toggle);
              }}
              theme="dark"
              autoFocus
            />
          </div>
        )}
        <div className="cursor-pointer">
          <Image
            src={Smiley}
            alt=""
            onClick={() => {
              setToggle(!toggle);
            }}
            className="hover:h-12"
          />
        </div>
        <input
          className="flex-grow text-base focus:outline-none text-white bg-[#090E1B]"
          placeholder="Start typing..."
          name="msg"
          id="msg"
          ref={inputRef}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
          autoComplete="false"
        />
        <button
          type="submit"
          className="bg-primary p-2 rounded-full hover:opacity-80 transition-opacity"
        >
          <Image src={Airplane} alt="" width={20} />
        </button>
      </form>
    </footer>
  );
}
