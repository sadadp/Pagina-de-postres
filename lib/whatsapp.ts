import { fechaLarga, precio } from './format';

export type Renglon = { nombre: string; cantidad: number; importe: number };

export type DatosPedido = {
  renglones: Renglon[];
  total: number;
  nombre: string;
  direccion: string;
  fecha: string;
  hora: string;
  pago: 'transferencia' | 'efectivo';
  comentarios: string;
};

export type DatosEvento = {
  tipo: string;
  fecha: string;
  personas: string;
  nombre: string;
  comentarios: string;
};

export function mensajePedido(d: DatosPedido): string {
  const lineas = [
    'Hola Canelia, quiero hacer este pedido:',
    '',
    ...d.renglones.map((r) => `${r.cantidad} x ${r.nombre}: ${precio(r.importe)}`),
    '',
    `Total: ${precio(d.total)} (sin envío)`,
    '',
    `Entrega: ${fechaLarga(d.fecha)}${d.hora ? `, ${d.hora} h` : ''}`,
    `Dirección: ${d.direccion}`,
    `Pago: ${d.pago === 'transferencia' ? 'transferencia' : 'efectivo al recibir'}`,
    `Nombre: ${d.nombre}`,
  ];
  if (d.comentarios) lineas.push(`Comentarios: ${d.comentarios}`);
  return lineas.join('\n');
}

export function mensajeEvento(d: DatosEvento): string {
  const lineas = [
    'Hola Canelia, quiero cotizar una mesa de postres:',
    '',
    `Evento: ${d.tipo}`,
    `Fecha: ${fechaLarga(d.fecha)}`,
    `Personas: ${d.personas}`,
    `Nombre: ${d.nombre}`,
  ];
  if (d.comentarios) lineas.push(`Comentarios: ${d.comentarios}`);
  return lineas.join('\n');
}

export function enlaceWhatsApp(numero: string, mensaje: string): string {
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
}
