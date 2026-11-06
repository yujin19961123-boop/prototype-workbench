import * as I from "@/components/ui/input";

export function InputDemo() {
  return (
    <div className="w-full max-w-sm space-y-3">
      <label htmlFor="input-demo" className="text-sm">
        显示名称
      </label>
      <I.Input
        id="input-demo"
        placeholder="输入示例名称"
        aria-describedby="input-help"
      />
      <p id="input-help" className="text-xs text-muted-foreground">
        输入仅存在于本地预览。
      </p>
      <I.Input aria-label="禁用输入样本" placeholder="禁用状态" disabled />
    </div>
  );
}
