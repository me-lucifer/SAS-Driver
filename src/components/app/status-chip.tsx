import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Status = "Submitted" | "Verified" | "Flagged" | "Warning" | "Offline";

const statusStyles: Record<Status, string> = {
    Submitted: "bg-gray-500 text-white border-transparent",
    Verified: "bg-green-600 text-white border-transparent",
    Flagged: "bg-red-600 text-white border-transparent",
    Warning: "bg-yellow-500 text-black border-transparent",
    Offline: "bg-blue-600 text-white border-transparent"
};

export function StatusChip({ status }: { status: Status }) {
  return (
    <Badge className={cn("text-xs", statusStyles[status])}>
      {status}
    </Badge>
  );
}
