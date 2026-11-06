import { Button } from "@/components/ui/button";

import * as D from "@/components/ui/dialog";

export function DialogDemo() {
  return (
    <D.Dialog>
      <D.DialogTrigger asChild>
        <Button variant="outline">打开弹窗</Button>
      </D.DialogTrigger>
      <D.DialogContent>
        <D.DialogTitle className="text-lg font-semibold">
          弹窗标题
        </D.DialogTitle>
        <D.DialogDescription className="mt-3 text-sm text-muted-foreground">
          支持 Esc 关闭与焦点返回。当前弹窗样式仍待产品截图校准。
        </D.DialogDescription>
        <D.DialogClose asChild>
          <Button className="mt-6">关闭样本</Button>
        </D.DialogClose>
      </D.DialogContent>
    </D.Dialog>
  );
}
