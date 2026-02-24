"use client";

import { CheckCircle, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { UserAvatar } from "@/components/ui/user-avatar";
import {
  acceptAccountRequest,
  AccountRequest,
  declineAccountRequest,
  getAccountRequests,
} from "@/lib/accountRequests";

function roleBadgeVariant(
  role: AccountRequest["userType"],
): "default" | "secondary" | "outline" {
  switch (role) {
    case "SUPERADMIN":
      return "default";
    case "ADMIN":
      return "secondary";
    default:
      return "outline";
  }
}

export function PendingAccountRequests() {
  const [requests, setRequests] = useState<AccountRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function fetchRequests() {
      try {
        const result = await getAccountRequests();
        if (result.success) {
          setRequests(result.requests);
        } else {
          toast.error("Error", {
            description: result.error ?? "Failed to fetch account requests.",
          });
        }
      } catch (err) {
        console.error("Failed to load account requests:", err);
        toast.error("Error", {
          description: "Failed to load account requests.",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchRequests();
  }, []);

  const setProcessing = (id: string, processing: boolean) => {
    setProcessingIds((prev) => {
      const next = new Set(prev);
      if (processing) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  };

  const handleAccept = async (request: AccountRequest) => {
    setProcessing(request.id, true);
    try {
      const result = await acceptAccountRequest(request);
      if (result.success) {
        setRequests((prev) => prev.filter((r) => r.id !== request.id));
        toast.success("Request Accepted", {
          description: `${request.name} (${request.email}) has been added as ${request.userType}.`,
        });
      } else {
        toast.error("Failed to Accept Request", {
          description: result.error ?? "An unexpected error occurred.",
        });
      }
    } catch (err) {
      console.error("Unexpected error accepting request:", err);
      toast.error("Error", {
        description: "An unexpected error occurred.",
      });
    } finally {
      setProcessing(request.id, false);
    }
  };

  const handleDecline = async (request: AccountRequest) => {
    setProcessing(request.id, true);
    try {
      const result = await declineAccountRequest();
      if (result.success) {
        setRequests((prev) => prev.filter((r) => r.id !== request.id));
        toast.success("Request Declined", {
          description: `The request from ${request.email} has been removed.`,
        });
      } else {
        toast.error("Failed to Decline Request", {
          description: result.error ?? "An unexpected error occurred.",
        });
      }
    } catch (err) {
      console.error("Unexpected error declining request:", err);
      toast.error("Error", {
        description: "An unexpected error occurred.",
      });
    } finally {
      setProcessing(request.id, false);
    }
  };

  return (
    <div>
      <Separator className="mb-8" />

      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8">
        <div>
          <h2 className="text-lg font-semibold mb-1">
            Pending Account Requests
          </h2>
          <p className="text-sm text-muted-foreground">
            New account requests awaiting administrator approval. Accepting a
            request will create the user.
          </p>
        </div>

        <div className="border rounded-lg overflow-hidden">
          {isLoading ? (
            <div className="divide-y">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="flex items-center gap-4 px-6 py-4 animate-pulse"
                >
                  <div className="h-9 w-9 rounded-full bg-muted shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-32 rounded bg-muted" />
                    <div className="h-3 w-48 rounded bg-muted" />
                  </div>
                  <div className="h-6 w-16 rounded bg-muted" />
                  <div className="h-8 w-20 rounded bg-muted" />
                  <div className="h-8 w-20 rounded bg-muted" />
                </div>
              ))}
            </div>
          ) : requests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-sm text-muted-foreground gap-2">
              <CheckCircle className="h-8 w-8 text-muted-foreground/40" />
              <span>No pending account requests.</span>
            </div>
          ) : (
            <div className="divide-y">
              {requests.map((request) => {
                const isProcessing = processingIds.has(request.id);
                return (
                  <div
                    key={request.id}
                    className="flex items-center gap-4 px-6 py-4"
                  >
                    <UserAvatar name={request.name} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium leading-none truncate">
                        {request.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 truncate">
                        {request.email}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant={roleBadgeVariant(request.userType)}>
                        {request.userType}
                      </Badge>

                      {request.projectName && (
                        <Badge variant="secondary">{request.projectName}</Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={isProcessing}
                        onClick={() => handleAccept(request)}
                        className="gap-1.5"
                      >
                        <CheckCircle className="h-3.5 w-3.5" />
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={isProcessing}
                        onClick={() => handleDecline(request)}
                        className="gap-1.5 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        Decline
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
