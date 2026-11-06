import { useState } from "react";

import * as F from "@/components/ui/field";

import { Input } from "@/components/ui/input";

import { Checkbox } from "@/components/ui/checkbox";

import { Button } from "@/components/ui/button";

export function FieldDemo() {
  const [name, setName] = useState("");
  const [layoutValue, setLayoutValue] = useState("");
  const [checked, setChecked] = useState(true);
  const [attempted, setAttempted] = useState(false);
  const [status, setStatus] = useState("");
  const invalid = attempted && !name.trim();
  return (
    <form
      className="w-full max-w-xl space-y-6"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        setAttempted(true);
        setStatus(name.trim() ? "已提交本地字段样本。" : "");
      }}
    >
      <F.FieldSet>
        <F.FieldLegend>字段组合</F.FieldLegend>
        <F.FieldDescription>
          组合标签、控件、说明与错误提示；仅演示本地表单。
        </F.FieldDescription>
        <F.FieldGroup>
          <F.Field data-invalid={invalid}>
            <F.FieldLabel htmlFor="field-name">显示名称</F.FieldLabel>
            <Input
              id="field-name"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setStatus("");
              }}
              placeholder="输入示例名称"
              required
              aria-invalid={invalid}
              aria-describedby={
                invalid ? "field-name-help field-name-error" : "field-name-help"
              }
            />
            <F.FieldDescription id="field-name-help">
              点击标签可聚焦输入框，留空提交可查看错误样本。
            </F.FieldDescription>
            {invalid && (
              <F.FieldError
                id="field-name-error"
                errors={[{ message: "请输入示例名称。" }]}
              />
            )}
          </F.Field>
          <F.Field orientation="horizontal">
            <Checkbox
              id="field-check"
              checked={checked}
              onCheckedChange={(value) => setChecked(value === true)}
              aria-describedby="field-check-help"
            />
            <F.FieldContent>
              <F.FieldLabel htmlFor="field-check">横向字段</F.FieldLabel>
              <F.FieldDescription id="field-check-help">
                标签与说明组合在控件右侧。
              </F.FieldDescription>
            </F.FieldContent>
          </F.Field>
          <F.Field orientation="responsive">
            <F.FieldContent>
              <F.FieldTitle id="field-responsive-title">
                自适应字段
              </F.FieldTitle>
              <F.FieldDescription id="field-responsive-help">
                随容器宽度切换横向与纵向布局。
              </F.FieldDescription>
            </F.FieldContent>
            <Input
              aria-labelledby="field-responsive-title"
              aria-describedby="field-responsive-help"
              placeholder="可编辑的布局样本"
              className="min-w-0 flex-1"
              value={layoutValue}
              onChange={(event) => setLayoutValue(event.target.value)}
            />
          </F.Field>
          <F.FieldSeparator>禁用状态</F.FieldSeparator>
          <F.Field data-disabled="true">
            <F.FieldLabel htmlFor="field-disabled">禁用字段</F.FieldLabel>
            <Input id="field-disabled" disabled placeholder="此控件不可编辑" />
          </F.Field>
        </F.FieldGroup>
      </F.FieldSet>
      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit">提交样本</Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setName("");
            setLayoutValue("");
            setChecked(true);
            setAttempted(false);
            setStatus("");
          }}
        >
          重置样本
        </Button>
      </div>
      <p role="status" className="min-h-5 text-sm text-muted-foreground">
        {status}
      </p>
    </form>
  );
}
