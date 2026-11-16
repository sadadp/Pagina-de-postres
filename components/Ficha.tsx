'use client';

import { agregar, quitar } from '@/lib/cart';
import { precio } from '@/lib/format';
import { saborDe } from '@/lib/sabores';
import type { Producto } from '@/lib/types';
import { Mas, Menos } from './icons';

export function Ficha({ producto, cantidad }: { producto: Producto; cantidad: number }) {
  const sabor = saborDe(producto.sabor);
  const { slug, nombre } = producto;

  return (
    <li className={`ficha${producto.agotado ? ' ficha--agotado' : ''}`}>
      <div
        className={`ficha__color${sabor.claro && !producto.foto ? ' ficha__color--claro' : ''}`}
        style={{ backgroundColor: sabor.color }}
      >
        {producto.foto ? <img src={producto.foto} alt="" loading="lazy" decoding="async" /> : null}

        {producto.agotado ? (
          <span className="ficha__aviso">Agotado</span>
        ) : (
          <div className="ficha__control">
            {cantidad > 0 ? (
              <>
                <button type="button" className="ficha__menos" onClick={() => quitar(slug)} aria-label={`Quitar uno: ${nombre}`}>
                  <Menos />
                </button>
                <span className="ficha__cuenta" aria-live="polite">
                  {cantidad}
                  <span className="ficha__cuenta-texto"> en tu pedido</span>
                </span>
              </>
            ) : null}
            <button
              type="button"
              className="ficha__mas"
              onClick={() => agregar(slug)}
              aria-label={cantidad > 0 ? `Agregar otro: ${nombre}` : `Agregar al pedido: ${nombre}`}
            >
              <Mas />
            </button>
          </div>
        )}
      </div>

      <h3 className="ficha__nombre">{nombre}</h3>
      {producto.descripcion ? <p className="ficha__detalle">{producto.descripcion}</p> : null}
      <p className="ficha__precio">{precio(producto.precio)}</p>
    </li>
  );
}
