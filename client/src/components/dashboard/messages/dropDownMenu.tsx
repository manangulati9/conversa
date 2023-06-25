import Image from "next/image";
import Menu from "../../../../public/menu.svg";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useStore } from "@/lib/stores";

export default function () {
  const { messages } = useStore();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus-visible:outline-none">
        <div className="py-2 px-4 rounded-full hover:bg-[#1D2C4E] transition-colors">
          <Image src={Menu} alt="" height={25} />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-background text-white">
        <DropdownMenuItem>
          <button
            onClick={() => {
              document.getElementById("del_contact")?.click();
            }}
          >
            Delete contact
          </button>
        </DropdownMenuItem>
        {messages().length !== 0 && (
          <DropdownMenuItem>
            <button
              onClick={() => {
                document.getElementById("del_msgs")?.click();
              }}
            >
              Delete all chats
            </button>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
