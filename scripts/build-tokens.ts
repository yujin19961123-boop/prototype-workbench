import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const data = JSON.parse(
  fs.readFileSync(path.join(root, "src/design-system/tokens.json"), "utf8"),
);
for (const [name, palette] of Object.entries(data.palettes) as [
  string,
  { steps: Record<string, string> },
][]) {
  for (const step of ["50", "100", "300", "500", "700"]) {
    if (!/^#[0-9a-f]{6}$/i.test(palette.steps[step] ?? ""))
      throw new Error(`色阶缺失或格式错误：${name}-${step}`);
  }
}
for (const [step, value] of Object.entries(data.spacing)) {
  if (value !== Number(step) * data.spacing["1"])
    throw new Error(`间距刻度不同步：sp-${step} 应为基础单位的 ${step} 倍`);
}
for (const [name, type] of Object.entries(data.type) as [
  string,
  { size: number; line: number; weight: number },
][]) {
  if (
    type.size <= 0 ||
    type.line < type.size ||
    type.weight < 100 ||
    type.weight > 900
  )
    throw new Error(`排版刻度无效：${name}`);
}
const variables = new Map<string, string>();
function add(name: string, value: string) {
  if (variables.has(name)) throw new Error(`重复变量：${name}`);
  variables.set(name, value);
}
for (const [name, palette] of Object.entries(data.palettes) as [
  string,
  { steps: Record<string, string> },
][]) {
  for (const [step, value] of Object.entries(palette.steps))
    add(`--palette-${name}-${step}`, value);
}
for (const [name, type] of Object.entries(data.type) as [
  string,
  { size: number; line: number; weight: number },
][]) {
  add(`--type-${name}-size`, `${type.size}px`);
  add(`--type-${name}-line`, `${type.line}px`);
  add(`--type-${name}-weight`, String(type.weight));
}
for (const [group, prefix] of [
  ["spacing", "space"],
  ["radii", "curve"],
  ["sizes", "size"],
]) {
  for (const [name, value] of Object.entries(data[group]))
    add(`--${prefix}-${name}`, `${value}px`);
}
for (const [name, value] of Object.entries(data.tokens) as [string, string][])
  add(name, value);
function verify(name: string, stack: string[] = []) {
  if (stack.includes(name))
    throw new Error(`变量循环引用：${[...stack, name].join(" → ")}`);
  if (!variables.has(name)) throw new Error(`未定义变量：${name}`);
  for (const match of variables.get(name)!.matchAll(/var\((--[\w-]+)/g))
    verify(match[1], [...stack, name]);
}
for (const name of variables.keys()) verify(name);
const content = `/* GENERATED from src/design-system/tokens.json. Run npm run tokens:generate.\n   Evidence and provisional choices: docs/design-system.md. */\n:root {\n${[...variables].map(([name, value]) => `  ${name}: ${value};`).join("\n")}\n}\n`;
const output = path.join(root, "src/styles/tokens.css");
if (process.argv.includes("--check")) {
  if (fs.readFileSync(output, "utf8") !== content)
    throw new Error(
      "tokens.css 与设计系统源文件不同步，请运行 npm run tokens:generate。",
    );
  console.log(`设计变量检查通过：${variables.size} 个变量，无缺失或循环引用。`);
} else {
  fs.writeFileSync(output, content);
  console.log(`已生成 ${variables.size} 个全局设计变量。`);
}
