import * as T from "@/components/ui/tabs";

export function TabsDemo() {
  return (
    <div className="w-full max-w-sm space-y-7">
      <T.Tabs defaultValue="a">
        <T.TabsList>
          <T.TabsTrigger value="a">默认样式 A</T.TabsTrigger>
          <T.TabsTrigger value="b">样式 B</T.TabsTrigger>
        </T.TabsList>
        <T.TabsContent value="a" className="pt-4 text-sm">
          第一个标签页内容。
        </T.TabsContent>
        <T.TabsContent value="b" className="pt-4 text-sm">
          第二个标签页内容。
        </T.TabsContent>
      </T.Tabs>
      <T.Tabs defaultValue="focused" className="product-tabs">
        <T.TabsList variant="line">
          <T.TabsTrigger value="focused">重点样本</T.TabsTrigger>
          <T.TabsTrigger value="other">其他样本</T.TabsTrigger>
        </T.TabsList>
        <T.TabsContent
          value="focused"
          className="pt-4 text-xs text-muted-foreground"
        >
          产品绿色下划线变体。
        </T.TabsContent>
        <T.TabsContent
          value="other"
          className="pt-4 text-xs text-muted-foreground"
        >
          其他样本内容。
        </T.TabsContent>
      </T.Tabs>
    </div>
  );
}
