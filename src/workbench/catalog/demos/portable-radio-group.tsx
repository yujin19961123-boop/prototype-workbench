import * as R from "@/components/ui/radio-group";

export function RadioGroupDemo() {
  return (
    <R.RadioGroup defaultValue="medium" aria-label="密度样本" className="gap-4">
      {[
        ["small", "紧凑"],
        ["medium", "适中"],
        ["large", "宽松"],
      ].map(([value, label]) => (
        <label key={value} className="flex items-center gap-3 text-sm">
          <R.RadioGroupItem value={value} />
          {label}
        </label>
      ))}
    </R.RadioGroup>
  );
}
