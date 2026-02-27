import InstructionPanel from "@/components/auth/InstructionPanel";
import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <div className="flex w-[60%] flex-col">
        <div className="w-full p-5">
          <Image
            src="/InfraJuno.png"
            alt="Juno"
            width={180}
            height={30}
            className="mb-10"
          />
        </div>
        <div className="flex flex-col items-center">{children}</div>
      </div>

      <div className="relative w-[40%] overflow-visible bg-neutral-950">
        <InstructionPanel />
      </div>
    </div>
  );
}
