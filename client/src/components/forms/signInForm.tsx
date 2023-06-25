"use client";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { FormElements } from "../../lib/utils";
import axios from "axios";
import { useStore } from "@/lib/stores";
import { Checkbox } from "../ui/checkbox";

export default function () {
  const router = useRouter();
  const { initStates } = useStore();
  const [inputType, setInputType] = useState("password");
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (e.target !== null) {
      try {
        const elements = e.currentTarget.elements as FormElements;
        const data = {
          username: elements.username.value,
          password: elements.pwd.value,
        };
        const res = await axios.post(process.env.NEXT_PUBLIC_LOGIN!, data);
        if (res.status === 200) {
          const user = res.data;
          localStorage.setItem("token", user.token);
          initStates(user);
          router.push("/");
        } else {
          alert(res.data);
        }
      } catch (error) {
        console.error(error);
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
        <Label htmlFor="username">Username</Label>
        <Input type="text" id="username" name="username" required />
        <p className="text-sm text-muted-foreground">Enter your username</p>
      </div>

      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="pwd">Password</Label>
        <Input
          type={inputType}
          id="pwd"
          name="pwd"
          required
          minLength={8}
          maxLength={20}
        />
        <p className="text-sm text-muted-foreground">Enter your password</p>
      </div>
      <div className="flex gap-4 items-center  w-full ">
        <Checkbox
          name="pwd-checkbox"
          onClick={() => {
            setInputType(inputType === "password" ? "text" : "password");
          }}
        />
        <Label htmlFor="pwd-checkbox">Show password</Label>
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
