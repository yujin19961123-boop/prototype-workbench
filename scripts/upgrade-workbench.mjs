import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { parseArgs } from "node:util";
import { compareVersions, filePath, loadManifest, manifestFile, readFile, sha256 } from "./workbench-manifest.mjs";

const jsonBytes = value => Buffer.from(JSON.stringify(value, null, 2) + "\n");
const digest = bytes => bytes === null ? null : sha256(bytes);
const projectTitle = name => name.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

function replaceRequired(text, before, after, file) {
  if (!text.includes(before)) throw new Error(`新版 ${file} 的项目占位结构已变，请先调整升级器。`);
  return text.replace(before, () => after);
}

function personalize(file, bytes, release, target) {
  const { id, name, port } = target.project;
  const template = release.project;
  switch (file) {
    case "package.json": {
      const pkg = JSON.parse(bytes);
      pkg.name = id;
      pkg.scripts.dev = replaceRequired(pkg.scripts.dev, `--port ${template.port}`, `--port ${port}`, file);
      return jsonBytes(pkg);
    }
    case "package-lock.json": {
      const lock = JSON.parse(bytes);
      lock.name = lock.packages[""].name = id;
      return jsonBytes(lock);
    }
    case "vite.config.ts":
      return Buffer.from(replaceRequired(bytes.toString(), `port: ${template.port},`, `port: ${port},`, file));
    case "index.html":
      return Buffer.from(replaceRequired(bytes.toString(), `<title>${projectTitle(template.name)}</title>`, `<title>${projectTitle(name)}</title>`, file));
    case "README.md": {
      const readme = replaceRequired(bytes.toString(), `http://127.0.0.1:${template.port}`, `http://127.0.0.1:${port}`, file);
      return Buffer.from(readme + (target.reference ? "\n已附带可独立解压的 [teleMail 参考包](references/telemail/README.md)。\n" : ""));
    }
    default: return bytes;
  }
}

function matchesBase(file, before, beforeHash, base) {
  if (beforeHash === base) return true;
  if (!before || !base || !/(?:\.(?:[cm]?[jt]sx?|json|md|css|html|svg)|^\.gitignore)$/i.test(file)) return false;
  const text = before.toString("utf8");
  if (!Buffer.from(text).equals(before)) return false;
  const lf = text.replaceAll("\r\n", "\n");
  return sha256(lf) === base || sha256(lf.replaceAll("\n", "\r\n")) === base;
}

export function planUpgrade(target, release, keepLocal = [], takeUpstream = []) {
  if (target.root === release.root || target.manifest.release || !target.manifest.project) {
    throw new Error("目标须为 preview.4 或更新版本初始化的下游项目。");
  }
  if (!release.manifest.release || !release.manifest.project || release.manifest.reference || !release.entries.has(release.manifest.release.notes)) {
    throw new Error("来源须为 workbench:release 生成的母版快照。");
  }
  if (compareVersions(release.manifest.version, target.manifest.version) <= 0) throw new Error("请选择比项目基线更新的母版版本。");
  const incoming = new Map();
  for (const [file, entry] of release.entries) {
    const bytes = readFile(release.root, file);
    if (digest(bytes) !== entry.sha256) throw new Error(`发布快照文件已变动或缺失：${file}`);
    incoming.set(file, personalize(file, bytes, release.manifest, target.manifest));
  }
  const paths = [...new Set([...target.entries.keys(), ...release.entries.keys()])].sort();
  if (new Set(paths.map(file => file.toLowerCase())).size !== paths.length) throw new Error("清单存在仅大小写不同的路径，请先手动处理。");
  const retained = new Set(keepLocal);
  const adopted = new Set(takeUpstream);
  for (const file of retained) if (adopted.has(file)) throw new Error(`同一个文件只能选一种冲突处理方式：${file}`);
  const operations = [];
  const nextEntries = [];
  for (const file of paths) {
    const old = target.entries.get(file), next = release.entries.get(file);
    if (old?.ownership === "project" || next?.ownership === "project") {
      if (old) nextEntries.push(old);
      continue;
    }
    const after = incoming.get(file) ?? null;
    const afterHash = digest(after);
    if (next) nextEntries.push({ ...next, sha256: afterHash });
    const base = old?.sha256 ?? null;
    if (base === afterHash) continue;
    const before = readFile(target.root, file);
    const beforeHash = digest(before);
    const writeAction = after === null ? "remove" : before === null ? "add" : "update";
    let action = writeAction;
    let resolution;
    if (beforeHash === afterHash) action = "already-applied";
    else if (!matchesBase(file, before, beforeHash, base)) {
      if (retained.delete(file)) action = "keep-local";
      else if (adopted.delete(file)) resolution = "take-upstream";
      else action = "conflict";
    }
    operations.push({ file, action, resolution, base, beforeHash, afterHash, before, after });
  }
  if (retained.size || adopted.size) throw new Error(`以下文件没有待确认的冲突：${[...retained, ...adopted].join("、")}`);
  const report = operations.map(({ before, after, ...row }) => row);
  const id = sha256(jsonBytes({ target: target.hash, release: release.hash, operations: report }));
  const manifest = { ...target.manifest, version: release.manifest.version, source: release.manifest.source,
    components: release.manifest.components, upgradedFrom: { version: target.manifest.version, releaseSha256: release.hash }, files: nextEntries };
  return { id, manifest, operations, report };
}

