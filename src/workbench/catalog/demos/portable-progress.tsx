import * as Progress from "@/components/ui/progress";

export function ProgressDemo() {
  return (
    <div className="w-full max-w-sm space-y-6">
      {[0, 50, 100].map((value) => (
        <div key={value}>
          <p className="mb-2 text-xs text-muted-foreground">{value}%</p>
          <Progress.Progress
            value={value}
            aria-label={`进度 ${value}%`}
            className="h-1 bg-muted [&_[data-slot=progress-indicator]]:bg-brand-green"
          />
        </div>
      ))}
    </div>
  );
}
