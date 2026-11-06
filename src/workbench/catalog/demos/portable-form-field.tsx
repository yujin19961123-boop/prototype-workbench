import { Input } from "@/components/ui/input";

import { FormField } from "@/components/blocks/form-field";

export function FormFieldDemo() {
  return <div className="w-full max-w-sm"><FormField id="pattern-name" label="名称" required description="说明与错误由字段组合管理。"><Input id="pattern-name" required aria-describedby="pattern-name-description" placeholder="输入名称"/></FormField></div>;
}
