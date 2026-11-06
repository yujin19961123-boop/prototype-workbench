import { useEffect, useRef } from "react";
import { MoreVertical, Plus, Search, Send, Video } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/action-button";
import { Input } from "@/components/ui/input";
import { SearchField } from "@/components/ui/search-field";
import { Message, MessageAvatar, MessageContent } from "@/components/ui/message";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import { MessageScrollerProvider, MessageScroller, MessageScrollerViewport, MessageScrollerContent, MessageScrollerItem } from "@/components/ui/message-scroller";
import "./im-workspace.css";

export type IMConversation = {
  id: string;
  name: string;
  preview: string;
  time: string;
  initials: string;
  color: "purple" | "cyan" | "gold" | "green";
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
  color?: IMConversation["color"];
};

export function IMWorkspace({ conversations, selectedId, messages, query, filter, draft, onQueryChange, onFilterChange, onSelect, onDraftChange, onSend }: {
  conversations: readonly IMConversation[];
  selectedId: string | null;
  messages: readonly IMMessage[];
  query: string;
  filter: "all" | "unread" | "mention";
  draft: string;
  onQueryChange: (query: string) => void;
  onFilterChange: (filter: "all" | "unread" | "mention") => void;
  onSelect: (id: string) => void;
  onDraftChange: (draft: string) => void;
  onSend: () => void;
}) {
  const current = conversations.find(conversation => conversation.id === selectedId);
  const timeline = useRef<HTMLDivElement>(null);
  const composing = useRef(false);
  const lastMessageId = messages.at(-1)?.id;
  useEffect(() => {
    const viewport = timeline.current?.querySelector<HTMLElement>("[data-slot=message-scroller-viewport]");
    if (viewport) viewport.scrollTop = viewport.scrollHeight;
  }, [selectedId, lastMessageId, messages.length]);
  useEffect(() => { composing.current = false; }, [selectedId]);

  return <section className="im-workspace" aria-label="即时消息工作区">
    <aside className="im-conversations" aria-label="会话列表">
      <header className="im-conversation-heading"><h1>Chats</h1><IconButton label="更多会话操作" disabled><MoreVertical size={20}/></IconButton></header>
      <div className="im-conversation-search"><SearchField aria-label="搜索会话" placeholder="Search" value={query} onChange={event => onQueryChange(event.target.value)} leading={<Search size={17}/>} trailing={null}/></div>
      <div className="im-conversation-filters" role="group" aria-label="会话筛选">
        {([ ["all", "All"], ["unread", "Unread"], ["mention", "@Me"] ] as const).map(([value, label]) => <Button key={value} variant={filter === value ? "secondary" : "outline"} size="sm" aria-pressed={filter === value} onClick={() => onFilterChange(value)}>{label}</Button>)}
      </div>
      <div className="im-conversation-list">
        {conversations.length ? conversations.map(conversation => <Button key={conversation.id} variant="ghost" className="im-conversation-row" aria-pressed={selectedId === conversation.id} onClick={() => onSelect(conversation.id)}>
          <Avatar className="im-avatar" data-color={conversation.color}><AvatarFallback>{conversation.initials}</AvatarFallback></Avatar>
          <span className="im-conversation-copy"><span className="im-conversation-name">{conversation.name}</span><span className="im-conversation-preview">{conversation.preview}</span></span>
          <span className="im-conversation-meta"><time>{conversation.time}</time>{conversation.unread && <span className="im-unread-dot" aria-label="未读"/>}{conversation.mention && <span className="im-mention-mark" aria-label="提及我">@</span>}</span>
        </Button>) : <p className="im-empty" role="status">没有匹配的会话</p>}
      </div>
    </aside>

    <section className="im-thread" aria-label={current ? `${current.name} 会话` : "消息内容"}>
      <header className="im-thread-header">{current ? <><Avatar className="im-avatar" data-color={current.color}><AvatarFallback>{current.initials}</AvatarFallback></Avatar><div className="im-thread-identity"><h2>{current.name}</h2><p>{current.kind === "group" ? "Group conversation" : "Conversation"}</p></div><IconButton label="视频通话" disabled><Video size={20}/></IconButton><IconButton label="更多消息操作" disabled><MoreVertical size={20}/></IconButton></> : <h2>选择一个会话</h2>}</header>
      <div className="im-timeline" ref={timeline} role="log" aria-label="消息记录" aria-live="polite" aria-relevant="additions">
        <MessageScrollerProvider key={selectedId ?? "no-conversation"}><MessageScroller><MessageScrollerViewport><MessageScrollerContent className="im-message-list">
          {current && messages.length ? messages.map(message => <MessageScrollerItem key={message.id} scrollAnchor={message.id === lastMessageId}>
            <Message align={message.outgoing ? "end" : "start"} className="im-message">
              {!message.outgoing && <MessageAvatar className="im-message-avatar"><Avatar className="im-avatar" data-color={message.color ?? current.color}><AvatarFallback>{message.initials || message.sender?.slice(0, 1) || current.initials}</AvatarFallback></Avatar></MessageAvatar>}
              <MessageContent><Bubble variant={message.outgoing ? "tinted" : "outline"} align={message.outgoing ? "end" : "start"} className="im-message-bubble"><BubbleContent>
                {!message.outgoing && message.sender && <span className="im-message-sender">{message.sender}</span>}
                <p className="im-message-text">{message.text}</p><time className="im-message-time">{message.time}</time>
              </BubbleContent></Bubble></MessageContent>
            </Message>
          </MessageScrollerItem>) : <p className="im-empty" role="status">{current ? "还没有消息，发送第一条消息吧" : "从左侧选择会话查看消息"}</p>}
        </MessageScrollerContent></MessageScrollerViewport></MessageScroller></MessageScrollerProvider>
      </div>
      <div className="im-composer-wrap"><form className="im-composer" aria-label="发送消息" onSubmit={event => { event.preventDefault(); if (current && draft.trim() && !composing.current) onSend(); }}>
        <IconButton label="添加附件" disabled><Plus size={21}/></IconButton>
        <Input aria-label="消息内容" placeholder="Type a message…" autoComplete="off" value={draft} disabled={!current} onChange={event => onDraftChange(event.target.value)} onCompositionStart={() => { composing.current = true; }} onCompositionEnd={() => { composing.current = false; }} onKeyDown={event => { if (event.key === "Enter" && (event.nativeEvent.isComposing || composing.current || event.keyCode === 229 || event.repeat)) event.preventDefault(); }}/>
        <IconButton label="发送消息" type="submit" disabled={!current || !draft.trim()}><Send size={20}/></IconButton>
      </form></div>
    </section>
  </section>;
}
