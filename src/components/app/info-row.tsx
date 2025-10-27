import { ReactNode } from "react";

export function InfoRow({ label, value }: { label: string, value: ReactNode }) {
  return (
    <div className="flex justify-between items-center py-2 border-b">
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="text-sm font-medium text-foreground">
        {value}
      </div>
    </div>
  );
}
