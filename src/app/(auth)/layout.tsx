import InstructionPanel from "@/components/auth/InstructionPanel";
import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-neutral-950">
      <div className="flex w-[60%] flex-col px-24">
        <div className="flex flex-1 flex-col items-center pt-[8%]">
          <div className="w-full max-w-sm">
            <Image
              src="/brand.png"
              alt="Juno"
              width={120}
              height={32}
              className="mb-8"
            />
          </div>
          {children}
        </div>
      </div>

      <div className="relative w-[40%] overflow-visible">
        <InstructionPanel />
      </div>
    </div>
  );
}
