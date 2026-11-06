import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import * as S from "@/components/ui/sheet";

export function SheetDemo() {
  return (
    <S.Sheet>
      <S.SheetTrigger asChild>
        <Button variant="outline">打开侧边面板</Button>
      </S.SheetTrigger>
      <S.SheetContent>
        <S.SheetHeader>
          <S.SheetTitle>面板样本</S.SheetTitle>
          <S.SheetDescription>
            查看原子组件的模态与焦点管理。
          </S.SheetDescription>
        </S.SheetHeader>
        <div className="space-y-2 p-4">
          <Label htmlFor="sheet-name">显示名称</Label>
          <Input id="sheet-name" placeholder="输入样本名称" />
        </div>
        <S.SheetFooter>
          <S.SheetClose asChild>
            <Button>完成</Button>
          </S.SheetClose>
        </S.SheetFooter>
      </S.SheetContent>
    </S.Sheet>
  );
}
