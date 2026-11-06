import catalog from "./catalog/catalog.json";
import tokens from "@/design-system/tokens.json";
import baseline from "@/design-system/baseline-v1.json";

export const visualReviewLabel = "视觉待验收";
export const workspaceStats = {
  components: catalog.length,
  atoms: catalog.filter(entry => entry.kind === "atoms").length,
  blocks: catalog.filter(entry => entry.kind === "blocks").length,
  tokens: Object.keys(tokens.tokens).length,
  frozen: Object.keys(baseline.values).length,
  version: baseline.version,
};
const frozen = new Set(Object.keys(baseline.values));
export const isFrozenRole = (path: string) => frozen.has(path);

const layerLabels: Record<string, string> = {
  "--layer-overlay": "遮罩",
  "--layer-dialog": "对话框",
  "--layer-dropdown": "菜单与浮动面板",
  "--layer-tooltip": "Tooltip 提示",
  "--layer-feedback": "Toast 反馈",
};
export const layerRoles = Object.entries(tokens.tokens)
  .filter(([name]) => name.startsWith("--layer-"))
  .map(([name, value]) => ({ name, value, label: layerLabels[name] ?? name }))
  .sort((a, b) => Number(a.value) - Number(b.value));

