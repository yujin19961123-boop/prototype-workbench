import { useId, useState } from "react";
import { FormField } from "@/components/blocks/form-field";
import { ModalFormLayout } from "@/components/blocks/modal-form-layout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export default function FormDialogRecipe() {
  const formId = useId();
  const nameId = useId();
  const notificationId = useId();
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState({ name: "项目协作空间", notifications: true });
  const [draft, setDraft] = useState(saved);

  function changeOpen(next: boolean) {
    if (next) setDraft(saved);
    setOpen(next);
  }

  return <div className="grid content-start gap-4 p-6">
    <p role="status">{saved.name} · {saved.notifications ? "已开启通知" : "已关闭通知"}</p>
    <Dialog open={open} onOpenChange={changeOpen}>
      <DialogTrigger asChild><Button className="justify-self-start">编辑偏好</Button></DialogTrigger>
      <ModalFormLayout title="编辑偏好" footer={<>
        <Button variant="outline" onClick={() => changeOpen(false)}>取消</Button>
        <Button type="submit" form={formId} disabled={!draft.name.trim()}>保存</Button>
      </>}>
        <form id={formId} className="grid gap-4" onSubmit={event => {
          event.preventDefault();
          const name = draft.name.trim();
          if (!name) return;
          setSaved({ ...draft, name });
          changeOpen(false);
        }}>
          <FormField id={nameId} label="显示名称" required><Input id={nameId} required value={draft.name} onChange={event => setDraft({ ...draft, name: event.target.value })}/></FormField>
          <label htmlFor={notificationId} className="flex items-center gap-2">
            <Checkbox id={notificationId} checked={draft.notifications} onCheckedChange={checked => setDraft({ ...draft, notifications: checked === true })}/>
            接收通知
          </label>
        </form>
      </ModalFormLayout>
    </Dialog>
  </div>;
}
