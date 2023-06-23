import { useChatStore } from "@/lib/stores";
import { useEffect, useRef, useState } from "react";
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

export default function ({ socket }: { socket: any }) {
  const [chatStatus, setChatStatus] = useState("");
  const contactName = useChatStore((state) => state.contactName);
  const contactUserName = useChatStore((state) => state.contactUsername);
  const setContact = useChatStore((state) => state.setContacts);
  const contacts = useChatStore((state) => state.contacts);
  const username = useChatStore((state) => state.username);
  const alertDialogRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    socket.on("chat_status", (value: boolean) => {
      if (value) {
        setChatStatus("online");
      } else {
        setChatStatus("offline");
      }
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
        <DropDownMenu alertDialogRef={alertDialogRef} />
        <AlertDialog>
          <AlertDialogTrigger ref={alertDialogRef}></AlertDialogTrigger>
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
                  setContact(
                    contacts.filter(
                      (contact) => contact.username !== contactUserName
                    )
                  );
                  socket.emit("delete_contact", {
                    username: username,
                    contactUsername: contactUserName,
                  });
                }}
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </header>
  );
}
