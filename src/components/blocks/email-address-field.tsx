import { useId, useRef, useState, type ReactNode, type Ref } from "react";
import { Combobox, ComboboxInput, ComboboxContent, ComboboxList, ComboboxItem } from "@/components/ui/combobox";
import { FormField } from "./form-field";
import { useModalFormContainer } from "./modal-form-layout";
import { completionForKey, shouldSubmitEmailForKey } from "./email-completion";
import "./form-patterns.css";

export function EmailAddressField({ id: suppliedId, label = "邮箱地址", value, onValueChange, getSuggestions, error, onBlur, onSubmit, trailing, inputRef }: { id?: string; label?: string; value: string; onValueChange: (value: string) => void; getSuggestions: (value: string) => string[]; error?: string; onBlur?: () => void; onSubmit?: () => void; trailing?: ReactNode; inputRef?: Ref<HTMLInputElement> }) {
  const generatedId = useId(), id = suppliedId ?? generatedId, portalContainer = useModalFormContainer();
  const [open, setOpen] = useState(false), highlighted = useRef<string | null>(null);
  const suggestions = getSuggestions(value);
  function accept(email: string) { highlighted.current = null; onValueChange(email); setOpen(false); }
  return <FormField id={id} label={label} error={error}>
    <Combobox items={suggestions} filter={null} value={null} autoHighlight inputValue={value} onItemHighlighted={item => { highlighted.current = item ?? null; }} onInputValueChange={(next, details) => {
      if (details.reason === "input-clear" || details.reason === "none") { details.cancel(); return; }
      highlighted.current = null; onValueChange(next); setOpen(true);
    }} onValueChange={next => { if (next) accept(next); }} open={open && suggestions.length > 0} onOpenChange={setOpen}>
      <ComboboxInput ref={inputRef} id={id} className="product-email-control" showTrigger={false} aria-label={label} aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined} placeholder="name@example.com" inputMode="email" autoComplete="off" onBlur={onBlur} onKeyDown={event => {
        if (event.nativeEvent.isComposing || event.nativeEvent.keyCode === 229) { if (event.key === "Enter") event.preventBaseUIHandler(); return; }
        const keyState = { key: event.key, open, suggestions, highlighted: highlighted.current, modified: event.shiftKey || event.ctrlKey || event.altKey || event.metaKey, repeat: event.repeat };
        const completion = completionForKey(keyState);
        if (!completion) {
          if (onSubmit && shouldSubmitEmailForKey(keyState)) { event.preventBaseUIHandler(); event.preventDefault(); onSubmit(); }
          return;
        }
        event.preventBaseUIHandler(); if (event.key === "Enter") event.preventDefault();
        accept(completion);
      }}>{trailing}</ComboboxInput>
      <ComboboxContent portalContainer={portalContainer} className="product-email-suggestions"><ComboboxList>{(email: string) => <ComboboxItem key={email} value={email}>{email}</ComboboxItem>}</ComboboxList></ComboboxContent>
    </Combobox>
  </FormField>;
}
