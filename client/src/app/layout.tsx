"use client";
import "./globals.css";
import { Inter } from "next/font/google";
import { useStore } from "@/lib/store";
import { useEffect } from "react";
import decode, { JwtPayload } from "jwt-decode";
import { OnlineUsers, getUserData, initializeSocket } from "@/lib/functions";
import { useRouter } from "next/navigation";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Conversa",
  description: "A minimal chat app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { initStates, setToken, username, setSocket, socket, setOnlineUsers } =
    useStore();

  useEffect(() => {
    const checkTokenAndUserData = async () => {
      const storedToken = localStorage.getItem("token");

      if (!isTokenValid(storedToken)) {
        router.push("/login");
        return;
      }

      const decodedToken = decode<DecodedToken>(storedToken as string);
      const decodedUsername = decodedToken?.username;
      setSocket(initializeSocket(decodedUsername));
      if (!username) {
        const userData = await getUserData(decodedUsername);
        if (userData) initStates(userData);
      }

      setToken(storedToken as string);
    };

    checkTokenAndUserData();

    return () => {
      socket && socket.disconnect();
    };
  }, []);

  useEffect(() => {
    socket &&
      socket.on("online-users", (users: OnlineUsers[]) => {
        setOnlineUsers(users);
      });

    return () => {
      socket && socket.off("online-users");
    };
  }, [socket]);

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
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
