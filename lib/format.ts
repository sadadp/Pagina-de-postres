const pesos = new Intl.NumberFormat('es-MX', { maximumFractionDigits: 2, minimumFractionDigits: 0 });

/** $1,250 — sin centavos cuando el precio es entero. */
export function precio(valor: number): string {
  return `$${pesos.format(valor)}`;
}

export function plural(n: number, uno: string, varios: string): string {
  return `${n} ${n === 1 ? uno : varios}`;
}

/** Fecha local en formato AAAA-MM-DD, el que usa <input type="date">. */
export function fechaISO(d: Date): string {
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}

export function hoyMas(dias: number): Date {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() + dias);
  return d;
}

/** "jueves 19 de noviembre" a partir de AAAA-MM-DD. */
export function fechaLarga(iso: string): string {
  const [a, m, d] = iso.split('-').map(Number);
  if (!a || !m || !d) return iso;
  return new Intl.DateTimeFormat('es-MX', { weekday: 'long', day: 'numeric', month: 'long' }).format(
    new Date(a, m - 1, d, 12),
  );
}
