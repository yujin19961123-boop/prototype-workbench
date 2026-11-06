import * as Attachment from "@/components/ui/attachment-count";

export function AttachmentCountDemo() {
  return (
    <div className="flex flex-wrap gap-3">
      <Attachment.AttachmentCount count={3} />
      <Attachment.AttachmentCount kind="image" count={6} />
      <Attachment.AttachmentCount kind="video" count={1} />
    </div>
  );
}
