'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { usePedido } from '@/lib/cart';
import { Wordmark } from './Wordmark';

export function Header() {
  const pedido = usePedido();
  const ruta = usePathname();
  const piezas = Object.values(pedido).reduce((a, b) => a + b, 0);
  const actual = (href: string) => (ruta === href || ruta === `${href}/` ? 'page' : undefined);

  return (
    <header className="barra">
      <Link href="/" className="barra__marca" aria-label="Canelia, ir al menú">
        <Wordmark />
      </Link>
      <nav className="barra__nav" aria-label="Principal">
        <Link href="/eventos" className="barra__extra" aria-current={actual('/eventos')}>
          Eventos
        </Link>
        <Link href="/como-pedir" aria-current={actual('/como-pedir')}>
          Cómo pedir
        </Link>
        <Link href="/pedido" aria-current={actual('/pedido')}>
          Pedido{piezas > 0 ? ` (${piezas})` : ''}
        </Link>
      </nav>
    </header>
  );
}
