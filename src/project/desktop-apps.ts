import { MessageCircle } from "lucide-react";
import IMPage from "./IMPage";

/** Register a desktop application and its page together. The first entry opens by default. */
export const desktopApps = [
  { id: "chats", label: "Chats", icon: MessageCircle, Page: IMPage },
];
