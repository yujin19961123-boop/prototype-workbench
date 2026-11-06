const fs = require('node:fs');
const path = require('node:path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const postcss = require('postcss');
const normalize = value => value.replaceAll('\\', '/');
function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? walk(path.join(directory, entry.name)) : [normalize(path.join(directory, entry.name))]);
}
function resolve(from, reference) {
  const base = reference.startsWith('@/') ? 'src/' + reference.slice(2) : reference.startsWith('.') ? normalize(path.join(path.dirname(from), reference)) : null;
  if (!base) return null;
  return [base, base + '.ts', base + '.tsx', base + '/index.ts', base + '/index.tsx'].find(file => fs.existsSync(file) && fs.statSync(file).isFile()) ?? null;
}
function collectMetrics() {
  const files = walk('src'), code = files.filter(file => /\.tsx?$/.test(file));
  const components = files.filter(file => file.startsWith('src/components/') && file.endsWith('.tsx'));
  const modules = new Map(), violations = [], nativeButtons = {}, nativeInputs = {}, styleIssues = [];
  for (const file of code) {
    const ast = parser.parse(fs.readFileSync(file, 'utf8'), { sourceType: 'module', plugins: ['typescript', 'jsx'] });
    const dependencies = new Set();
    traverse(ast, {
      ImportDeclaration({ node }) {
        const reference = node.source.value, target = resolve(file, reference);
        if (target) dependencies.add(target);
        if (file.startsWith('src/components/') && target?.startsWith('src/features/') && target.endsWith('.css')) violations.push(`${file}: 组件不能依赖 feature CSS：${reference}`);
        if (file.startsWith('src/components/ui/') && target?.startsWith('src/features/')) violations.push(`${file}: 原子不能依赖业务模块：${reference}`);
      },
      JSXOpeningElement({ node }) {
        if (!(file.startsWith('src/project/') || file.startsWith('src/components/blocks/') || file.startsWith('src/recipes/'))) return;
        if (node.name.type !== 'JSXIdentifier') return;
        if (node.name.name === 'button') nativeButtons[file] = (nativeButtons[file] || 0) + 1;
        if (node.name.name === 'input') nativeInputs[file] = (nativeInputs[file] || 0) + 1;
        for (const attribute of node.attributes) {
          if (attribute.type !== 'JSXAttribute' || attribute.name.name !== 'className' || attribute.value?.type !== 'StringLiteral') continue;
          for (const token of attribute.value.value.split(/\s+/)) {
            if (/\[(?:#|(?:rgb|hsl)a?\()/.test(token)) styleIssues.push({ file, selector: node.name.name, property: 'className', kind: 'literal-color', value: token });
            if (/(?:^|:)text-\[\d+(?:\.\d+)?(?:px|rem|em)\]/.test(token)) styleIssues.push({ file, selector: node.name.name, property: 'className', kind: 'literal-type', value: token });
          }
        }
      },
    });
    modules.set(file, dependencies);
  }
  const product = new Set();
  const visit = file => { if (product.has(file)) return; product.add(file); for (const dependency of modules.get(file) ?? []) visit(dependency); };
  code.filter(file => file.startsWith('src/project/')).forEach(visit);
  const family = {};
  for (const kind of ['ui', 'blocks']) family[kind] = { available: components.filter(file => file.startsWith(`src/components/${kind}/`)).length, productReachable: components.filter(file => file.startsWith(`src/components/${kind}/`) && product.has(file)).length };
  for (const file of files.filter(file => file.endsWith('.css') && /^(src\/components\/|src\/recipes\/)/.test(file))) {
    postcss.parse(fs.readFileSync(file, 'utf8'), { from: file }).walkRules(rule => rule.walkDecls(declaration => {
      const issue = kind => styleIssues.push({ file, selector: rule.selector, property: declaration.prop, kind, value: declaration.value });
      if (/#[\da-f]{3,8}\b|\b(?:rgb|hsl)a?\(/i.test(declaration.value) && !declaration.prop.startsWith('--')) issue('literal-color');
      if (declaration.prop === 'font-size' && /\d(?:px|rem|em)\b/.test(declaration.value)) issue('literal-type');
      if (declaration.important) issue('important');
    }));
  }
  return { method: 'Static AST reachability from features, excluding workbench demos. Source call sites, not runtime reuse percentage.', family, productComponentFiles: components.filter(file => product.has(file)), nativeButtons, nativeInputs, styleIssues, violations };
}
module.exports = { collectMetrics };
