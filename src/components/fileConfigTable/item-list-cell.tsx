"use client";
import { Badge } from "@/components/ui/badge";

interface ItemListCellProps {
  itemNames: string[];
  badgeVariant?: "default" | "secondary" | "destructive" | "outline";
}

export const ItemListCell = ({
  itemNames,
  badgeVariant = "default",
}: ItemListCellProps) => {
  return itemNames.length ? (
    <div className="flex flex-col gap-1">
      {itemNames.map((itemNames, index) => (
        <Badge key={index} className="w-fit" variant={badgeVariant}>
          {itemNames}
        </Badge>
      ))}
    </div>
  ) : (
    <Badge variant={badgeVariant}>None</Badge>
  );
};
