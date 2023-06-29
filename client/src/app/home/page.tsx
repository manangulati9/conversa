"use client";
import Messages from "@/components/dashboard/messages/main";
import Sidebar from "@/components/dashboard/sidebar/main";
import { DecodedToken, getUserData } from "@/lib/functions";
import { useState, useEffect } from "react";
import decode from "jwt-decode";
import { useStore } from "@/lib/store";

export default function Home() {
  const [windowWidht, setWindowWidht] = useState(0);
  const { username, initStates, setToken } = useStore();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !username) {
      const decodedToken = decode<DecodedToken>(token as string);
      const decodedUsername = decodedToken?.username;

      getUserData(decodedUsername).then((data) => {
        if (data) initStates(data);
      });

      setToken(token as string);
    }
    setWindowWidht(window.innerWidth);
  }, []);

  return (
    <div className="text-sm flex">
      <Sidebar />
      {windowWidht > 850 && <Messages />}
    </div>
  );
}
