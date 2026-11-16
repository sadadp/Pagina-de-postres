'use client';

import { useSyncExternalStore } from 'react';

/** El pedido es un mapa slug → cantidad, guardado en el dispositivo del cliente. */
export type Pedido = Record<string, number>;

const CLAVE = 'canelia-pedido-v1';
const VACIO: Pedido = Object.freeze({}) as Pedido;

let estado: Pedido = VACIO;
let cargado = false;
const oyentes = new Set<() => void>();

function cargar() {
  if (cargado || typeof window === 'undefined') return;
  cargado = true;
  try {
    const crudo = window.localStorage.getItem(CLAVE);
    if (!crudo) return;
    const datos = JSON.parse(crudo) as unknown;
    if (!datos || typeof datos !== 'object') return;
    const limpio: Pedido = {};
    for (const [slug, n] of Object.entries(datos as Record<string, unknown>)) {
      const cantidad = Math.floor(Number(n));
      if (cantidad > 0) limpio[slug] = Math.min(cantidad, 99);
    }
    estado = limpio;
  } catch {
    // Sin acceso a localStorage (modo privado): el pedido vive solo en memoria.
  }
}

function guardar(siguiente: Pedido) {
  estado = siguiente;
  try {
    window.localStorage.setItem(CLAVE, JSON.stringify(siguiente));
  } catch {
    // Ver nota en cargar().
  }
  oyentes.forEach((avisar) => avisar());
}

function suscribir(avisar: () => void) {
  cargar();
  oyentes.add(avisar);
  const alCambiarEnOtraPestana = (e: StorageEvent) => {
    if (e.key !== CLAVE) return;
    cargado = false;
    estado = VACIO;
    cargar();
    avisar();
  };
  window.addEventListener('storage', alCambiarEnOtraPestana);
  return () => {
    oyentes.delete(avisar);
    window.removeEventListener('storage', alCambiarEnOtraPestana);
  };
}

export function usePedido(): Pedido {
  return useSyncExternalStore(
    suscribir,
    () => {
      cargar();
      return estado;
    },
    () => VACIO,
  );
}

export function cambiarCantidad(slug: string, cantidad: number) {
  cargar();
  const siguiente = { ...estado };
  const n = Math.max(0, Math.min(99, Math.floor(cantidad)));
  if (n === 0) delete siguiente[slug];
  else siguiente[slug] = n;
  guardar(siguiente);
}

export function agregar(slug: string) {
  cargar();
  cambiarCantidad(slug, (estado[slug] ?? 0) + 1);
}

export function quitar(slug: string) {
  cargar();
  cambiarCantidad(slug, (estado[slug] ?? 0) - 1);
}

export function vaciar() {
  guardar({});
}
