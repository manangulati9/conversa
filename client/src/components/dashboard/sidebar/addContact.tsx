import { useStore } from "@/lib/stores";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormEvent, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import Image from "next/image";
import Edit from "../../../../public/edit.svg";
import { Contact } from "@/lib/utils";

interface ContactForm extends HTMLFormControlsCollection {
  contact_username: HTMLInputElement;
}
export function AddContact({ socket }: { socket: any }) {
  socket.on("error", (error: string) => {
    alert(error);
  });
  socket.on("contact_added", (data: Contact[]) => {
    setContacts(data);
    setContactName(data[0].name);
    setContactUsername(data[0].username);
  });
  const formRef = useRef<HTMLFormElement>(null);
  const { username, setContacts, setContactName, setContactUsername } =
    useStore();
  return (
    <Dialog>
      <DialogTrigger asChild id="dialog-trigger">
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
            document.getElementById("dialog-trigger")?.click();
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
