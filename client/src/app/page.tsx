"use client";
import Messages from "@/components/dashboard/messages/messageSection";
import Sidebar from "@/components/dashboard/sidebar";
import { useUserStore } from "@/lib/stores";
import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:4000");

export default function () {
  const token = useUserStore((state) => state.token);
  const [windowSize, setwindowSize] = useState(0);
  useEffect(() => {
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
