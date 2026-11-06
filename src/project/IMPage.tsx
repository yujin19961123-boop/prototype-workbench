import { useState } from "react";
import { IMWorkspace } from "@/components/blocks/im-workspace";
import { initialIMState, selectIMConversation, sendIMMessage, setIMFilter, setIMQuery, updateIMDraft, visibleIMConversations } from "./im-model";

/** Project state lives here; IMWorkspace owns all controls and interaction presentation. */
export default function IMPage() {
  const [state, setState] = useState(initialIMState);
  const visible = visibleIMConversations(state);
  const selected = visible.find(conversation => conversation.id === state.selectedId);
  return <IMWorkspace
    conversations={visible}
    selectedId={selected?.id ?? ""}
    messages={selected ? state.history[selected.id] ?? [] : []}
    query={state.query}
    filter={state.filter}
    draft={selected ? state.drafts[selected.id] ?? "" : ""}
    onQueryChange={query => setState(previous => setIMQuery(previous, query))}
    onFilterChange={filter => setState(previous => setIMFilter(previous, filter))}
    onSelect={id => setState(previous => selectIMConversation(previous, id))}
    onDraftChange={value => { if (selected) setState(previous => updateIMDraft(previous, selected.id, value)); }}
    onSend={() => {
      if (!selected) return;
      const time = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Singapore", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(new Date());
      setState(previous => previous.selectedId === selected.id ? sendIMMessage(previous, time) : previous);
    }}
  />;
}
