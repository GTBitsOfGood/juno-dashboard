"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";

export function UserAvatar({ name }: { name: string }) {
  return (
    <Avatar className="h-8 w-8">
      <AvatarFallback className="text-xs font-medium bg-primary/20 text-primary">
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
}
