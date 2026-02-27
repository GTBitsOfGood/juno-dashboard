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
        <div className="w-full p-6">
          <Image
            src="/brand.png"
            alt="Juno"
            width={100}
            height={21}
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
