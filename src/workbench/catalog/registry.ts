import catalog from "./catalog.json";
import { lazy, type ComponentType } from "react";

export type Device = "desktop" | "mobile";
export type Kind = "atoms" | "blocks";
export type CatalogEntry = {
  id: string;
  title: string;
  description: string;
  kind: Kind;
  platform: "shared" | Device;
  demoFile: string;
  demoExport: string;
  height?: number;
  maturity?: "candidate" | "adapted" | "pattern";
  visualReview?: "pending" | "accepted";
  source?: string;
};
export const entries = catalog as CatalogEntry[];
export const sourcePath = (entry: CatalogEntry) =>
  entry.source ??
  `src/components/${entry.kind === "atoms" ? "ui" : "blocks"}/${entry.id}.tsx`;
const demos = import.meta.glob<Record<string, ComponentType>>("./demos/*.tsx");
const sources = import.meta.glob<string>("/src/components/**/*.tsx", {
  query: "?raw",
  import: "default",
});
export const demoComponents = new Map(
  entries.map((entry) => [
    entry.id,
    lazy(async () => ({
      default: (await demos[`./demos/${entry.demoFile}.tsx`]())[
        entry.demoExport
      ],
    })),
  ]),
);
export function loadSource(entry: CatalogEntry) {
  return sources[`/${sourcePath(entry)}`]();
}
export function loadExample(entry: CatalogEntry) {
  return import.meta
    .glob<string>("./demos/*.tsx", { query: "?raw", import: "default" })
    [`./demos/${entry.demoFile}.tsx`]();
}
export function exampleBody(source: string, entry: CatalogEntry) {
  const start = source.indexOf(`export function ${entry.demoExport}(`);
  const next = source.indexOf("\nexport function ", start + 1);
  const body = source.slice(start, next < 0 ? undefined : next).trim();
  const imports = source.split("\n").filter((line) => {
    if (!line.startsWith("import ")) return false;
    const bindings = line
      .slice(7, line.indexOf(" from "))
      .replace(/[{}*]/g, "")
      .replace(/\bas\b/g, "")
      .trim()
      .split(/[\s,]+/);
    return bindings.some(
      (binding) => binding && new RegExp(`\\b${binding}\\b`).test(body),
    );
  });
  return `${imports.join("\n")}\n\n${body}`;
}
export function catalogHash(device: Device, kind: Kind, id: string) {
  return `#components/${device}/${kind}/${id}`;
}
