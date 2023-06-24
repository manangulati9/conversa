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

export default function ({ socket }: { socket: any }) {
  const [chatStatus, setChatStatus] = useState("");
  const {
    contactName,
    contactUsername,
    setContacts,
    contacts,
    username,
    setContactName,
    setContactUsername,
  } = useStore();

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
        <DropDownMenu />
        <AlertDialog>
          <AlertDialogTrigger id="alertDialogRef"></AlertDialogTrigger>
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
                  setContacts(
                    contacts.filter(
                      (contact) => contact.username !== contactUsername
                    )
                  );
                  socket.emit("delete_contact", {
                    username: username,
                    contactUsername: contactUsername,
                  });
                  setContactUsername("");
                  setContactName("");
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
