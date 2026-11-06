/** Runtime and build check share this small parser for our named component exports. */
export function componentExports(source: string): string[] {
  const names = new Set<string>();
  for (const match of source.matchAll(
    /export\s+(?:async\s+)?(?:function|const|class)\s+([A-Z]\w*)/g,
  ))
    names.add(match[1]);
  for (const match of source.matchAll(/export\s*\{([^}]+)\}/g)) {
    for (const token of match[1].split(",")) {
      const name =
        token
          .trim()
          .replace(/\s+as\s+/, " ")
          .split(/\s+/)
          .at(-1) ?? "";
      if (/^[A-Z]\w*$/.test(name) && !token.trim().startsWith("type "))
        names.add(name);
    }
  }
  return [...names].sort();
}
