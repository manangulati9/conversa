import Image from "next/image";
import Logo from "../../../../public/Logo.svg";
import { ContactList } from "./contactList";
import { Profile } from "./profile";

export default function () {
  return (
    <section className="flex flex-col items-center justify-around md:w-[35rem] w-screen h-screen md:border-r-2 border-slate-500 p-8 gap-8 ">
      <Image src={Logo} alt="" />
      <ContactList />
      <Profile />
    </section>
  );
}
