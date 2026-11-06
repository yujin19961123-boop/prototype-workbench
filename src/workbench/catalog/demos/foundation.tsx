import { useState } from "react";
import { LayoutDashboard, MessageCircle } from "lucide-react";
import { ApplicationShell } from "@/components/blocks/application-shell";
import {
  IMWorkspace,
  type IMConversation,
  type IMMessage,
} from "@/components/blocks/im-workspace";

export function ApplicationShellDemo() {
  const [activeId, setActiveId] = useState("overview");
  const items = [
    { id: "overview", label: "工作区", icon: LayoutDashboard },
    { id: "messages", label: "消息", icon: MessageCircle },
  ];
  return (
    <div className="h-[600px] w-full overflow-hidden rounded-lg border">
      <ApplicationShell
        title="产品工作区"
        items={items}
        activeId={activeId}
        onSelect={setActiveId}
      >
        <div className="h-full p-6">
          <h2 className="text-section-title">
            {activeId === "overview" ? "工作区" : "消息"}
          </h2>
          <p className="mt-3 text-sm text-muted-foreground" role="status">
            {activeId === "overview"
              ? "这里由页面插槽提供工作区内容。"
              : "应用已切换，外壳及导航保持同一实例。"}
          </p>
        </div>
      </ApplicationShell>
    </div>
  );
}

export function IMWorkspaceDemo() {
  const [conversations, setConversations] = useState<IMConversation[]>([
    {
      id: "review",
      name: "产品评审协作群",
      preview: "林语：评审材料已经整理好了。",
      time: "10:30",
      initials: "评",
      color: "purple",
      kind: "group",
      mention: true,
    },
    {
      id: "lin",
      name: "林语",
      preview: "下午一起确认交付范围。",
      time: "09:45",
      initials: "林",
      color: "cyan",
      kind: "person",
      unread: true,
    },
    {
      id: "delivery",
      name: "交付协作群",
      preview: "周敏：客户反馈已更新。",
      time: "昨天",
      initials: "交",
      color: "gold",
      kind: "group",
    },
  ]);
  const [selectedId, setSelectedId] = useState("review");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "unread" | "mention">("all");
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [history, setHistory] = useState<Record<string, IMMessage[]>>({
    review: [
      {
        id: "review-1",
        sender: "林语",
        text: "评审材料已经整理好了，请大家补充各自负责的内容。",
        time: "10:30",
        initials: "林",
        color: "cyan",
      },
      {
        id: "review-2",
        text: "收到，我会在午休前补充交互说明。",
        time: "10:32",
        outgoing: true,
        initials: "我",
        color: "green",
      },
    ],
    lin: [
      {
        id: "lin-1",
        sender: "林语",
        text: "下午一起确认交付范围。",
        time: "09:45",
        initials: "林",
        color: "cyan",
      },
    ],
    delivery: [
      {
        id: "delivery-1",
        sender: "周敏",
        text: "客户反馈已更新，请在明天的同步会上确认后续安排。",
        time: "昨天",
        initials: "周",
        color: "gold",
      },
    ],
  });
  const visible = conversations.filter(
    (conversation) =>
      `${conversation.name} ${conversation.preview}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()) &&
      (filter === "all" ||
        (filter === "unread" && conversation.unread) ||
        (filter === "mention" && conversation.mention)),
  );
  function send() {
    const text = (drafts[selectedId] ?? "").trim();
    if (!text) return;
    const time = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Singapore",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).format(new Date());
    setHistory((previous) => ({
      ...previous,
      [selectedId]: [
        ...(previous[selectedId] ?? []),
        {
          id: crypto.randomUUID(),
          text,
          time,
          outgoing: true,
          initials: "我",
          color: "green",
        },
      ],
    }));
    setDrafts((previous) => ({ ...previous, [selectedId]: "" }));
    setConversations((previous) =>
      previous.map((conversation) =>
        conversation.id === selectedId
          ? { ...conversation, preview: `You: ${text}`, time }
          : conversation,
      ),
    );
  }
  return (
    <div className="h-[680px] w-full overflow-hidden rounded-lg border">
      <IMWorkspace
        conversations={visible}
        selectedId={selectedId}
        messages={history[selectedId] ?? []}
        query={query}
        filter={filter}
        draft={drafts[selectedId] ?? ""}
        onQueryChange={setQuery}
        onFilterChange={setFilter}
        onSelect={setSelectedId}
        onDraftChange={(value) =>
          setDrafts((previous) => ({ ...previous, [selectedId]: value }))
        }
        onSend={send}
      />
    </div>
  );
}
