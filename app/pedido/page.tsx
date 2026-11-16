import type { Metadata } from 'next';
import { PedidoForm } from '@/components/PedidoForm';
import { leerAjustes, leerProductos } from '@/lib/content';

export const metadata: Metadata = { title: 'Tu pedido' };

export default function Pedido() {
  const { whatsapp, banco, titular, clabe, envio_nota } = leerAjustes();
  const productos = leerProductos().map(({ slug, nombre, precio, sabor, foto, anticipacion, agotado }) => ({
    slug,
    nombre,
    precio,
    sabor,
    foto,
    anticipacion,
    agotado,
  }));

  return (
    <div className="hoja">
      <h1>Tu pedido</h1>
      <PedidoForm productos={productos} ajustes={{ whatsapp, banco, titular, clabe, envio_nota }} />
    </div>
  );
}
