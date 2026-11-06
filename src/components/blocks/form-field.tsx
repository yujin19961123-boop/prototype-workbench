import type { ReactNode } from "react";
import { Field, FieldLabel, FieldDescription, FieldError } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import "./form-patterns.css";

/** The caller binds the control's id and aria-describedby to these stable IDs. */
export function FormField({ id, label, description, error, children, className, density = "compact", required = false }: { id: string; label: ReactNode; description?: ReactNode; error?: ReactNode; children: ReactNode; className?: string; density?: "compact" | "default"; required?: boolean }) {
  return <Field className={cn("product-form-field", className)} data-density={density} data-invalid={!!error}>
    <FieldLabel htmlFor={id}>{label}{required && <span className="product-field-required" aria-hidden="true">*</span>}</FieldLabel>
    {children}
    {description && <FieldDescription id={`${id}-description`}>{description}</FieldDescription>}
    {error && <FieldError id={`${id}-error`}>{error}</FieldError>}
  </Field>;
}
