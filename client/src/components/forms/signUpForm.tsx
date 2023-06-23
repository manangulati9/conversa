"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormElements, User } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";
import axios from "axios";
import { useChatStore, useUserStore } from "@/lib/stores";

export default function () {
  const router = useRouter();
  const logout = useUserStore((state) => state.logout);
  const setName = useChatStore((state) => state.setName);
  const setUsername = useChatStore((state) => state.setUsername);
  const setContactName = useChatStore((state) => state.setContactName);
  const setContactUsername = useChatStore((state) => state.setContactUsername);
  const setContacts = useChatStore((state) => state.setContacts);
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (e.target !== null) {
      try {
        const elements = e.currentTarget.elements as FormElements;
        const data = {
          first_name: elements.fname.value,
          last_name: elements.lname.value,
          username: elements.username.value,
          password: elements.pwd.value,
        };
        const res = await axios.post(process.env.NEXT_PUBLIC_REGISTER!, data);
        const user: User = res.data;
        localStorage.setItem("token", user.token);
        setTimeout(() => {
          logout();
          localStorage.removeItem("token");
        }, 7200000);
        setName(user.first_name);
        setUsername(user.username);
        setContactName(user.contacts.length === 0 ? "" : user.contacts[0].name);
        setContactUsername(
          user.contacts.length === 0 ? "" : user.contacts[0].username
        );
        setContacts(user.contacts.length === 0 ? [] : user.contacts);
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
        <Label htmlFor="username">Username</Label>
        <Input type="text" id="username" name="username" required />
        <p className="text-sm text-muted-foreground">Choose a username</p>
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
