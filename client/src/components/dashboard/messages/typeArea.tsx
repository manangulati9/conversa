import { useRef, useState } from "react";
import { useStore } from "@/lib/store";
import { getCurrentDate, getCurrentTime } from "@/lib/utils";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { Send, SmilePlus } from "lucide-react";

export function TypeArea() {
  const { username, contactUsername, socket } = useStore();
  const [toggle, setToggle] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const message = inputValue.trim();
    if (message) {
      const data = {
        sender: username,
        receiver: contactUsername,
        message: message,
        date: getCurrentDate(),
        time: getCurrentTime(),
      };
      socket && socket.emit("send_message", data);
      setInputValue("");
      inputRef.current?.focus();
    }
  };

  const handleEmojiSelect = (data: any) => {
    const str = inputRef.current?.value;
    const updatedValue = str ? `${str} ${data.native}` : data.native;
    setInputValue(updatedValue);
    inputRef.current?.focus();
    setToggle(!toggle);
  };

  return (
    <footer>
      <form
        onSubmit={handleSubmit}
        className="flex w-full items-center bg-[#090E1B] h-14 py-8 px-4"
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
              onEmojiSelect={handleEmojiSelect}
              theme="dark"
              autoFocus
            />
          </div>
        )}
        <div
          onClick={() => {
            setToggle(!toggle);
          }}
        >
          <SmilePlus
            color="#ffffff"
            className="hover:bg-[#1D2C4E] transition-colors cursor-pointer p-2 rounded-full h-10 w-10 mr-3"
          />
        </div>
        <input
          className="grow text-base focus:outline-none text-white bg-[#090E1B]"
          placeholder="Start typing..."
          name="msg"
          id="msg"
          ref={inputRef}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
          autoComplete="off"
          autoFocus
        />
        <button type="submit">
          <Send
            color="#ffffff"
            className="hover:bg-[#1D2C4E] transition-colors rounded-full p-2 h-10 w-10"
          />
        </button>
      </form>
    </footer>
  );
}
