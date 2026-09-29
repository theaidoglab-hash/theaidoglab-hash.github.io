import fs from 'node:fs';
import path from 'node:path';
import postcss from 'postcss';

const root = process.cwd();
const cssPath = path.join(root, 'app', 'globals.css');
const source = fs.readFileSync(cssPath, 'utf8');

let stylesheet;
try {
  stylesheet = postcss.parse(source, { from: cssPath });
} catch (error) {
  throw new Error(`globals.css cannot be parsed: ${error.message}`);
}

const topLevelMedia = new Set(
  stylesheet.nodes
    .filter(node => node.type === 'atrule' && node.name === 'media')
    .map(node => node.params)
);

for (const query of ['(max-width: 1100px)', '(max-width: 900px)', '(max-width: 650px)']) {
  if (!topLevelMedia.has(query)) {
    throw new Error(`globals.css must keep ${query} as a top-level responsive rule.`);
  }
}

const simpleHero = stylesheet.nodes.find(
  node => node.type === 'rule' && node.selector === '.hero.hero--simple'
);
const simpleHeroColumns = simpleHero?.nodes?.find(node => node.type === 'decl' && node.prop === 'grid-template-columns');
if (simpleHeroColumns?.value !== 'minmax(0, 1fr)') {
  throw new Error('globals.css must keep the concise landing hero as a single-column layout.');
}

if (source.includes('landing-roadmap') || source.includes('hero-progress')) {
  throw new Error('globals.css must not retain unused detailed-landing styles.');
}

console.log('Validated globals.css syntax and top-level responsive breakpoints.');
