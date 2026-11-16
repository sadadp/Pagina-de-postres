'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { usePedido } from '@/lib/cart';
import { plural, precio } from '@/lib/format';

/** Barra fija con el resumen del pedido. Aparece al agregar el primer producto. */
export function OrderBar({ precios }: { precios: Record<string, number> }) {
  const pedido = usePedido();
  const ruta = usePathname();

  let piezas = 0;
  let total = 0;
  for (const [slug, cantidad] of Object.entries(pedido)) {
    if (!(slug in precios)) continue;
    piezas += cantidad;
    total += cantidad * precios[slug];
  }

  if (piezas === 0 || ruta.startsWith('/pedido')) return null;

  return (
    <Link href="/pedido" className="barra-pedido">
      <span className="barra-pedido__dentro">
        <span>
          Ver pedido <small>{plural(piezas, 'producto', 'productos')}</small>
        </span>
        <span className="barra-pedido__total">{precio(total)}</span>
      </span>
    </Link>
  );
}
