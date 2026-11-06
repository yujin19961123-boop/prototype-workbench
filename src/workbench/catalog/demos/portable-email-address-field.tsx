import { useState } from "react";

import { EmailAddressField } from "@/components/blocks/email-address-field";

export function EmailAddressFieldDemo() {
  const [value, setValue] = useState(""), [submitted, setSubmitted] = useState("");
  return <div className="w-full max-w-sm"><EmailAddressField value={value} onValueChange={setValue} onSubmit={() => setSubmitted(value)} getSuggestions={text => text.includes("@") ? ["example.com", "example.org"].filter(domain => domain.startsWith(text.split("@")[1]) && domain !== text.split("@")[1]).map(domain => text.split("@")[0] + "@" + domain) : []}/><p role="status">{submitted ? `Enter 提交：${submitted}` : ""}</p></div>;
}
