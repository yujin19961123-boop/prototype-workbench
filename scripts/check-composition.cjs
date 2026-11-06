const fs = require('node:fs');
const assert = require('node:assert/strict');
const { collectMetrics } = require('./composition-metrics.cjs');
const metrics = collectMetrics();
const policy = JSON.parse(fs.readFileSync('src/design-system/composition-exceptions.json', 'utf8'));
const errors = [...metrics.violations];
for (const [file, count] of Object.entries(metrics.nativeButtons)) {
  if (count > (policy.nativeButtonBudgets[file]?.count ?? 0)) errors.push(`${file}: ${count} 个原生 button，超过已登记 ${policy.nativeButtonBudgets[file]?.count ?? 0}；普通操作优先 ActionButton/Button，结构例外写明原因。`);
}
for (const [file, count] of Object.entries(metrics.nativeInputs)) if (count > (policy.nativeInputBudgets[file]?.count ?? 0)) errors.push(`${file}: 未登记的原生 input，请复用字段组件。`);
for (const issue of metrics.styleIssues) {
  const key = [issue.file, issue.selector, issue.property, issue.kind, issue.value].join('|');
  if (!policy.styleExceptions.some(entry => entry.key === key && entry.reason)) errors.push(`${issue.file}: ${issue.kind} ${issue.selector} / ${issue.property}: ${issue.value}`);
}
const entries = JSON.parse(fs.readFileSync('src/workbench/catalog/catalog.json', 'utf8'));
for (const entry of entries) {
  assert(['candidate', 'adapted', 'pattern'].includes(entry.maturity), `缺少成熟度：${entry.id}`);
  assert(['pending', 'accepted'].includes(entry.visualReview), `缺少视觉状态：${entry.id}`);
}
for (const file of ['ListDetailRecipe.tsx', 'FormDialogRecipe.tsx', 'MessageFeedRecipe.tsx', 'README.md']) if (!fs.existsSync('src/recipes/' + file)) errors.push(`缺少标准示例：${file}`);
if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
else console.log(`组件用法检查通过：无跨层 CSS / 原子业务依赖；现有例外已登记，${entries.length} 个家族成熟度完整，三个示例齐备。`);
if (process.argv.includes('--report')) {
  fs.mkdirSync('artifacts/composition-review', { recursive: true });
  fs.writeFileSync('artifacts/composition-review/after.json', JSON.stringify(metrics, null, 2) + '\n');
}
