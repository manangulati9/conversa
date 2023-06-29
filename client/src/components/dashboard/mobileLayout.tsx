import { useStore } from "@/lib/store";
import Messages from "./messages/main";
import Sidebar from "./sidebar/main";

export default function () {
  const { toggleSidebar } = useStore();
  return <div>{toggleSidebar ? <Sidebar /> : <Messages />}</div>;
}
