import type { Metadata } from 'next';
import { EventoForm } from '@/components/EventoForm';
import { leerAjustes } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Eventos',
  description: 'Mesas de postres para bodas, cumpleaños y eventos de empresa. Pide tu cotización por WhatsApp.',
};

export default function Eventos() {
  const { whatsapp } = leerAjustes();
  return (
    <div className="hoja">
      <h1>Mesas de postres para tu evento.</h1>
      <p className="hoja__entrada">
        Cuéntanos la fecha y cuántas personas van. Te respondemos por WhatsApp con opciones y precio.
      </p>
      <EventoForm whatsapp={whatsapp} />
    </div>
  );
}
