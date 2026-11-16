import fs from 'node:fs';
import path from 'node:path';
import type { Ajustes, Categoria, Producto } from './types';

const RAIZ = path.join(process.cwd(), 'content');

function leer<T>(archivo: string): T {
  return JSON.parse(fs.readFileSync(path.join(RAIZ, archivo), 'utf8')) as T;
}

export function leerAjustes(): Ajustes {
  const a = leer<Partial<Ajustes>>('ajustes.json');
  return {
    whatsapp: limpiarTelefono(a.whatsapp ?? ''),
    ciudad: a.ciudad ?? '',
    portada_titulo: a.portada_titulo || 'Elige por sabor.',
    portada_texto: a.portada_texto ?? '',
    envio_nota: a.envio_nota ?? '',
    banco: a.banco ?? '',
    titular: a.titular ?? '',
    clabe: (a.clabe ?? '').replace(/\s+/g, ''),
    instagram: (a.instagram ?? '').replace(/^@/, '').trim(),
    sitio_url: (a.sitio_url ?? '').replace(/\/+$/, ''),
  };
}

export function leerCategorias(): Categoria[] {
  const { categorias } = leer<{ categorias: Partial<Categoria>[] }>('categorias.json');
  return (categorias ?? [])
    .filter((c): c is Partial<Categoria> & { id: string; nombre: string } => Boolean(c.id && c.nombre))
    .map((c) => ({ id: c.id, nombre: c.nombre, nota: c.nota ?? '' }));
}

export function leerProductos(): Producto[] {
  const carpeta = path.join(RAIZ, 'productos');
  return fs
    .readdirSync(carpeta)
    .filter((f) => f.endsWith('.json'))
    .map((f) => {
      const p = JSON.parse(fs.readFileSync(path.join(carpeta, f), 'utf8')) as Partial<Producto>;
      return {
        slug: f.replace(/\.json$/, ''),
        nombre: p.nombre ?? '',
        descripcion: p.descripcion ?? '',
        precio: Number(p.precio) || 0,
        categoria: p.categoria ?? '',
        sabor: p.sabor ?? 'canela',
        foto: p.foto ?? '',
        anticipacion: Math.max(0, Math.round(Number(p.anticipacion) || 0)),
        agotado: Boolean(p.agotado),
        orden: Number(p.orden) || 0,
      };
    })
    .filter((p) => p.nombre)
    .sort((a, b) => a.orden - b.orden || a.nombre.localeCompare(b.nombre, 'es'));
}

/** Deja solo dígitos. Un número mexicano de 10 dígitos recibe el prefijo 52. */
function limpiarTelefono(valor: string): string {
  const digitos = valor.replace(/\D/g, '');
  return digitos.length === 10 ? `52${digitos}` : digitos;
}
