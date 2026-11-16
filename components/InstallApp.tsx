'use client';

import { useEffect, useState } from 'react';

type AvisoInstalar = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }> };

/**
 * En Android y en computadora, el navegador ofrece instalar la app y este botón
 * lanza esa pregunta. En iPhone no existe ese aviso: se instala a mano desde
 * Safari, y por eso mostramos los pasos.
 */
export function InstallApp() {
  const [aviso, setAviso] = useState<AvisoInstalar | null>(null);
  const [instalada, setInstalada] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) setInstalada(true);
    const alOfrecer = (e: Event) => {
      e.preventDefault();
      setAviso(e as AvisoInstalar);
    };
    const alInstalar = () => {
      setInstalada(true);
      setAviso(null);
    };
    window.addEventListener('beforeinstallprompt', alOfrecer);
    window.addEventListener('appinstalled', alInstalar);
    return () => {
      window.removeEventListener('beforeinstallprompt', alOfrecer);
      window.removeEventListener('appinstalled', alInstalar);
    };
  }, []);

  if (instalada) return <p className="instalar__lista">Ya tienes Canelia instalada en este dispositivo.</p>;

  return (
    <div className="instalar">
      {aviso ? (
        <button
          type="button"
          className="boton"
          onClick={async () => {
            await aviso.prompt();
            const { outcome } = await aviso.userChoice;
            if (outcome === 'accepted') setInstalada(true);
            setAviso(null);
          }}
        >
          Instalar Canelia
        </button>
      ) : null}
      <dl className="instalar__pasos">
        <div>
          <dt>En iPhone</dt>
          <dd>Abre esta página en Safari, toca Compartir y elige “Agregar a inicio”.</dd>
        </div>
        <div>
          <dt>En Android</dt>
          <dd>Abre esta página en Chrome, toca el menú de tres puntos y elige “Instalar app”.</dd>
        </div>
      </dl>
    </div>
  );
}
