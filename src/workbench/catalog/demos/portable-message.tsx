import * as B from "@/components/ui/bubble";

import * as M from "@/components/ui/message";

export function MessageDemo() {
  return (
    <M.MessageGroup className="w-full max-w-lg gap-6">
      <M.Message>
        <M.MessageAvatar>
          <img
            className="size-8 object-cover"
            src="/avatars/shadcn.png"
            alt="样本头像"
          />
        </M.MessageAvatar>
        <M.MessageContent>
          <M.MessageHeader>示例联系人 · 10:30</M.MessageHeader>
          <B.Bubble variant="muted">
            <B.BubbleContent>
              Message 提供头像、标题、内容和底部的结构。
            </B.BubbleContent>
          </B.Bubble>
          <M.MessageFooter>消息样本</M.MessageFooter>
        </M.MessageContent>
      </M.Message>
      <M.Message align="end">
        <M.MessageAvatar>
          <span className="flex size-8 items-center justify-center text-xs">
            我
          </span>
        </M.MessageAvatar>
        <M.MessageContent>
          <M.MessageHeader>我 · 10:31</M.MessageHeader>
          <B.Bubble>
            <B.BubbleContent>可以与 Bubble 原子组合使用。</B.BubbleContent>
          </B.Bubble>
          <M.MessageFooter>状态展示样本</M.MessageFooter>
        </M.MessageContent>
      </M.Message>
    </M.MessageGroup>
  );
}
