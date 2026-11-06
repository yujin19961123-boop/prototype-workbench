import { useId } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FormField } from "./form-field";
import "./form-patterns.css";

type Values = { imap: string; imapPort: string; smtp: string; smtpPort: string };
type Encryption = { imapSSL: boolean; smtpSSL: boolean; startTLS: boolean };
export function ServerSettingsFields({ values, encryption, onValueChange, onEncryptionChange }: { values: Values; encryption: Encryption; onValueChange: (name: keyof Values, value: string) => void; onEncryptionChange: (name: keyof Encryption, value: boolean) => void }) {
  const id = useId();
  function field(name: keyof Values, label: string, placeholder: string) { return <FormField id={`${id}-${name}`} label={label}><Input id={`${id}-${name}`} aria-label={label} value={values[name]} inputMode={name.endsWith("Port") ? "numeric" : undefined} placeholder={placeholder} onChange={event => onValueChange(name, event.target.value)}/></FormField>; }
  function toggle(name: keyof Encryption, label: string) { return <div className="product-server-encryption"><Checkbox id={`${id}-${name}`} aria-label={name === "imapSSL" ? "IMAP 使用 SSL 加密" : name === "smtpSSL" ? "SMTP 使用 SSL 加密" : label} checked={encryption[name]} onCheckedChange={checked => onEncryptionChange(name, checked === true)}/><Label htmlFor={`${id}-${name}`}>{label}</Label></div>; }
  return <div className="product-server-fields">
    <div className="product-server-grid">{field("imap", "IMAP 服务器地址", "如 imap.example.com")}{field("imapPort", "IMAP 端口", "993")}</div>
    {toggle("imapSSL", "使用 SSL 加密")}
    <div className="product-server-grid">{field("smtp", "SMTP 服务器地址", "如 smtp.example.com")}{field("smtpPort", "SMTP 端口", "465")}</div>
    {toggle("smtpSSL", "使用 SSL 加密")}{toggle("startTLS", "服务器支持时使用 STARTTLS")}
  </div>;
}
