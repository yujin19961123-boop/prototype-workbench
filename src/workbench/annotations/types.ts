/** Developer notes are read-only documentation, never business validation. */
export interface PrototypeAnnotation {
  id: string;
  number: number;
  title: string;
  category: string;
  status: "已确认" | "待确认";
  pages: string[];
  /** Stable DOM selector; null keeps the rule in the list without a pin. */
  selector: string | null;
  /** Optional visible UI context required for this rule to appear in the list/count. */
  visibleWhen?: string;
  sections: Record<string, string>;
  basis: string;
}
