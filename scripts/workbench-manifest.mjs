import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

export const manifestFile = "workbench.manifest.json";
export const sha256 = bytes => createHash("sha256").update(bytes).digest("hex");
const versionPattern = /^(\d+)\.(\d+)\.(\d+)(?:-preview\.([1-9]\d*))?$/;

export function compareVersions(left, right) {
  const a = versionPattern.exec(left);
  const b = versionPattern.exec(right);
  if (!a || !b) throw new Error("不支持的母版版本格式。");
  for (let index = 1; index <= 4; index++) {
    if (a[index] === b[index]) continue;
    if (!a[index]) return 1;
    if (!b[index]) return -1;
    const delta = BigInt(a[index]) - BigInt(b[index]);
    if (delta !== 0n) return delta > 0n ? 1 : -1;
  }
  return 0;
}

export function safeParts(file) {
  const parts = typeof file === "string" ? file.split("/") : [];
  if (!parts.length || parts.some(part => !part || /[\\:\u0000-\u001f<>|?*"]/u.test(part) || /[. ]$/.test(part) || /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(part))) {
    throw new Error(`不安全的清单路径：${file}`);
  }
  return parts;
}

export function filePath(root, file) {
  const parts = safeParts(file);
  let absolute = root;
  for (const [index, part] of parts.entries()) {
    absolute = path.join(absolute, part);
    const stat = fs.lstatSync(absolute, { throwIfNoEntry: false });
    if (!stat) continue;
    if (stat.isSymbolicLink() || (index < parts.length - 1 ? !stat.isDirectory() : !stat.isFile())) {
      throw new Error(`升级路径必须为普通目录或文件：${file}`);
    }
  }
  return absolute;
}

export function readFile(root, file) {
  const absolute = filePath(root, file);
  try { return fs.readFileSync(absolute); }
  catch (error) { if (error.code !== "ENOENT") throw error; return null; }
}

export function loadManifest(directory) {
  const root = fs.realpathSync(directory);
  const bytes = readFile(root, manifestFile);
  if (!bytes) throw new Error(`缺少 ${manifestFile}：${root}`);
  const manifest = JSON.parse(bytes);
  const entries = new Map();
  const caseKeys = new Set();
  if (manifest.schemaVersion !== 1 || !versionPattern.test(manifest.version) || !Array.isArray(manifest.files)) {
    throw new Error(`不支持的母版清单：${root}`);
  }
  for (const entry of manifest.files) {
    safeParts(entry.path);
    const key = entry.path.toLowerCase();
    if (caseKeys.has(key) || key === manifestFile || key.startsWith(".workbench-upgrade") || !["upstream", "project"].includes(entry.ownership) || !/^[0-9a-f]{64}$/.test(entry.sha256)) {
      throw new Error(`无效或重复的清单条目：${entry.path}`);
    }
    caseKeys.add(key);
    entries.set(entry.path, entry);
  }
  return { root, manifest, entries, hash: sha256(bytes) };
}
