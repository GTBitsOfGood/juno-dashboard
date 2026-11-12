"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { DomainRow, SenderRow } from "@/lib/sdkUtils";
import type { ColumnDef } from "@tanstack/react-table";
import { Loader2 } from "lucide-react";

const StatusBadge = ({ verified }: { verified: boolean }) => (
  <Badge variant={verified ? "default" : "secondary"}>
    {verified ? "Verified" : "Pending"}
  </Badge>
);

export const getSenderColumns = (): ColumnDef<SenderRow>[] => [
  {
    accessorKey: "nickname",
    header: "Nickname",
  },
  {
    accessorKey: "fromEmail",
    header: "From Email",
  },
  {
    accessorKey: "fromName",
    header: "From Name",
  },
  {
    accessorKey: "replyTo",
    header: "Reply-To",
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge verified={row.original.verified} />,
  },
];

type DomainColumnOptions = {
  /** The domain whose verification is running right now, if any. */
  verifyingDomain: string | null;
  /** Disables every Verify button (a request is in flight, or read-only mode). */
  disabled: boolean;
  onVerify: (domain: string) => void;
};

export const getDomainColumns = ({
  verifyingDomain,
  disabled,
  onVerify,
}: DomainColumnOptions): ColumnDef<DomainRow>[] => [
  {
    accessorKey: "domain",
    header: "Domain",
  },
  {
    id: "subdomain",
    header: "Subdomain",
    cell: ({ row }) => row.original.subdomain || "—",
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge verified={row.original.valid} />,
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Button
          variant="outline"
          size="sm"
          disabled={disabled}
          onClick={() => onVerify(row.original.domain)}
        >
          {verifyingDomain === row.original.domain ? (
            <Loader2 className="animate-spin" />
          ) : null}
          Verify
        </Button>
      </div>
    ),
  },
];
