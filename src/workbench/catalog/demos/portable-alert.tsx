import * as Alert from "@/components/ui/alert";

import { Info } from "lucide-react";

export function AlertDemo() {
  return (
    <div className="w-full max-w-md space-y-4">
      <Alert.Alert role="note" className="bg-notice-background">
        <Info />
        <Alert.AlertTitle>提示标题</Alert.AlertTitle>
        <Alert.AlertDescription>
          这里展示说明文字和提示的视觉层级。
        </Alert.AlertDescription>
      </Alert.Alert>
      <Alert.Alert variant="destructive">
        <Alert.AlertTitle>错误样本</Alert.AlertTitle>
        <Alert.AlertDescription>
          错误文案与颜色仍待产品参考确认。
        </Alert.AlertDescription>
      </Alert.Alert>
    </div>
  );
}
