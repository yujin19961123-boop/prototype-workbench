// Adapted from teleMail/src/components/ui/skeleton.tsx; see docs/component-migration.md.
import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-muted motion-safe:animate-pulse rounded-md", className)}
      {...props}
    />
  );
}

export { Skeleton };
