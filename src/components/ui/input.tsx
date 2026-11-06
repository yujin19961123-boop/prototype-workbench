import * as React from "react";
import { cn } from "@/lib/utils";
export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "flex h-[var(--input-height)] w-full rounded-[var(--field-radius)] border border-field-border bg-card px-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:bg-field-muted disabled:opacity-[var(--disabled-opacity)]",
        className,
      )}
      {...props}
    />
  );
}
