// Después de compilar, pone la versión de esta compilación en out/sw.js.
// Así cada publicación estrena service worker y borra la copia anterior.
import fs from 'node:fs';

const archivo = 'out/sw.js';
const version = fs.existsSync('.next/BUILD_ID') ? fs.readFileSync('.next/BUILD_ID', 'utf8').trim() : String(Date.now());
fs.writeFileSync(archivo, fs.readFileSync(archivo, 'utf8').replace("const VERSION = '__VERSION__'", `const VERSION = '${version}'`));
console.log(`sw.js sellado con la versión ${version}`);
