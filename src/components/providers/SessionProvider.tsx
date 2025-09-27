"use client";

import { createContext, useContext, useEffect, useState } from "react";

// TODO: remove duplicate userTypeMap in edit form
export enum UserType {
  SUPERADMIN = 0,
  ADMIN = 1,
  USER = 2,
}

interface UserSessionContextType {
  user: User | null;
  loading: boolean;
}

// TODO: this should be aligned with UserColumn, but for now is temporarily separate
// until everything is renamed
interface User {
  name: string;
  email: string;
  type: UserType;
  projectIds: { low: number }[];
}

const UserSessionContext = createContext<UserSessionContextType | undefined>(
  undefined,
);

export const UserSessionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserSessionContext = async () => {
      const response = await fetch("/api/user");

      try {
        if (response.ok) {
          setUser(await response.json());
        }
      } catch (err) {
        // TODO: sentry integration
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserSessionContext();
  }, []);

  return (
    <UserSessionContext.Provider value={{ user, loading }}>
      {children}
    </UserSessionContext.Provider>
  );
};

export const useUserSession = () => {
  const context = useContext(UserSessionContext);

  // edge case: not in provider
  if (!context) {
    console.error("User session called while not in provider");
  }

  return context;
};
