"use client";
import { Button } from "@/components/primitives/button";
import { Input } from "@/components/primitives/input";
import { Label } from "@/components/primitives/label";
import { FormElements, User } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent } from "react";
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
          first_name: elements.fname.value,
          last_name: elements.lname.value,
          email: elements.email.value,
          password: elements.pwd.value,
        };
        const res = await axios.post("http://localhost:5000/register", data);
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
      <p className="text-4xl font-semibold text-center">Sign Up</p>
      <div className="flex gap-5">
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="fname">First name</Label>
          <Input type="text" id="fname" name="fname" required />
          <p className="text-sm text-muted-foreground">Enter your first name</p>
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="lname">Last name</Label>
          <Input type="text" id="lname" name="lname" required />
          <p className="text-sm text-muted-foreground">Enter your last name</p>
        </div>
      </div>
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input type="email" id="email" name="email" required />
        <p className="text-sm text-muted-foreground">Enter your email</p>
      </div>
      <div className="grid w-full  items-center gap-1.5">
        <Label htmlFor="pwd">Password</Label>
        <Input
          type="password"
          id="pwd"
          name="pwd"
          required
          minLength={8}
          maxLength={20}
        />
        <p className="text-sm text-muted-foreground">
          Create a secure password
        </p>
      </div>
      <Button type="submit" className="w-fit">
        Create account
      </Button>
      <p>
        Already have an account?{" "}
        <Link href="/login" className="hover:text-blue-500 underline">
          Sign in!
        </Link>
      </p>
    </form>
  );
}
