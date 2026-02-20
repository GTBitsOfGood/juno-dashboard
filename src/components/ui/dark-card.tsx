import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type DarkCardProps = {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export function DarkCard({
  title,
  description,
  children,
  className,
}: DarkCardProps) {
  return (
    <div
      className={cn(
        "bg-neutral-950 rounded-[6px] px-[10px] py-[12px] flex flex-col gap-[10px]",
        className,
      )}
    >
      <div className="flex flex-col gap-1">
        <h2 className="text-[30px] font-semibold text-white leading-[30px] tracking-[-1px]">
          {title}
        </h2>
        {description && <p className="text-sm text-gray-400">{description}</p>}
      </div>
      {children}
    </div>
  );
}
