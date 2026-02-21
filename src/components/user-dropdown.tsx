"use client";

import { ChevronDown, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { UserAvatar } from "@/components/ui/user-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteJWT } from "@/lib/actions";

type UserDropdownProps = {
  name: string;
};

export function UserDropdown({ name }: UserDropdownProps) {
  const router = useRouter();

  async function logOut() {
    await deleteJWT();
    router.push("/admin");
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-3 rounded-md px-2 py-1 focus:outline-none">
          <span className="text-sm text-muted-foreground">{name}</span>
          <UserAvatar name={name} />
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem
          onClick={logOut}
          className="flex items-center gap-2 text-red-400 focus:text-red-400"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
