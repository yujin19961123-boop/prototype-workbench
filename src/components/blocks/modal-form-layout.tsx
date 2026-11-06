import { createContext, useContext, useId, useRef, type ComponentProps, type ReactNode, type RefObject } from "react";
import { DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import "./form-patterns.css";

const ContainerContext = createContext<RefObject<HTMLDivElement | null> | undefined>(undefined);
export function useModalFormContainer() { return useContext(ContainerContext); }

/** Owns scrolling, footer, and the portal boundary. The caller owns the Dialog root/open state. */
export function ModalFormLayout({ title, description, footer, children, className, bodyClassName, footerClassName, headingAlign = "start", ...props }: Omit<ComponentProps<typeof DialogContent>, "title"> & { title: ReactNode; description?: ReactNode; footer: ReactNode; bodyClassName?: string; footerClassName?: string; headingAlign?: "start" | "center" }) {
  const container = useRef<HTMLDivElement>(null), id = useId();
  return <ContainerContext.Provider value={container}><DialogContent {...props} ref={container} className={cn("product-modal-form", className)} aria-describedby={description ? `${id}-description` : undefined}>
    <header className="product-modal-form-header" data-align={headingAlign}><DialogTitle>{title}</DialogTitle>{description && <DialogDescription id={`${id}-description`}>{description}</DialogDescription>}</header>
    <div className={cn("product-modal-form-body", bodyClassName)}>{children}</div>
    <footer className={cn("product-modal-form-footer", footerClassName)}>{footer}</footer>
  </DialogContent></ContainerContext.Provider>;
}
