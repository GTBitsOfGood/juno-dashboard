"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteJWT } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

// TODO: remove duplicate userTypeMap in edit form
export enum UserType {
  SUPERADMIN = 0,
  ADMIN = 1,
  USER = 2,
}

interface UserSessionContextType {
  user: User | null;
  loading: boolean;
  logOut: () => Promise<void>;
}

// TODO: this should be aligned with UserColumn, but for now is temporarily separate
// until everything is renamed
interface User {
  id: number;
  name: string;
  email: string;
  type: UserType;
  projectIds: number[];
}

const UserSessionContext = createContext<UserSessionContextType | undefined>(
  undefined,
);

export const UserSessionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSessionExpiredOpen, setIsSessionExpiredOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const fetchUserSessionContext = async () => {
      try {
        const response = await fetch("/api/user", { cache: "no-store" });

        if (response.status === 401) {
          setUser(null);
          setIsSessionExpiredOpen(true);
          return;
        }

        if (response.ok) {
          setUser((await response.json()).user);
        }
      } catch (err) {
        // TODO: sentry integration
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserSessionContext();
    window.addEventListener("focus", fetchUserSessionContext);

    return () => {
      window.removeEventListener("focus", fetchUserSessionContext);
    };
  }, []);

  async function logOut() {
    try {
      await deleteJWT();
      router.replace("/login");
      router.refresh();
    } catch {
      toast.error("Failed to log out. Please try again.");
    }
  }

  async function logOutFromExpiredSession() {
    try {
      setIsLoggingOut(true);
      await logOut();
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <UserSessionContext.Provider value={{ user, loading, logOut }}>
      {children}
      <AlertDialog open={isSessionExpiredOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Session ended</AlertDialogTitle>
            <AlertDialogDescription>
              Your session has ended. Please log in again to continue using
              Juno.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={logOutFromExpiredSession}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? "Logging out..." : "Log out"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </UserSessionContext.Provider>
  );
};

export const useUserSession = (): UserSessionContextType => {
  const context = useContext(UserSessionContext);

  // edge case: not in provider
  if (!context) {
    console.error("User session called while not in provider");
  }

  return context;
};
