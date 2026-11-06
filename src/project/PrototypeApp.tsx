import { Activity, useState } from "react";
import { ApplicationShell } from "@/components/blocks/application-shell";
import { projectConfig } from "../project.config";
import { desktopApps } from "./desktop-apps";

/** One application shell and stable page instances for all product apps. */
export default function PrototypeApp() {
  const [activeId, setActiveId] = useState(desktopApps[0].id);
  return <ApplicationShell title={projectConfig.name} logo={{ src: projectConfig.logo, alt: projectConfig.logoAlt }} items={desktopApps} activeId={activeId} onSelect={setActiveId}>
    {desktopApps.map(({ id, Page }) => <Activity key={id} name={id} mode={activeId === id ? "visible" : "hidden"}><Page/></Activity>)}
  </ApplicationShell>;
}
