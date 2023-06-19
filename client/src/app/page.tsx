"use client";
import Messages from "@/components/dashboard/messages";
import Sidebar from "@/components/dashboard/sidebar";
import { Button } from "@/components/primitives/button";
import { useToken } from "@/stores";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function () {
  const token = useToken((state) => state.token);
  const [windowSize, setwindowSize] = useState(0);
  useEffect(() => {
    setwindowSize(window.innerWidth);
  }, []);

  return (
    <>
      {token ? (
        <div className="text-sm flex">
          <Sidebar />
          {windowSize > 850 ? <Messages /> : null}
        </div>
      ) : (
        <div className="grid place-items-center w-screen h-screen">
          <div className="text-3xl font-bold grid place-items-center gap-6">
            <p>Session has expired</p>
            <p>Please login again</p>
            <Link href="/login">
              <Button className="w-fit font-semibold">Login</Button>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
