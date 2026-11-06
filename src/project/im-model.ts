export type IMColor = "purple" | "cyan" | "gold" | "green";
export type IMFilter = "all" | "unread" | "mention";
export type IMConversation = {
  id: string;
  name: string;
  preview: string;
  time: string;
  initials: string;
  color: IMColor;
  kind: "group" | "person";
  unread?: boolean;
  mention?: boolean;
};
export type IMMessage = {
  id: string;
  text: string;
  time: string;
  sender?: string;
  outgoing?: boolean;
  initials?: string;
  color?: IMColor;
};
export type IMState = {
  selectedId: string;
  query: string;
  filter: IMFilter;
  drafts: Record<string, string>;
  history: Record<string, IMMessage[]>;
  nextMessageId: number;
};

export const conversations: readonly IMConversation[] = [
  { id: "project", name: "项目协作群", preview: "陈美玲：我会在下午评审前补齐交互说明。", time: "10:32", initials: "项", color: "purple", kind: "group", mention: true, unread: true },
  { id: "review", name: "产品评审", preview: "Jordan Lee：评审议程已经更新，欢迎补充问题。", time: "10:18", initials: "评", color: "cyan", kind: "group", unread: true },
  { id: "mei", name: "陈美玲", preview: "新版组件的边界状态我已经整理好了。", time: "09:46", initials: "陈", color: "green", kind: "person" },
  { id: "jordan", name: "Jordan Lee", preview: "Thanks! I will review the interaction notes this afternoon.", time: "09:20", initials: "JL", color: "gold", kind: "person" },
];

const initialHistory: Record<string, IMMessage[]> = {
  project: [
    { id: "project-1", sender: "Jordan Lee", initials: "JL", color: "gold", text: "上午好，今天先确认筛选和详情切换两个流程。测试时发现的问题直接记在这里。", time: "10:24" },
    { id: "project-2", outgoing: true, initials: "我", color: "cyan", text: "收到。我先检查空列表、搜索无结果和窗口缩小时的表现，下午一起过一遍。", time: "10:28" },
    { id: "project-3", sender: "陈美玲", initials: "陈", color: "green", text: "@我 新版组件已经可以预览，我会在下午评审前补齐交互说明。", time: "10:32" },
  ],
  review: [
    { id: "review-1", sender: "陈美玲", initials: "陈", color: "green", text: "产品评审定在今天 14:00，重点看列表、表单和消息三个场景。", time: "10:10" },
    { id: "review-2", sender: "Jordan Lee", initials: "JL", color: "gold", text: "评审议程已经更新，欢迎补充问题。", time: "10:18" },
  ],
  mei: [
    { id: "mei-1", sender: "陈美玲", initials: "陈", color: "green", text: "新版组件的边界状态我已经整理好了。你方便的时候看一下，我们把共用规则一起确认。", time: "09:46" },
  ],
  jordan: [
    { id: "jordan-1", outgoing: true, initials: "我", color: "cyan", text: "The interaction notes are ready. Please check the keyboard navigation when you have time.", time: "09:15" },
    { id: "jordan-2", sender: "Jordan Lee", initials: "JL", color: "gold", text: "Thanks! I will review the interaction notes this afternoon.", time: "09:20" },
  ],
};

export function initialIMState(): IMState {
  return {
    selectedId: conversations[0].id,
    query: "",
    filter: "all",
    drafts: Object.fromEntries(conversations.map(conversation => [conversation.id, ""])),
    history: Object.fromEntries(Object.entries(initialHistory).map(([id, messages]) => [id, messages.map(message => ({ ...message }))])),
    nextMessageId: 1,
  };
}

function hasConversation(id: string) { return conversations.some(conversation => conversation.id === id); }

export function setIMQuery(state: IMState, query: string): IMState {
  return state.query === query ? state : { ...state, query };
}

export function setIMFilter(state: IMState, filter: IMFilter): IMState {
  return !["all", "unread", "mention"].includes(filter) || state.filter === filter ? state : { ...state, filter };
}

export function selectIMConversation(state: IMState, id: string): IMState {
  return !hasConversation(id) || state.selectedId === id ? state : { ...state, selectedId: id };
}

export function updateIMDraft(state: IMState, id: string, value: string): IMState {
  if (!hasConversation(id) || state.drafts[id] === value) return state;
  return { ...state, drafts: { ...state.drafts, [id]: value } };
}

export function sendIMMessage(state: IMState, time: string): IMState {
  if (!hasConversation(state.selectedId)) return state;
  const text = (state.drafts[state.selectedId] ?? "").trim();
  if (!text) return state;
  const message: IMMessage = {
    id: `${state.selectedId}-local-${state.nextMessageId}`,
    text, time, outgoing: true, initials: "我", color: "cyan",
  };
  return {
    ...state,
    drafts: { ...state.drafts, [state.selectedId]: "" },
    history: { ...state.history, [state.selectedId]: [...(state.history[state.selectedId] ?? []), message] },
    nextMessageId: state.nextMessageId + 1,
  };
}

/** Display state is derived; sending does not mutate conversation fixtures or read status. */
export function visibleIMConversations(state: IMState): IMConversation[] {
  const key = state.query.trim().normalize("NFKC").toLowerCase();
  return conversations.map(conversation => {
    const latest = state.history[conversation.id]?.at(-1);
    return latest ? { ...conversation, preview: `${latest.outgoing ? "我" : latest.sender ?? conversation.name}：${latest.text}`, time: latest.time } : { ...conversation };
  }).filter(conversation => `${conversation.name} ${conversation.preview}`.normalize("NFKC").toLowerCase().includes(key)
    && (state.filter === "all" || (state.filter === "unread" ? conversation.unread : conversation.mention)));
}
