import { useChatStore } from "@/lib/stores";
import { Label } from "@/components/primitives/label";
import { Input } from "@/components/primitives/input";
import { Button } from "@/components/primitives/button";
import { FormEvent, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../primitives/dialog";
import Image from "next/image";
import Edit from "../../../../public/edit.svg";

interface ContactForm extends HTMLFormControlsCollection {
  contact_username: HTMLInputElement;
}
export function AddContact({ socket }: { socket: any }) {
  socket.on("error", (error: string) => {
    alert(error);
  });
  const formRef = useRef<HTMLFormElement>(null);
  const username = useChatStore((state) => state.username);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button>
          <Image
            src={Edit}
            alt=""
            width={32}
            className="hover:opacity-80 transition-opacity"
          />
        </button>
      </DialogTrigger>
      <DialogContent className="self-center">
        <DialogHeader className="mb-4">
          <DialogTitle>New Chat</DialogTitle>
        </DialogHeader>

        <form
          className="grid w-full max-w-sm items-center gap-4"
          ref={formRef}
          onSubmit={(e: FormEvent) => {
            e.preventDefault();
            const contactUsername = (formRef.current?.elements as ContactForm)
              .contact_username.value;
            socket.emit("add_contact", {
              username: username,
              contactUsername: contactUsername,
            });
          }}
        >
          <Label htmlFor="contact_username">Username</Label>
          <Input
            type="text"
            id="contact_username"
            name="contact_username"
            required
            autoComplete="false"
          />
          <p className="text-sm text-muted-foreground">
            Enter contact's username
          </p>
          <Button type="submit" className="w-fit">
            Add user
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
