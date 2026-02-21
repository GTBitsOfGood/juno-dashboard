"use client";

import { ChevronDown, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteJWT } from "@/lib/actions";

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

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
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs font-medium bg-primary/20 text-primary">
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>
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
