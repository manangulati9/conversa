"use client";
import { Input } from "../primitives/input";
import { Button } from "../primitives/button";
import { Label } from "../primitives/label";
import Link from "next/link";
import { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { FormElements, User } from "../../lib/utils";
import axios from "axios";
import { useChatStore, useUserStore } from "@/lib/stores";

export default function () {
  const router = useRouter();
  const setToken = useUserStore((state) => state.setToken);
  const setUser = useUserStore((state) => state.setUser);
  const logout = useUserStore((state) => state.logout);
  const setUsername = useChatStore((state) => state.setUsername);
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (e.target !== null) {
      try {
        const elements = e.currentTarget.elements as FormElements;
        const data = {
          email: elements.email.value,
          password: elements.pwd.value,
        };
        const res = await axios.post(process.env.NEXT_PUBLIC_LOGIN!, data);
        const newUser: User = res.data;
        setUser(newUser);
        localStorage.setItem("token", newUser.token);
        setToken(newUser.token);
        setTimeout(() => {
          logout();
          localStorage.removeItem("token");
        }, 7200000);
        setUsername(newUser.first_name);
        router.push("/");
      } catch (error: any) {
        alert(error.response.data);
      }
    }
  };

  return (
    <form
      className="flex flex-col gap-8 items-center justify-center"
      onSubmit={handleSubmit}
    >
      <p className="text-4xl font-semibold text-center">Sign in</p>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input type="email" id="email" name="email" required />
        <p className="text-sm text-muted-foreground">Enter your email</p>
      </div>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="pwd">Password</Label>
        <Input
          type="password"
          id="pwd"
          name="pwd"
          required
          minLength={8}
          maxLength={20}
        />
        <p className="text-sm text-muted-foreground">Enter your password</p>
      </div>
      <Button type="submit" className="w-fit">
        Sign in
      </Button>
      <p>
        No account?{" "}
        <Link href="/register" className="hover:text-blue-500 underline">
          Create one now!
        </Link>
      </p>
    </form>
  );
}
