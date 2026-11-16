'use client';

import { useEffect, useRef, useState } from 'react';
import { usePedido } from '@/lib/cart';
import type { Categoria, Producto } from '@/lib/types';
import { Ficha } from './Ficha';

type Grupo = { categoria: Categoria; productos: Producto[] };

export function Menu({ grupos }: { grupos: Grupo[] }) {
  const pedido = usePedido();
  const [activa, setActiva] = useState(grupos[0]?.categoria.id ?? '');
  const pestanas = useRef<HTMLElement>(null);

  // Marca la pestaña de la categoría que se está viendo.
  useEffect(() => {
    const secciones = grupos
      .map((g) => document.getElementById(g.categoria.id))
      .filter((el): el is HTMLElement => el !== null);
    if (secciones.length === 0) return;

    const observador = new IntersectionObserver(
      (entradas) => {
        const visibles = entradas.filter((e) => e.isIntersecting);
        if (visibles.length === 0) return;
        visibles.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        setActiva(visibles[0].target.id);
      },
      { rootMargin: '-72px 0px -60% 0px' },
    );
    secciones.forEach((s) => observador.observe(s));
    return () => observador.disconnect();
  }, [grupos]);

  // Mantiene a la vista la pestaña activa sin mover la página.
  useEffect(() => {
    const barra = pestanas.current;
    const enlace = barra?.querySelector<HTMLElement>('[aria-current="true"]');
    if (!barra || !enlace) return;
    const izquierda = enlace.offsetLeft - 16;
    const derecha = izquierda + enlace.offsetWidth + 32;
    if (izquierda < barra.scrollLeft) barra.scrollTo({ left: izquierda });
    else if (derecha > barra.scrollLeft + barra.clientWidth) barra.scrollTo({ left: derecha - barra.clientWidth });
  }, [activa]);

  return (
    <>
      <nav className="pestanas" aria-label="Categorías del menú" ref={pestanas}>
        {grupos.map(({ categoria }) => (
          <a key={categoria.id} href={`#${categoria.id}`} aria-current={activa === categoria.id ? 'true' : undefined}>
            {categoria.nombre}
          </a>
        ))}
      </nav>

      {grupos.map(({ categoria, productos }) => (
        <section key={categoria.id} id={categoria.id} className="grupo" aria-labelledby={`t-${categoria.id}`}>
          <header className="grupo__cabeza">
            <h2 id={`t-${categoria.id}`}>{categoria.nombre}</h2>
            {categoria.nota ? <p>{categoria.nota}</p> : null}
          </header>
          <ul className="rejilla">
            {productos.map((p) => (
              <Ficha key={p.slug} producto={p} cantidad={pedido[p.slug] ?? 0} />
            ))}
          </ul>
        </section>
      ))}
    </>
  );
}
