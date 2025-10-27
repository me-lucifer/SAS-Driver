import { LucideIcon } from "lucide-react";

type EmptyStateProps = {
    icon: LucideIcon;
    title: string;
    description: string;
}

export function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-card rounded-2xl border border-dashed h-64">
      <div className="bg-muted rounded-full p-4 mb-4">
        <Icon className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground mt-2 max-w-xs">{description}</p>
    </div>
  );
}
