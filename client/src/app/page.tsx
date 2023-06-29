"use client";

import { useInitApp } from "@/lib/hooks";
import { useEffect, useState } from "react";
import Messages from "@/components/dashboard/messages/main";
import Sidebar from "@/components/dashboard/sidebar/main";
import MobileLayout from "@/components/dashboard/mobileLayout";

export default function () {
  useInitApp();

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (window.innerWidth < 750) {
      setIsMobile(true);
    }
  }, []);

  return (
    <>
      {isMobile ? (
        <MobileLayout />
      ) : (
        <div className="text-sm flex">
          <Sidebar />
          <Messages />
        </div>
      )}
    </>
  );
}
