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

export default function () {
  const [chatStatus, setChatStatus] = useState("");
  const { contactName, socket } = useStore();

  useEffect(() => {
    socket.on("chat_status", (value: boolean) => {
      setChatStatus(value ? "online" : "offline");
    });
  }, [socket]);

  return (
    <header className="flex justify-between py-4 px-8 border-b-2 border-slate-500">
      <div className="flex gap-3">
        <Circle letter={contactName[0]} bgColor="#0E49B5" />
        <div>
          <p className="text-base font-semibold">{contactName}</p>
          <p className="text-primary font-medium">{chatStatus}</p>
        </div>
      </div>
      <div className="flex gap-4 w-fit">
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
      <AlertDialogTrigger id="del_contact"></AlertDialogTrigger>
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
      <AlertDialogTrigger id="del_msgs"></AlertDialogTrigger>
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
