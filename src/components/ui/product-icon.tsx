import type { CSSProperties, ComponentProps } from "react";
import { cn } from "@/lib/utils";
import assets from "@/design-system/icon-assets.json";

/** Original Figma SVG, rendered as an isolated image so masks, IDs and original colors remain intact. */
export function ProductIcon({
  name,
  size,
  className,
  style,
  ...props
}: Omit<ComponentProps<"img">, "src" | "width" | "height" | "name"> & {
  name: string;
  size?: number | string;
}) {
  const asset = (assets as Record<string,{width:number;height:number}>)[name];
  if (!asset) throw new Error(`Unknown product icon: ${name}`);
  const width = size ?? asset.width;
  const height =
    typeof width === "number" ? (width * asset.height) / asset.width : width;
  return (
    <img
      {...props}
      src={`/icons/email/${name}`}
      alt={props.alt ?? ""}
      draggable={false}
      width={typeof width === "number" ? width : undefined}
      height={typeof height === "number" ? height : undefined}
      className={cn(
        "inline-block shrink-0 object-contain align-middle",
        className,
      )}
      style={{ width, height, ...style } as CSSProperties}
      data-product-icon={name}
    />
  );
}
