"use client";
import Messages from "@/components/dashboard/messages/main";
import Sidebar from "@/components/dashboard/sidebar/main";

export default function Home() {
  return (
    <div className="text-sm flex">
      <Sidebar />
      {window.innerWidth > 850 && <Messages />}
    </div>
  );
}
