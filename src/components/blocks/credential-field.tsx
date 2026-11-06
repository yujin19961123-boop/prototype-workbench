import { useId, useState, type ComponentProps, type ReactNode } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormField } from "./form-field";
import "./form-patterns.css";

export function CredentialField({ id: suppliedId, label = "密码", value, onValueChange, revealed: controlled, onRevealedChange, error, description, required = false, className, ...props }: Omit<ComponentProps<typeof Input>, "value" | "onChange" | "type"> & { label?: string; value: string; onValueChange: (value: string) => void; revealed?: boolean; onRevealedChange?: (revealed: boolean) => void; error?: string; description?: ReactNode }) {
  const generatedId = useId(), id = suppliedId ?? generatedId;
  const [local, setLocal] = useState(false), revealed = controlled ?? local;
  const describedBy = [props["aria-describedby"], description ? `${id}-description` : undefined, error ? `${id}-error` : undefined].filter(Boolean).join(" ") || undefined;
  return <FormField id={id} label={label} error={error} description={description} required={required} className={className}>
    <div className="product-credential-control">
      <Input {...props} id={id} aria-label={label} required={required} aria-invalid={!!error} aria-describedby={describedBy} type={revealed ? "text" : "password"} autoComplete="new-password" value={value} onChange={event => onValueChange(event.target.value)}/>
      <Button type="button" variant="ghost" size="icon-sm" className="product-credential-reveal" aria-label={`${revealed ? "隐藏" : "显示"}${label}`} aria-pressed={revealed} onClick={() => { setLocal(!revealed); onRevealedChange?.(!revealed); }}>{revealed ? <Eye size={16}/> : <EyeOff size={16}/>}</Button>
    </div>
  </FormField>;
}
