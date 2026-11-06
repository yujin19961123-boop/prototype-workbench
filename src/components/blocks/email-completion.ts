/** Accepts only a current candidate. Shift+Tab, IME and closed popups preserve native behavior. */
export function completionForKey({ key, open, suggestions, highlighted, composing = false, modified = false }: { key: string; open: boolean; suggestions: readonly string[]; highlighted?: string | null; composing?: boolean; modified?: boolean }): string | null {
  if (!open || composing || modified || !suggestions.length || !["Enter", "Tab"].includes(key)) return null;
  return highlighted && suggestions.includes(highlighted) ? highlighted : suggestions[0];
}
export function shouldSubmitEmailForKey(input: Parameters<typeof completionForKey>[0] & { repeat?: boolean }): boolean {
  return input.key === "Enter" && !input.composing && !input.modified && !input.repeat && !completionForKey(input);
}
