/**
 * Extracts content from the approved design prototype into design-content.json.
 *
 * The prototype holds every string the site ships. Transcribing it by hand invites typos in exactly
 * the places nobody checks (en-dashes, "&" entities, the "(representative figure)" qualifiers), so
 * we lift the literals straight out of its JS instead. Re-run this if the design changes upstream.
 *
 *   node scripts/extract-design-content.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const PROTOTYPE = resolve(here, '../../design/forbes-water-site.dc.html');
const OUT = resolve(here, 'design-content.json');

const html = readFileSync(PROTOTYPE, 'utf8');

/** Slice from `open` to its balanced closing bracket. */
function balanced(src, startIdx, open = '[', close = ']') {
  let depth = 0;
  let inStr = null;
  for (let i = startIdx; i < src.length; i++) {
    const c = src[i];
    if (inStr) {
      if (c === '\\') i++;
      else if (c === inStr) inStr = null;
      continue;
    }
    if (c === '"' || c === "'" || c === '`') inStr = c;
    else if (c === open) depth++;
    else if (c === close && --depth === 0) return src.slice(startIdx, i + 1);
  }
  throw new Error(`unbalanced ${open} from ${startIdx}`);
}

/** Evaluate a JS literal in a bare sandbox. The prototype is a trusted local file we vendored. */
const evalLiteral = (code, scope = {}) => {
  const keys = Object.keys(scope);
  return new Function(...keys, `"use strict"; return (${code});`)(...keys.map((k) => scope[k]));
};

// ---- services / industries / projects: lift the whole `get data()` body -------------------------
const dataStart = html.indexOf('get data() {');
if (dataStart === -1) throw new Error('could not find `get data()` in the prototype');
// Anchor on the assignment: `return this._d;` also appears in the memo guard on the first line.
const assignIdx = html.indexOf('this._d =', dataStart);
const dataEnd = html.indexOf('return this._d;', assignIdx);
if (assignIdx === -1 || dataEnd === -1) throw new Error('`get data()` body not shaped as expected');
let body = html.slice(html.indexOf('{', dataStart) + 1, dataEnd);
// drop the memo guard and rewrite the assignment — both reference `this`
body = body.replace(/if\s*\(this\._d\)\s*return this\._d;/, '');
body = body.replace(/this\._d\s*=\s*/, 'const __out = ');

const { services, industries, projects } = new Function(`"use strict"; ${body} return __out;`)();

// ---- renderVals(): the page-level arrays are plain literals; pull each by name ------------------
const rv = html.indexOf('renderVals() {');
if (rv === -1) throw new Error('could not find `renderVals()` in the prototype');
const pick = (name) => {
  const m = new RegExp(`\\n\\s*${name}:\\s*\\[`).exec(html.slice(rv));
  if (!m) throw new Error(`array "${name}" not found in renderVals()`);
  const at = rv + m.index + m[0].length - 1;
  return evalLiteral(balanced(html, at));
};

const out = {
  services,
  industries,
  projects,
  why: pick('why'),
  process: pick('process'),
  values: pick('values'),
  team: pick('team'),
  engagement: pick('engagement'),
  pillars: pick('pillars'),
  impact: pick('impact'),
  practice: pick('practice'),
};

// ---- sanity: counts the design is known to have ------------------------------------------------
const expected = {
  services: 8, industries: 5, projects: 6, why: 4, process: 4,
  values: 4, team: 3, engagement: 3, pillars: 4, impact: 4, practice: 3,
};
const wrong = Object.entries(expected).filter(([k, n]) => out[k]?.length !== n);
if (wrong.length) {
  throw new Error(
    'design content does not match the expected shape — did the prototype change?\n' +
      wrong.map(([k, n]) => `  ${k}: expected ${n}, got ${out[k]?.length}`).join('\n')
  );
}

writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(`extracted → ${OUT}`);
for (const [k, v] of Object.entries(out)) console.log(`  ${k.padEnd(12)} ${v.length}`);
