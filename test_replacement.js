// Check ejecutable: el Replacement del YAML debe ser un REFLEJO del Pattern.
// MythicMobs necesita una entrada de Replacement por cada bloque del Pattern;
// si falta alguna, ese bloque no se sustituye (queda flotando tras invocar).
// Uso: node test_replacement.js
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

// Extrae las funciones reales del HTML (entre el inicio de buildReplacementLines
// y la siguiente función) y las evalúa contra un state de prueba.
const start = html.indexOf('function buildReplacementLines');
const end = html.indexOf('function updateYAML()');
if (start < 0 || end < 0 || end <= start) throw new Error('No se encontraron las funciones en index.html');
const code = html.slice(start, end);

const state = { blocks: [], replacements: [] };
const isHead = () => false;
const isVanillaHead = () => false;
const run = new Function('state', 'isHead', 'isVanillaHead', `${code}\nreturn { buildReplacementLines, generateYAML };`);
const { buildReplacementLines, generateYAML } = run(state, isHead, isVanillaHead);

const assert = (cond, msg) => { if (!cond) { console.error('❌ FAIL:', msg); process.exit(1); } };

// --- Caso 1: patrón del usuario, sin reemplazos manuales -> espejo AIR completo
state.blocks = [
  { x: 0, y: 0, z: 1, material: 'STONE' }, { x: 0, y: 1, z: 1, material: 'STONE' },
  { x: 0, y: 2, z: 1, material: 'STONE' }, { x: 0, y: 2, z: 2, material: 'STONE' },
  { x: 0, y: 2, z: 3, material: 'STONE' }, { x: 1, y: 2, z: 1, material: 'STONE' },
  { x: 2, y: 2, z: 1, material: 'STONE' }, { x: 0, y: 2, z: 0, material: 'STONE' },
  { x: 0, y: 2, z: -1, material: 'STONE' }, { x: -1, y: 2, z: 1, material: 'STONE' },
  { x: -2, y: 2, z: 1, material: 'STONE' },
];
state.replacements = [];
const yaml1 = generateYAML();
const repl1 = yaml1.split('\n').filter(l => l.startsWith('    - ') && yaml1.indexOf('Replacement:') < yaml1.indexOf(l));
assert(repl1.length === state.blocks.length, `Espejo incompleto: ${repl1.length} reemplazos para ${state.blocks.length} bloques`);
assert(repl1.every(l => l.endsWith(' AIR')), 'Todos los reemplazos deben ser AIR por defecto');
const coords = l => l.trim().split(' ')[1];
const patternCoords = new Set(state.blocks.map(b => `${b.x},${b.y},${b.z}`));
assert(repl1.map(coords).every(c => patternCoords.has(c)) && new Set(repl1.map(coords)).size === patternCoords.size,
  'Las coordenadas del Replacement deben ser exactamente las del patrón');

// --- Caso 2: override manual en una coordenada -> ese material gana, resto AIR
state.replacements = [{ x: 0, y: 2, z: 1, material: 'OBSIDIAN' }];
const repl2 = buildReplacementLines();
assert(repl2.some(l => l.includes('0,2,1 OBSIDIAN')), 'El override manual no se respeta');
assert(repl2.filter(l => l.endsWith(' AIR')).length === state.blocks.length - 1, 'El resto debe seguir siendo AIR');

// --- Caso 3: override en coordenada FUERA del patrón se conserva (no se pierde trabajo)
state.replacements = [{ x: 5, y: 5, z: 5, material: 'AIR' }];
const repl3 = buildReplacementLines();
assert(repl3.some(l => l.includes('5,5,5 AIR')), 'El override fuera del patrón se perdió');

// --- Caso 4: importYAML (indentado, como genera la app) debe parsear patrón y reemplazos
const importStart = html.indexOf('function importYAML');
const importEnd = html.indexOf('// RESET', importStart);
assert(importStart > 0 && importEnd > importStart, 'No se encontró importYAML en index.html');
const importCode = html.slice(importStart, importEnd);
const stubs = {
  document: { getElementById: () => ({ value: '' }) },
  renderAllBlocks: () => {}, updateUI: () => {}, updateHeadOptionsUI: () => {},
  saveToLocalStorage: () => {}, showToast: () => {}, t: k => k,
};
const importState = { headTexture: null, headBlock: null, mobName: '', mobType: '', mobDisplay: '', blocks: [], replacements: [] };
const runImport = new Function('state', 'document', 'renderAllBlocks', 'updateUI', 'updateHeadOptionsUI', 'saveToLocalStorage', 'showToast', 't', `${importCode}\nreturn importYAML;`);
const importYAML = runImport(importState, stubs.document, stubs.renderAllBlocks, stubs.updateUI, stubs.updateHeadOptionsUI, stubs.saveToLocalStorage, stubs.showToast, stubs.t);
importYAML(`TotemGuardian:
  Type: ZOMBIE
  Display: '&6Tótem Guardián'
  Totem:
    Head: SKELETON_SKULL
    Pattern:
    - 0,0,1 STONE
    - 0,2,1 STONE
    Replacement:
    - 0,0,0 AIR`);
assert(importState.blocks.length === 2, `Import roto: solo ${importState.blocks.length} bloques parseados`);
assert(importState.replacements.length === 1, `Import roto: ${importState.replacements.length} reemplazos parseados`);
assert(importState.headBlock === 'SKELETON_SKULL', 'Import roto: Head no aplicado');

console.log('✅ OK: el Replacement refleja el patrón completo (' + state.blocks.length + ' bloques)');
