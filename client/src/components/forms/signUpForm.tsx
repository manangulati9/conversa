"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormElements, User } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
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
          first_name: elements.fname.value,
          last_name: elements.lname.value,
          username: elements.username.value,
          password: elements.pwd.value,
          confirmPwd: elements.confirmPwd.value,
        };
        if (data.confirmPwd === data.password) {
          const res = await axios.post(process.env.NEXT_PUBLIC_REGISTER!, data);
          const user: User = res.data;
          localStorage.setItem("token", user.token);
          initStates(user);
          router.push("/");
        } else {
          throw new Error("Password doesn't match. Please try again");
        }
      } catch (error: any) {
        alert(error.message);
      }
    }
  };

  return (
    <form
      className="flex flex-col gap-5 items-center justify-center"
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
      <div className="grid w-full items-center gap-1.5">
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
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="pwd">Confirm Password</Label>
        <Input
          type={inputType}
          id="confirmPwd"
          name="confirmPwd"
          required
          minLength={8}
          maxLength={20}
        />
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
