import { useState } from "react";

import { ServerSettingsFields } from "@/components/blocks/server-settings-fields";

export function ServerSettingsFieldsDemo() {
  const [values, setValues] = useState({ imap: "imap.example.com", imapPort: "993", smtp: "smtp.example.com", smtpPort: "465" });
  const [encryption, setEncryption] = useState({ imapSSL: true, smtpSSL: true, startTLS: false });
  return <div className="w-full max-w-lg"><ServerSettingsFields values={values} encryption={encryption} onValueChange={(name, value) => setValues(old => ({ ...old, [name]: value }))} onEncryptionChange={(name, value) => setEncryption(old => ({ ...old, [name]: value }))}/></div>;
}
