"use client";
import Messages from "@/components/dashboard/messages/main";
import Sidebar from "@/components/dashboard/sidebar/main";
import { useStore } from "@/lib/stores";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, memo } from "react";
import io from "socket.io-client";
import decode from "jwt-decode";
import { User, getUserData } from "@/lib/utils";
const socket = io("http://localhost:4000");

export default memo(() => {
  const router = useRouter();
  const [windowSize, setwindowSize] = useState(0);
  const { initStates, setToken, token, username } = useStore();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      const decoded: { username: string } = decode(token);
      const decodedUsername = decoded.username;
      if (!username) {
        getUserData(decodedUsername).then((data: User) => {
          initStates(data);
        });
      }
      setwindowSize(window.innerWidth);
      setToken(token);
    }
  }, []);

  const renderCountRef = useRef(0);

  useEffect(() => {
    renderCountRef.current += 1;
  });

  return (
    <>
      {token && (
        <div className="text-sm flex">
          <Sidebar socket={socket} />
          <p>Render count: {renderCountRef.current}</p>
          {windowSize > 850 ? <Messages socket={socket} /> : null}
        </div>
      )}
    </>
  );
});
