"use client";
import { useStore } from "@/lib/store";
import Messages from "./messages";
import { TypeArea } from "./typeArea";
import Header from "./header";
import Image from "next/image";
import illus from "../../../../public/chatting-illus.svg";
import { Poppins } from "next/font/google";
import { useEffect } from "react";

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  weight: ["500"],
});

export default function () {
  const { username, contactName, contactUsername, contacts, socket } =
    useStore();

  useEffect(() => {
    if (username !== "" && contactUsername !== "") {
      socket && socket.emit("join_room", { username, contactUsername });
    }
  }, [contactName, contactUsername]);

  return (
    <>
      {contacts.length !== 0 ? (
        <section className="w-full flex flex-col h-screen">
          <Header />
          <Messages />
          <TypeArea />
        </section>
      ) : (
        <div
          className={`w-full flex flex-col justify-center items-center h-screen gap-10 text-center ${poppins.className}`}
        >
          <Image src={illus} alt="" height={500} />
          <p className="text-4xl">Add a new user to get started!</p>
        </div>
      )}
    </>
  );
}
