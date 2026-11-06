import * as S from "@/components/ui/select";

export function SelectDemo() {
  return (
    <div className="w-full max-w-sm">
      <S.Select>
        <S.SelectTrigger aria-label="分类选择样本">
          <S.SelectValue placeholder="选择分类" />
        </S.SelectTrigger>
        <S.SelectContent className="max-h-60">
          <S.SelectGroup>
            <S.SelectLabel>常用分类</S.SelectLabel>
            <S.SelectItem value="a">分类 A</S.SelectItem>
            <S.SelectItem value="b">分类 B</S.SelectItem>
            <S.SelectItem value="disabled" disabled>
              禁用分类
            </S.SelectItem>
          </S.SelectGroup>
          <S.SelectSeparator />
          <S.SelectGroup>
            <S.SelectLabel>更多分类 · 可滚动</S.SelectLabel>
            {Array.from({ length: 15 }, (_, i) => (
              <S.SelectItem key={i} value={`more-${i}`}>
                分类 {i + 1}
              </S.SelectItem>
            ))}
          </S.SelectGroup>
        </S.SelectContent>
      </S.Select>
    </div>
  );
}
