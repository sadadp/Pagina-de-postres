import type { Metadata } from 'next';
import Link from 'next/link';
import { InstallApp } from '@/components/InstallApp';
import { leerAjustes } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Cómo pedir',
  description: 'Cómo hacer tu pedido en Canelia, cómo se paga y cómo se entrega.',
};

export default function ComoPedir() {
  const { envio_nota, clabe } = leerAjustes();
  return (
    <div className="hoja">
      <h1>Cómo pedir</h1>

      <ol className="pasos">
        <li>
          <h2>Elige en el menú</h2>
          <p>Toca el signo de más en cada postre que quieras. Tu pedido se guarda en tu celular mientras eliges.</p>
        </li>
        <li>
          <h2>Dinos dónde y cuándo</h2>
          <p>
            En “Pedido” escribes tu nombre, la dirección y el día de entrega. Los pasteles y pays se piden con
            anticipación; la app te muestra la fecha más cercana.
          </p>
        </li>
        <li>
          <h2>Mándalo por WhatsApp</h2>
          <p>El botón abre WhatsApp con tu pedido ya escrito. Solo dale enviar y te confirmamos por el mismo chat.</p>
        </li>
        <li>
          <h2>Paga</h2>
          <p>
            Por transferencia o en efectivo al recibir.{' '}
            {clabe
              ? 'Los datos para transferir aparecen al confirmar tu pedido.'
              : 'Los datos para transferir te los mandamos por WhatsApp.'}
          </p>
        </li>
        <li>
          <h2>Recibe</h2>
          <p>{envio_nota || 'Enviamos con repartidor de app. El costo del envío se acuerda por WhatsApp.'}</p>
        </li>
      </ol>

      <Link href="/" className="boton">
        Ver el menú
      </Link>

      <section className="aparte">
        <h2>Instala Canelia en tu celular</h2>
        <p>Queda como una app en tu pantalla de inicio y abre aunque no tengas señal. No ocupa tienda de apps.</p>
        <InstallApp />
      </section>
    </div>
  );
}
