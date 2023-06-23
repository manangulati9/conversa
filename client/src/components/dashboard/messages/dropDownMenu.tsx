import Image from "next/image";
import Menu from "../../../../public/menu.svg";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ({ alertDialogRef }: { alertDialogRef: any }) {
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
              alertDialogRef.current?.click();
            }}
          >
            Delete contact
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
