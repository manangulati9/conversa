"use client";
import Messages from "@/components/dashboard/messages/main";
import Sidebar from "@/components/dashboard/sidebar/main";
import { useState, useEffect } from "react";

export default function Home() {
  const [windowWidht, setWindowWidht] = useState(0);

  useEffect(() => {
    setWindowWidht(window.innerWidth);
  }, []);

  return (
    <div className="text-sm flex">
      <Sidebar />
      {windowWidht > 850 && <Messages />}
    </div>
  );
}
