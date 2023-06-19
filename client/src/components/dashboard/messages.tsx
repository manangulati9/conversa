import { Avatar, AvatarFallback, AvatarImage } from "../primitives/avatar";
import Image from "next/image";
import Search2 from "../../../public/search2.svg";
import Menu from "../../../public/menu.svg";
import Smiley from "../../../public/smiley.svg";
import Mention from "../../../public/mention.svg";
import Airplane from "../../../public/paper-airplane.svg";

export default function () {
  return (
    <section className="w-full flex flex-col">
      <Header />
      <Messages />
      <TypeArea />
    </section>
  );
}

function Header() {
  return (
    <header className="flex justify-between p-4 border-b-2 border-slate-500">
      <div className="flex gap-3">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-base font-semibold">Name</p>
          <p className="text-primary font-medium">Chat status</p>
        </div>
      </div>
      <div className="flex gap-5">
        <Image src={Search2} alt="" width={25} />
        <Image src={Menu} alt="" height={25} />
      </div>
    </header>
  );
}

function TypeArea() {
  return (
    <footer className="flex w-full p-4 items-center gap-5 bg-[#090E1B]">
      <button>
        <Image src={Smiley} alt="" width={20} />
      </button>
      <input
        className="flex-grow text-base font-semibold focus:outline-none text-white bg-[#090E1B]"
        placeholder="Start typing..."
        autoFocus
      />
      <div className="flex gap-5">
        <button>
          <Image src={Mention} alt="" width={20} />
        </button>
        <button>
          <Image src={Airplane} alt="" width={20} />
        </button>
      </div>
    </footer>
  );
}

function Messages() {
  return (
    <div className="grow flex flex-col gap-6 px-10 py-4">
      <MessageOther />
      <MessageSelf />
    </div>
  );
}

function MessageOther() {
  return (
    <div className="receive bubble">
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis, quos
      maxime accusantium nobis provident quidem.
    </div>
  );
}

function MessageSelf() {
  return (
    <div className="send bubble">
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium
      aliquid ipsum aspernatur nam molestias soluta?
    </div>
  );
}
