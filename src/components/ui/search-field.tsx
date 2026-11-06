import { Search, SlidersHorizontal } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { Input } from "./input";
import { cn } from "@/lib/utils";

/** Screenshot-derived search appearance; search semantics belong to each feature. */
export function SearchField({
  className,
  variant = "default",
  leading,
  trailing,
  density = "default",
  ...props
}: ComponentProps<"input"> & {
  variant?: "default" | "mail" | "mobile" | "settings";
  leading?: ReactNode;
  trailing?: ReactNode;
  density?: "compact" | "default";
}) {
  if (variant === "mail")
    return (
      <div data-slot="search-field" className={cn("relative text-muted-foreground", className)}>
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          {leading === undefined ? (
            <Search size={15} aria-hidden="true" />
          ) : (
            leading
          )}
        </div>
        <Input
          {...props}
          type="search"
          className="h-[var(--search-mail-height)] rounded-full bg-[var(--mail-surface-shell)] px-[34px] text-xs shadow-none"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {trailing === undefined ? (
            <SlidersHorizontal size={17} aria-hidden="true" />
          ) : (
            trailing
          )}
        </div>
      </div>
    );
  return (
    <div data-slot="search-field" className={cn("relative", className)}>
      <Input
        {...props}
        type="search"
        className={cn(
          "h-[var(--search-height)] rounded-full border-transparent bg-muted pr-10 shadow-none",
          leading && "pl-10",
          trailing === null && "pr-3",
          density === "compact" && "h-[var(--size-control-compact)] text-xs",
          variant === "settings" && "h-10 bg-card pl-10 text-caption placeholder:text-[var(--mobile-im-placeholder)]",
          variant === "mobile" && "bg-[var(--mobile-im-search)] pl-9 text-caption placeholder:text-[var(--mobile-im-placeholder)]",
        )}
      />
      {leading && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          {leading}
        </div>
      )}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
        {trailing === undefined ? (
          <Search aria-hidden="true" size={18} strokeWidth={1.5} />
        ) : (
          trailing
        )}
      </div>
    </div>
  );
}
