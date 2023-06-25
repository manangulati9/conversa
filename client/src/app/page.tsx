"use client";
import Messages from "@/components/dashboard/messages/main";
import Sidebar from "@/components/dashboard/sidebar/main";
import { useStore } from "@/lib/stores";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import decode, { JwtPayload } from "jwt-decode";
import { getUserData } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [windowSize, setWindowSize] = useState(0);
  const { initStates, setToken, token, username, setSocket } = useStore();

  useEffect(() => {
    const initializeSocket = () => {
      const socket = io(process.env.NEXT_PUBLIC_SOCKET_SERVER_URL!);
      setSocket(socket);
      return socket;
    };

    const checkTokenAndUserData = async () => {
      const storedToken = localStorage.getItem("token");

      if (!isTokenValid(storedToken)) {
        router.push("/login");
        return;
      }

      const decodedToken = decode<DecodedToken>(storedToken as string);
      const decodedUsername = decodedToken?.username;
      if (!username) {
        const userData = await getUserData(decodedUsername);
        initStates(userData);
      }

      setToken(storedToken as string);
    };

    const socket = initializeSocket();
    checkTokenAndUserData();
    setWindowSize(window.innerWidth);

    return () => {
      socket.disconnect();
    };
  }, [initStates, router, setSocket, setToken, username]);

  const isAuthenticated = Boolean(token);

  return (
    <>
      {isAuthenticated && (
        <div className="text-sm flex">
          <Sidebar />
          {windowSize > 850 && <Messages />}
        </div>
      )}
    </>
  );
}

function isTokenValid(token: string | null): boolean {
  if (!token) {
    return false;
  }

  try {
    const decodedToken = decode<DecodedToken>(token);
    const currentTime = Date.now() / 1000;

    if (decodedToken.exp && decodedToken.exp < currentTime) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
}
interface DecodedToken extends JwtPayload {
  username: string;
}
