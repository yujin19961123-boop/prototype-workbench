import * as PF from "@/components/ui/product-fields";

import * as R from "@/components/ui/radio-group";

import * as S from "@/components/ui/select";

export function ProductFieldsDemo() {
  return (
    <div className="w-full max-w-sm space-y-5">
      <label className="block text-xs">
        胶囊输入
        <PF.ProductInput className="mt-2" placeholder="产品输入样本" />
      </label>
      <S.Select>
        <PF.ProductSelectTrigger aria-label="产品分类样本">
          <S.SelectValue placeholder="选择分类" />
        </PF.ProductSelectTrigger>
        <S.SelectContent>
          <S.SelectItem value="a">分类 A</S.SelectItem>
          <S.SelectItem value="b">分类 B</S.SelectItem>
        </S.SelectContent>
      </S.Select>
      <label className="block text-xs">
        多行说明
        <PF.ProductTextarea className="mt-2" placeholder="产品多行样本" />
      </label>
      <R.RadioGroup defaultValue="a" aria-label="产品单选样本">
        <label className="flex items-center gap-2 text-xs">
          <PF.ProductRadioItem value="a" />
          绿色单选 A
        </label>
        <label className="flex items-center gap-2 text-xs">
          <PF.ProductRadioItem value="b" />
          绿色单选 B
        </label>
      </R.RadioGroup>
    </div>
  );
}
