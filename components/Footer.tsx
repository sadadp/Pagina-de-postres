import Link from 'next/link';
import type { Ajustes } from '@/lib/types';
import { Wordmark } from './Wordmark';

export function Footer({ ajustes }: { ajustes: Ajustes }) {
  return (
    <footer className="pie">
      <div className="pie__marca">
        <Wordmark />
        <p>Postres por pedido{ajustes.ciudad ? ` en ${ajustes.ciudad}` : ''}.</p>
      </div>
      <nav className="pie__nav" aria-label="Pie de página">
        <Link href="/">Menú</Link>
        <Link href="/eventos">Eventos</Link>
        <Link href="/como-pedir">Cómo pedir</Link>
        {ajustes.instagram ? (
          <a href={`https://www.instagram.com/${ajustes.instagram}/`} rel="noopener noreferrer" target="_blank">
            Instagram
          </a>
        ) : null}
      </nav>
    </footer>
  );
}
