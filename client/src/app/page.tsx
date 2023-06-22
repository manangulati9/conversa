"use client";
import Messages from "@/components/dashboard/messages/main";
import Sidebar from "@/components/dashboard/sidebar/main";
import { useChatStore, useUserStore } from "@/lib/stores";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:4000");

export default function () {
  const token = localStorage.getItem("token");
  const router = useRouter();
  const [windowSize, setwindowSize] = useState(0);
  useEffect(() => {
    if (!token) router.push("/login");
    setwindowSize(window.innerWidth);
  }, []);

  return (
    <>
      {token ? (
        <div className="text-sm flex">
          <Sidebar socket={socket} />
          {windowSize > 850 ? <Messages socket={socket} /> : null}
        </div>
      ) : null}
    </>
  );
}
