import { useStore } from "@/lib/stores";
import { useEffect, useState } from "react";
import Circle from "../sidebar/avatar";
import MessageSearch from "./messageSearch";
import DropDownMenu from "./dropDownMenu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function () {
  const { contactName, socket, contactUsername, onlineUsers } = useStore();
  const router = useRouter();

  return (
    <header className="flex justify-between py-4 px-8 items-center">
      {window.innerWidth < 850 && (
        <button
          onClick={() => router.push("/")}
          className="border p-2 rounded-full"
        >
          <ArrowLeft />
        </button>
      )}

      <div className="flex gap-3 items-center">
        <Circle letter={contactName[0]} bgColor="#0E49B5" />
        <div>
          <p className="text-base font-semibold">{contactName}</p>
          <p className="text-primary font-medium">
            {onlineUsers.includes(contactUsername) ? "online" : "offline"}
          </p>
        </div>
      </div>
      <div className="flex gap-3 w-fit">
        <MessageSearch />
        <DropDownMenu />
        <DeleteContact />
        <DeleteMessages />
      </div>
    </header>
  );
}

function DeleteContact() {
  const { contactName, contactUsername, username, deleteContact, socket } =
    useStore();

  return (
    <AlertDialog>
      <AlertDialogTrigger
        className="hidden"
        id="del_contact"
      ></AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete {contactName} from contacts?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              const currentContact = {
                name: contactName,
                username: contactUsername,
              };
              deleteContact(currentContact);
              socket &&
                socket.emit("delete_contact", {
                  username: username,
                  contactUsername: contactUsername,
                });
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function DeleteMessages() {
  const { contactName, contactUsername, username, deleteAllMessages, socket } =
    useStore();
  return (
    <AlertDialog>
      <AlertDialogTrigger className="hidden" id="del_msgs"></AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete all chats from {contactName}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              deleteAllMessages({
                name: contactName,
                username: contactUsername,
              });
              socket &&
                socket.emit("delete_chats_all", {
                  username: username,
                  contactUsername: contactUsername,
                });
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
