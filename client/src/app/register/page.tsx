import Image from "next/image";
import Logo from "../../../public/Logo.svg";
import illus2 from "../../../public/illus2.png";
import illus1 from "../../../public/illus1.png";
import illus3 from "../../../public/illus3.svg";
import illus4 from "../../../public/illus4.svg";
import SignUpForm from "@/components/forms/signUpForm";
export default function Home() {
  return (
    <main className="flex w-screen h-screen justify-around">
      <div className="flex flex-col justify-around">
        <Image src={illus1} alt="" width={325} height={325} loading="eager" />
        <Image src={illus2} alt="" width={225} height={225} loading="eager" />
      </div>
      <div className="flex flex-col justify-center items-center gap-12">
        <Image src={Logo} priority alt="" />
        <SignUpForm />
      </div>
      <div className="flex flex-col justify-around">
        <Image src={illus4} alt="" width={300} height={300} loading="eager" />
        <Image src={illus3} alt="" width={350} height={350} loading="eager" />
      </div>
    </main>
  );
}