function atomicWrite(destination, bytes) {
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  const temporary = `${destination}.workbench-${randomUUID()}.tmp`;
  try {
    fs.writeFileSync(temporary, bytes, { flag: "wx" });
    fs.renameSync(temporary, destination);
  } finally {
    if (fs.existsSync(temporary)) fs.unlinkSync(temporary);
  }
}

export function applyUpgrade(targetDirectory, releaseDirectory, keepLocal, takeUpstream, expected) {
  const root = fs.realpathSync(targetDirectory);
  const lock = filePath(root, ".workbench-upgrade.lock");
  const descriptor = fs.openSync(lock, "wx");
  try {
    const target = loadManifest(root);
    const plan = planUpgrade(target, loadManifest(releaseDirectory), keepLocal, takeUpstream);
    if (plan.id !== expected) throw new Error("升级计划已变化，请重新预演并核对新的计划 ID。");
    if (plan.operations.some(row => row.action === "conflict")) throw new Error("还有未处理的冲突，项目文件未改动。");
    const writes = plan.operations.filter(row => ["add", "update", "remove"].includes(row.action));
    const backup = fs.mkdtempSync(path.join(root, ".workbench-upgrade-backup-"));
    const currentManifest = readFile(root, manifestFile);
    if (digest(currentManifest) !== target.hash) throw new Error("项目清单在升级准备期间已修改，请重新预演。");
    atomicWrite(path.join(backup, "plan.json"), jsonBytes({ plan: plan.id, files: plan.report }));
    atomicWrite(path.join(backup, "original", manifestFile), currentManifest);
    for (const row of writes) {
      if (row.before) atomicWrite(path.join(backup, "original", ...row.file.split("/")), row.before);
    }
    const completed = [];
    try {
      for (const row of writes) {
        if (digest(readFile(root, row.file)) !== row.beforeHash) throw new Error(`应用期间文件发生变化：${row.file}`);
        const destination = filePath(root, row.file);
        if (row.after === null) fs.unlinkSync(destination);
        else atomicWrite(destination, row.after);
        completed.push(row);
      }
      if (digest(readFile(root, manifestFile)) !== target.hash) throw new Error("应用期间项目清单发生变化。");
      atomicWrite(filePath(root, manifestFile), jsonBytes(plan.manifest));
    } catch (error) {
      const unresolved = [];
      for (const row of completed.reverse()) {
        try {
          if (digest(readFile(root, row.file)) !== row.afterHash) throw new Error("文件已再次修改");
          const destination = filePath(root, row.file);
          if (row.before === null) fs.unlinkSync(destination);
          else atomicWrite(destination, row.before);
        } catch { unresolved.push(row.file); }
      }
      throw new Error(`${error.message}；备份位于 ${backup}${unresolved.length ? `；需手动恢复：${unresolved.join("、")}` : "；已回退此次写入"}`);
    }
    return { version: plan.manifest.version, backup, changed: writes.length };
  } finally {
    fs.closeSync(descriptor);
    fs.unlinkSync(lock);
  }
}

function main() {
  const { values } = parseArgs({ options: {
    target: { type: "string", default: process.cwd() },
    from: { type: "string" },
    "keep-local": { type: "string", multiple: true, default: [] },
    "take-upstream": { type: "string", multiple: true, default: [] },
    apply: { type: "string" },
    help: { type: "boolean" },
  } });
  if (values.help || !values.from) {
    console.log("预演：npm run workbench:upgrade -- --target <项目目录> --from <版本快照目录>\n处理冲突：附加 --keep-local <相对路径> 或 --take-upstream <相对路径>，可重复\n应用：保持相同参数，附加 --apply <预演计划 ID>");
    return;
  }
  if (values.apply) {
    const result = applyUpgrade(values.target, values.from, values["keep-local"], values["take-upstream"], values.apply);
    console.log(`已应用 ${result.version}，写入或移除 ${result.changed} 个文件。备份：${result.backup}`);
    return;
  }
  const target = loadManifest(values.target);
  const release = loadManifest(values.from);
  const plan = planUpgrade(target, release, values["keep-local"], values["take-upstream"]);
  const labels = { add: "新增", update: "更新", remove: "移除", conflict: "冲突", "keep-local": "保留本地", "already-applied": "内容已一致" };
  console.log(`${target.manifest.version} → ${release.manifest.version}\n变更说明：${path.join(release.root, release.manifest.release.notes)}`);
  for (const row of plan.report) console.log(`[${row.resolution ? "采用新版并备份本地" : labels[row.action]}] ${row.file}`);
  console.log(`计划 ID：${plan.id}\n${plan.report.some(row => row.action === "conflict") ? "请逐项处理冲突并重新预演。" : "核对后使用 --apply <计划 ID> 应用。"}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try { main(); }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}
