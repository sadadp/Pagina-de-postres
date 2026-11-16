import Link from 'next/link';
import { Menu } from '@/components/Menu';
import { leerAjustes, leerCategorias, leerProductos } from '@/lib/content';

export default function Inicio() {
  const ajustes = leerAjustes();
  const productos = leerProductos();
  const categorias = leerCategorias();
  const grupos = categorias
    .map((categoria) => ({ categoria, productos: productos.filter((p) => p.categoria === categoria.id) }))
    .filter((g) => g.productos.length > 0);

  // Un producto cuya categoría ya no existe no desaparece: sale al final, en "Otros".
  const sueltos = productos.filter((p) => !categorias.some((c) => c.id === p.categoria));
  if (sueltos.length > 0) grupos.push({ categoria: { id: 'otros', nombre: 'Otros', nota: '' }, productos: sueltos });

  return (
    <>
      <section className="portada">
        <h1>{ajustes.portada_titulo}</h1>
        {ajustes.portada_texto ? <p>{ajustes.portada_texto}</p> : null}
      </section>

      <Menu grupos={grupos} />

      <section className="franja">
        <h2>Mesas de postres para tu evento.</h2>
        <p>Dinos la fecha y cuántas personas van, y te mandamos la cotización por WhatsApp.</p>
        <Link href="/eventos" className="boton boton--claro">
          Cotizar un evento
        </Link>
      </section>
    </>
  );
}
