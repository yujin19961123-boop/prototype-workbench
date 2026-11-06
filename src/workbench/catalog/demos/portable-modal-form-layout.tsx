import { useState } from "react";

import { Button } from "@/components/ui/button";

import { Dialog, DialogClose } from "@/components/ui/dialog";

import { EmailAddressField } from "@/components/blocks/email-address-field";

import { ModalFormLayout } from "@/components/blocks/modal-form-layout";

export function ModalFormLayoutDemo() {
  const [open, setOpen] = useState(false), [email, setEmail] = useState("");
  return <><Button variant="outline" onClick={() => setOpen(true)}>打开表单布局</Button><Dialog open={open} onOpenChange={setOpen}><ModalFormLayout title="表单弹窗" footer={<DialogClose asChild><Button>完成</Button></DialogClose>}><EmailAddressField value={email} onValueChange={setEmail} getSuggestions={text => text.endsWith("@") ? [text + "example.com"] : []}/></ModalFormLayout></Dialog></>;
}
