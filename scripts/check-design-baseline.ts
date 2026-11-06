import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = JSON.parse(fs.readFileSync(path.join(root, "src/design-system/tokens.json"), "utf8"));
const baseline = JSON.parse(fs.readFileSync(path.join(root, "src/design-system/baseline-v1.json"), "utf8"));
// Compare named roles only: new roles and all page CSS / Block APIs stay extensible.
const canonical = (value: unknown): string => {
  if (value && typeof value === "object" && !Array.isArray(value))
    return JSON.stringify(Object.entries(value).sort(([a], [b]) => a.localeCompare(b)).map(([key, item]) => [key, canonical(item)]));
  return JSON.stringify(value);
};
const changed = Object.entries(baseline.values).filter(([key, expected]) => {
  const actual = key.split(".").reduce((value: any, part) => value?.[part], source);
  return canonical(actual) !== canonical(expected);
});
if (changed.length)
  throw new Error(`基础规范 ${baseline.version} 发生变化：${changed.map(([key]) => key).join("、")}。有意调整时同步 baseline-v1.json，并在 docs/design-system-freeze-v1.md 记录版本和原因；不要求冻结页面 CSS 或 Block API。`);
console.log(`基础规范 ${baseline.version} 校验通过：${Object.keys(baseline.values).length} 个限定条目；页面与业务 API 不参与冻结。`);
