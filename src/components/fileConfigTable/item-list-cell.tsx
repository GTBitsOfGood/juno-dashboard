"use client";
import { Badge } from "@/components/ui/badge";

interface ItemListCellProps {
  itemNames: string[];
}

export const ItemListCell = ({ itemNames }: ItemListCellProps) => {
  return itemNames.length ? (
    <div className="flex flex-col gap-1">
      {itemNames.map((itemNames, index) => (
        <Badge key={index} className="w-fit">
          {itemNames}
        </Badge>
      ))}
    </div>
  ) : (
    <Badge>None</Badge>
  );
};
