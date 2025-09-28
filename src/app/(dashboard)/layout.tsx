import { UserSessionProvider } from "@/components/providers/SessionProvider";

export const metadata = {
  title: "Juno Dashboard",
  description: "Juno Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <UserSessionProvider>{children}</UserSessionProvider>;
}
