"use client";
import { Input } from "../primitives/input";
import { Button } from "../primitives/button";
import { Label } from "../primitives/label";
import Link from "next/link";
import { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { FormElements, User } from "../../lib/utils";
import axios from "axios";
import { useToken, useUserStore } from "@/stores";

export default function () {
  const router = useRouter();
  const settoken = useToken((state) => state.settoken);
  const setuser = useUserStore((state) => state.setUser);
  const logout = useToken((state) => state.logout);
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (e.target !== null) {
      try {
        const elements = e.currentTarget.elements as FormElements;
        const data = {
          email: elements.email.value,
          password: elements.pwd.value,
        };
        const res = await axios.post("http://localhost:5000/login", data);
        const newUser: User = res.data;
        setuser(newUser);
        localStorage.setItem("token", newUser.token);
        settoken(newUser.token);
        setTimeout(() => {
          logout();
          localStorage.removeItem("token");
        }, 7200000);
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
