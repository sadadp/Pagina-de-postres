'use client';

import { useEffect } from 'react';

/** Registra el service worker que deja la app abrir sin conexión. Solo en producción. */
export function RegisterSW() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' || !('serviceWorker' in navigator)) return;
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Sin service worker la app funciona igual, solo que no abre sin conexión.
    });
  }, []);
  return null;
}
