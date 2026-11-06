import { useState } from "react";

import { CredentialField } from "@/components/blocks/credential-field";

export function CredentialFieldDemo() {
  const [value, setValue] = useState("");
  const [smtpValue, setSmtpValue] = useState("");
  return <div className="w-full max-w-sm space-y-4"><CredentialField label="App 专用密码" required value={value} onValueChange={setValue} placeholder="输入 App 专用密码"/><CredentialField label="SMTP 密码" value={smtpValue} onValueChange={setSmtpValue} description="可选密码留空时由调用方沿用收件凭据。"/></div>;
}
