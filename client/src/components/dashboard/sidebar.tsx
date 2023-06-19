import Image from "next/image";
import Logo from "../../../public/Logo.svg";
import Search1 from "../../../public/search1.svg";
import Edit from "../../../public/edit.svg";
import { Avatar, AvatarFallback, AvatarImage } from "../primitives/avatar";
import { ScrollArea } from "../primitives/scrollarea";
import { useUserStore } from "@/stores";
export default function () {
  return (
    <section className="flex flex-col items-center justify-evenly md:w-fit w-screen md:px-8 md:py-0 h-screen md:border-r-2 border-slate-500 p-8">
      <Image src={Logo} alt="" />
      <PastMessages />
      <Profile />
    </section>
  );
}

function PastMessages() {
  return (
    <div className="flex flex-col justify-around w-full">
      <div className="flex justify-between items-center pb-5">
        <p className="text-3xl font-medium ">Messages</p>
        <div className="flex gap-5">
          <button>
            <Image
              src={Search1}
              alt=""
              width={32}
              className="hover:opacity-80 transition-opacity"
            />
          </button>
          <button>
            <Image
              src={Edit}
              alt=""
              width={32}
              className="hover:opacity-80 transition-opacity"
            />
          </button>
        </div>
      </div>

      <ScrollArea className="border-y-2 py-5 pr-8 border-slate-500 h-[35rem] md:h-[28rem]">
        <div className="flex flex-col gap-10">
          <button>
            <MesssageItem />
          </button>
          <button>
            <MesssageItem />
          </button>
          <button>
            <MesssageItem />
          </button>
          <button>
            <MesssageItem />
          </button>
          <button>
            <MesssageItem />
          </button>
          <button>
            <MesssageItem />
          </button>
          <button>
            <MesssageItem />
          </button>
        </div>
      </ScrollArea>
    </div>
  );
}

function MesssageItem() {
  return (
    <div className="flex justify-between items-center gap-40 ">
      <div className="flex gap-4">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-base">Name</p>
          <p className="text-slate-400">message</p>
        </div>
      </div>
      <p className="text-slate-400 text-center">09:10</p>
    </div>
  );
}

function Profile() {
  const user = useUserStore((state) => state.user);
  return (
    <div className="flex gap-5 items-center w-full">
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div>
        <p className="font-semibold text-base">{user.first_name}</p>
        <p className="text-slate-400">Logout</p>
      </div>
    </div>
  );
}
