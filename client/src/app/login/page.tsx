"use client";
import Image from "next/image";
import Logo from "../../../public/Logo.svg";
import SignInForm from "@/components/forms/signInForm";
import illus1 from "../../../public/illus1.svg";
import illus2 from "../../../public/illus2.svg";
import illus3 from "../../../public/illus3.svg";
import illus4 from "../../../public/illus4.svg";
export default function Home() {
  return (
    <main className="flex flex-col md:flex-row items-center w-screen h-screen justify-evenly">
      <div className="flex-col justify-evenly hidden md:flex ">
        <Image src={illus1} alt="" loading="eager" />
        <Image src={illus2} alt="" loading="eager" />
      </div>
      <div className="flex flex-col justify-center items-center md:gap-20 gap-10">
        <Image src={Logo} priority alt="" />
        <SignInForm />
      </div>
      <div className="flex flex-col items-center justify-evenly gap-10 pb-9">
        <Image
          src={illus4}
          alt=""
          loading="eager"
          className="hidden md:block"
        />
        <Image src={illus3} alt="" loading="eager" height={260} />
      </div>
    </main>
  );
}
