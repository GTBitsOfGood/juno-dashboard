"use client";

import Image from "next/image";
import { useUserSession } from "@/components/providers/SessionProvider";
import { UserDropdown } from "@/components/user-dropdown";

export function TopBar() {
  const session = useUserSession();
  const user = session?.user;

  return (
    <header className="flex items-center justify-between h-14 px-6 border-b bg-background shrink-0">
      <Image src="/infra_logo.png" alt="Infra" height={21} width={75} />
      {user && <UserDropdown name={user.name} />}
    </header>
  );
}
