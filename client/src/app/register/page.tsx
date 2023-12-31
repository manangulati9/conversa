"use client";
import Image from "next/image";
import Logo from "../../../public/Logo.svg";
import illus1 from "../../../public/illus1.svg";
import illus2 from "../../../public/illus2.svg";
import illus3 from "../../../public/illus3.svg";
import illus4 from "../../../public/illus4.svg";
import SignUpForm from "@/components/forms/signUpForm";
export default function Home() {
  return (
    <main className="flex flex-col md:flex-row w-screen h-screen justify-evenly p-8">
      <div className="flex-col justify-evenly hidden md:flex">
        <Image src={illus1} alt="" loading="eager" />
        <Image src={illus2} alt="" loading="eager" />
      </div>
      <div className="flex flex-col justify-center items-center gap-10">
        <Image src={Logo} priority alt="" />
        <SignUpForm />
      </div>
      <div className="flex-col justify-evenly gap-10 pb-9 hidden md:flex">
        <Image src={illus4} alt="" loading="eager" />
        <Image src={illus3} alt="" height={260} loading="eager" />
      </div>
    </main>
  );
}
