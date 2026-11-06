import * as Skeleton from "@/components/ui/skeleton";

export function SkeletonDemo() {
  return (
    <div
      role="status"
      aria-label="加载样本"
      className="w-full max-w-sm space-y-4"
    >
      <Skeleton.Skeleton className="size-12 rounded-full" />
      <Skeleton.Skeleton className="h-4 w-1/2" />
      <Skeleton.Skeleton className="h-4 w-full" />
      <Skeleton.Skeleton className="h-20 w-full" />
    </div>
  );
}
