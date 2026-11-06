import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "./input-group";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu";
import { parseIntegerValue } from "@/lib/integer-value";
import { cn } from "@/lib/utils";
import "./integer-select.css";

/** The input edits an integer; only the arrow opens preset choices. */
export function IntegerSelect({ value, onValueChange, options, label, min = 1, disabled = false, className }: { value: number; onValueChange: (value: number) => void; options: readonly number[]; label: string; min?: number; disabled?: boolean; className?: string }) {
  const [draft, setDraft] = useState(String(value)), [invalid, setInvalid] = useState(false);
  const input = useRef<HTMLInputElement | null>(null), pending = useRef<number | null>(null), id = useId();
  useEffect(() => { setDraft(String(value)); setInvalid(false); }, [value, disabled]);
  function accept(number: number) { setDraft(String(number)); setInvalid(false); if (number !== value) onValueChange(number); }
  function commit() { const number = parseIntegerValue(draft, min); if (number === null) setInvalid(true); else accept(number); }
  return <div className={cn("product-integer-select", className)}>
    <InputGroup>
      <InputGroupInput ref={input} aria-label={label} aria-invalid={invalid} aria-describedby={invalid ? `${id}-error` : undefined} inputMode="numeric" autoComplete="off" disabled={disabled} value={draft} onChange={event => { setDraft(event.target.value); setInvalid(false); }} onBlur={commit} onKeyDown={event => { if (event.nativeEvent.isComposing || event.nativeEvent.keyCode === 229) return; if (event.key === "Enter") { event.preventDefault(); commit(); } else if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); setDraft(String(value)); setInvalid(false); } }}/>
      <InputGroupAddon align="inline-end"><DropdownMenu><DropdownMenuTrigger asChild><InputGroupButton size="icon-xs" disabled={disabled} aria-label={`Choose ${label}`}><ChevronDown size={14}/></InputGroupButton></DropdownMenuTrigger><DropdownMenuContent aria-label={`${label} presets`} align="end" onCloseAutoFocus={event => { event.preventDefault(); input.current?.focus(); if (pending.current !== null) { const number = pending.current; pending.current = null; accept(number); } }}>
        {options.filter(number => Number.isSafeInteger(number) && number >= min).map(number => <DropdownMenuItem key={number} onSelect={() => { pending.current = number; }}><span>{number}</span>{number === value && <Check size={14} aria-hidden="true"/>}</DropdownMenuItem>)}
      </DropdownMenuContent></DropdownMenu></InputGroupAddon>
    </InputGroup>
    {invalid && <p id={`${id}-error`} role="alert">Enter a whole number of at least {min}.</p>}
  </div>;
}
