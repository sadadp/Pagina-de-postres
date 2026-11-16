/*
 * Service worker de Canelia: deja que la app abra sin conexión.
 * - Las páginas se piden primero a la red y, si no hay señal, salen de la copia guardada.
 * - Los archivos de /_next/static/ llevan huella en el nombre y nunca cambian: se sirven de la copia.
 * - Fotos e íconos se sirven de la copia y se actualizan por detrás.
 * La constante VERSION se sella en cada compilación (scripts/sello-sw.mjs).
 */
const VERSION = '__VERSION__';
const COPIA = `canelia-${VERSION}`;
const PAGINAS = ['/', '/pedido/', '/eventos/', '/como-pedir/'];
const FIJOS = ['/manifest.webmanifest', '/icons/icono-192.png', '/icons/icono-512.png'];

self.addEventListener('install', (evento) => {
  evento.waitUntil(
    (async () => {
      const copia = await caches.open(COPIA);
      const estaticos = new Set(FIJOS);
      await Promise.all(
        PAGINAS.map(async (pagina) => {
          try {
            const respuesta = await fetch(pagina, { cache: 'no-cache' });
            if (!respuesta.ok) return;
            await copia.put(pagina, respuesta.clone());
            // Guarda también los scripts, estilos y fuentes que usa cada página.
            const html = await respuesta.text();
            for (const [url] of html.matchAll(/\/_next\/static\/[^"'\\\s)]+/g)) estaticos.add(url);
          } catch {
            // Sin red durante la instalación: se guardará al visitar la página.
          }
        }),
      );
      await Promise.all(
        [...estaticos].map((url) => copia.add(url).catch(() => undefined)),
      );
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener('activate', (evento) => {
  evento.waitUntil(
    (async () => {
      const nombres = await caches.keys();
      await Promise.all(nombres.filter((n) => n.startsWith('canelia-') && n !== COPIA).map((n) => caches.delete(n)));
      await self.clients.claim();
    })(),
  );
});

self.addEventListener('fetch', (evento) => {
  const peticion = evento.request;
  if (peticion.method !== 'GET') return;
  const url = new URL(peticion.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/admin')) return;

  if (peticion.mode === 'navigate') {
    evento.respondWith(paginaPrimeroRed(peticion));
  } else if (url.pathname.startsWith('/_next/static/')) {
    evento.respondWith(copiaPrimero(peticion));
  } else {
    evento.respondWith(copiaYActualiza(peticion));
  }
});

async function paginaPrimeroRed(peticion) {
  const copia = await caches.open(COPIA);
  try {
    const respuesta = await fetch(peticion);
    if (respuesta.ok) copia.put(peticion, respuesta.clone());
    return respuesta;
  } catch {
    return (await copia.match(peticion, { ignoreSearch: true })) ?? (await copia.match('/')) ?? Response.error();
  }
}

async function copiaPrimero(peticion) {
  const copia = await caches.open(COPIA);
  const guardada = await copia.match(peticion);
  if (guardada) return guardada;
  const respuesta = await fetch(peticion);
  if (respuesta.ok) copia.put(peticion, respuesta.clone());
  return respuesta;
}

async function copiaYActualiza(peticion) {
  const copia = await caches.open(COPIA);
  const guardada = await copia.match(peticion);
  const deRed = fetch(peticion)
    .then((respuesta) => {
      if (respuesta.ok) copia.put(peticion, respuesta.clone());
      return respuesta;
    })
    .catch(() => undefined);
  return guardada ?? (await deRed) ?? Response.error();
}
