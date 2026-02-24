import InstructionPanel from "@/components/auth/InstructionPanel";
import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <div className="flex flex-col w-[50%] px-24 py-6">
        <Image src="/brand.png" alt="Juno" width={100} height={100} />

        <div className="flex flex-1 flex-col items-center justify-center">
          {children}
        </div>
      </div>

      <div className="block w-[50%] p-32">
        <InstructionPanel />
      </div>
    </div>
  );
}
