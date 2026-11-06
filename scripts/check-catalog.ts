import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { componentExports } from "../src/workbench/catalog/source.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const catalog = JSON.parse(
  fs.readFileSync(
    path.join(root, "src/workbench/catalog/catalog.json"),
    "utf8",
  ),
) as {
  id: string;
  kind: string;
  platform: string;
  demoFile: string;
  demoExport: string;
  source?: string;
}[];
function walk(directory: string): string[] {
  return fs
    .readdirSync(directory, { withFileTypes: true })
    .flatMap((item) =>
      item.isDirectory()
        ? walk(path.join(directory, item.name))
        : item.name.endsWith(".tsx")
          ? [path.join(directory, item.name)]
          : [],
    );
}
const files = walk(path.join(root, "src/components"));
const sourceOf = (entry: (typeof catalog)[number]) =>
  entry.source ??
  `src/components/${entry.kind === "atoms" ? "ui" : "blocks"}/${entry.id}.tsx`;
const errors: string[] = [];
const seen = new Set<string>();
let exportCount = 0;
for (const entry of catalog) {
  if (seen.has(entry.id)) errors.push(`重复目录 ID：${entry.id}`);
  seen.add(entry.id);
  if (
    !["atoms", "blocks"].includes(entry.kind) ||
    !["desktop", "mobile", "shared"].includes(entry.platform)
  )
    errors.push(`分类无效：${entry.id}`);
  const sourcePath = path.join(root, sourceOf(entry));
  if (!fs.existsSync(sourcePath)) {
    errors.push(`源码不存在：${sourceOf(entry)}`);
    continue;
  }
  const source = fs.readFileSync(sourcePath, "utf8");
  const exports = componentExports(source);
  exportCount += exports.length;
  const demoPath = path.join(
    root,
    `src/workbench/catalog/demos/${entry.demoFile}.tsx`,
  );
  if (!fs.existsSync(demoPath)) {
    errors.push(`示例文件不存在：${entry.demoFile}`);
    continue;
  }
  const demo = fs.readFileSync(demoPath, "utf8");
  const start = demo.indexOf(`export function ${entry.demoExport}(`);
  if (start < 0) {
    errors.push(`示例函数不存在：${entry.demoExport}`);
    continue;
  }
  const end = demo.indexOf("\nexport function ", start + 1);
  const body = demo.slice(start, end < 0 ? undefined : end);
  if (
    !demo.includes(
      `@/${sourceOf(entry)
        .replace(/^src\//, "")
        .replace(/\.tsx$/, "")}`,
    )
  )
    errors.push(`示例未导入对应组件模块：${entry.id}`);
  for (const name of exports) {
    const jsx = new RegExp(`<(?:(?:[A-Za-z_$][\\w$]*)\\.)?${name}(?=[\\s/>])`);
    // Some family exports (e.g. select scroll buttons) are already rendered internally.
    if (!jsx.test(body) && !jsx.test(source))
      errors.push(`导出组件缺少预览：${entry.id} → ${name}`);
  }
}
for (const file of files) {
  const relative = path.relative(root, file).replaceAll("\\", "/");
  const registrations = catalog.filter((entry) => sourceOf(entry) === relative);
  if (registrations.length !== 1)
    errors.push(
      `源码必须恰有一个目录登记（当前 ${registrations.length}）：${relative}`,
    );
}
if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else
  console.log(
    `组件目录覆盖检查通过：${files.length} 个源码文件，${exportCount} 个导出组件，${catalog.length} 个独立预览页。`,
  );
