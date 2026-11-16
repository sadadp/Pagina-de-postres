// Antes de compilar, copia el panel de administración (Sveltia CMS) desde
// node_modules a public/admin/. Así el panel no depende de un servidor externo
// y su versión queda fija en package-lock.json.
import fs from 'node:fs';
import path from 'node:path';

const origen = 'node_modules/@sveltia/cms/dist';
const destino = 'public/admin';

function copiar(desde, hacia) {
  fs.mkdirSync(hacia, { recursive: true });
  for (const entrada of fs.readdirSync(desde, { withFileTypes: true })) {
    const a = path.join(desde, entrada.name);
    const b = path.join(hacia, entrada.name);
    if (entrada.isDirectory()) copiar(a, b);
    else if (!entrada.name.endsWith('.map') && !entrada.name.endsWith('.mjs')) fs.copyFileSync(a, b);
  }
}

fs.rmSync(path.join(destino, 'chunks'), { recursive: true, force: true });
copiar(origen, destino);
console.log('Panel de administración copiado a public/admin/');
