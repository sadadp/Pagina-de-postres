/**
 * Cada sabor tiene un color. Mientras un producto no tenga foto, su ficha
 * muestra el color de su sabor. La lista es cerrada a propósito: mantiene
 * el muestrario parejo. Si agregas un sabor aquí, agrégalo también en
 * public/admin/config.yml para que aparezca en el panel.
 */
export type Sabor = { nombre: string; color: string; claro?: boolean };

export const SABORES: Record<string, Sabor> = {
  canela: { nombre: 'Canela', color: '#a65a2e' },
  cajeta: { nombre: 'Cajeta', color: '#c98a3a' },
  chocolate: { nombre: 'Chocolate', color: '#4b2b20' },
  nuez: { nombre: 'Nuez', color: '#8a6a4a' },
  cafe: { nombre: 'Café', color: '#6f4e37' },
  vainilla: { nombre: 'Vainilla', color: '#f0dfae' },
  elote: { nombre: 'Elote', color: '#f2c84b' },
  naranja: { nombre: 'Naranja', color: '#f09a3e' },
  limon: { nombre: 'Limón', color: '#dfe37a' },
  fresa: { nombre: 'Fresa', color: '#e5808c' },
  glaseado: { nombre: 'Glaseado', color: '#f3c6d2' },
  zarzamora: { nombre: 'Zarzamora', color: '#5a2b4f' },
  leche: { nombre: 'Leche', color: '#f4eee2', claro: true },
};

export function saborDe(id: string): Sabor {
  return SABORES[id] ?? SABORES.canela;
}
