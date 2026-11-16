'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { agregar, quitar, usePedido, vaciar } from '@/lib/cart';
import { fechaISO, fechaLarga, hoyMas, precio } from '@/lib/format';
import { saborDe } from '@/lib/sabores';
import type { Ajustes, Producto } from '@/lib/types';
import { enlaceWhatsApp, mensajePedido } from '@/lib/whatsapp';
import { Mas, Menos, Palomita } from './icons';

type Item = Pick<Producto, 'slug' | 'nombre' | 'precio' | 'sabor' | 'foto' | 'anticipacion' | 'agotado'>;
type Datos = Pick<Ajustes, 'whatsapp' | 'banco' | 'titular' | 'clabe' | 'envio_nota'>;
type Campos = { nombre: string; direccion: string; fecha: string; hora: string; comentarios: string };
type Errores = Partial<Record<'nombre' | 'direccion' | 'fecha', string>>;

const CLAVE_DATOS = 'canelia-datos-v1';

export function PedidoForm({ productos, ajustes }: { productos: Item[]; ajustes: Datos }) {
  const pedido = usePedido();
  const [montado, setMontado] = useState(false);
  const [campos, setCampos] = useState<Campos>({ nombre: '', direccion: '', fecha: '', hora: '', comentarios: '' });
  const [pago, setPago] = useState<'transferencia' | 'efectivo'>('transferencia');
  const [errores, setErrores] = useState<Errores>({});
  const [copiada, setCopiada] = useState(false);
  const [enlace, setEnlace] = useState('');
  const formulario = useRef<HTMLFormElement>(null);

  // Recuerda nombre y dirección en este dispositivo para el siguiente pedido.
  useEffect(() => {
    setMontado(true);
    try {
      const guardado = JSON.parse(window.localStorage.getItem(CLAVE_DATOS) ?? 'null') as Partial<Campos> | null;
      if (guardado) setCampos((c) => ({ ...c, nombre: guardado.nombre ?? '', direccion: guardado.direccion ?? '' }));
    } catch {
      // Sin datos guardados.
    }
  }, []);

  const renglones = useMemo(
    () =>
      productos
        .filter((p) => !p.agotado && (pedido[p.slug] ?? 0) > 0)
        .map((p) => ({ ...p, cantidad: pedido[p.slug], importe: pedido[p.slug] * p.precio })),
    [productos, pedido],
  );
  const total = renglones.reduce((suma, r) => suma + r.importe, 0);
  const anticipacion = renglones.reduce((max, r) => Math.max(max, r.anticipacion), 0);
  const fechaMinima = fechaISO(hoyMas(anticipacion));
  const hayDatosBanco = Boolean(ajustes.clabe);

  function cambiar<K extends keyof Campos>(campo: K, valor: string) {
    setCampos((c) => ({ ...c, [campo]: valor }));
    if (campo in errores) setErrores((e) => ({ ...e, [campo]: undefined }));
  }

  function validar(): Errores {
    const e: Errores = {};
    if (!campos.nombre.trim()) e.nombre = 'Escribe tu nombre.';
    if (!campos.direccion.trim()) e.direccion = 'Escribe la dirección de entrega.';
    if (!campos.fecha) e.fecha = 'Elige el día de entrega.';
    else if (campos.fecha < fechaMinima) e.fecha = `La fecha más cercana para este pedido es ${fechaLarga(fechaMinima)}.`;
    return e;
  }

  function enviar(evento: React.FormEvent) {
    evento.preventDefault();
    const e = validar();
    setErrores(e);
    const primero = (['nombre', 'direccion', 'fecha'] as const).find((c) => e[c]);
    if (primero) {
      formulario.current?.querySelector<HTMLElement>(`#${primero}`)?.focus();
      return;
    }

    try {
      window.localStorage.setItem(
        CLAVE_DATOS,
        JSON.stringify({ nombre: campos.nombre.trim(), direccion: campos.direccion.trim() }),
      );
    } catch {
      // No pasa nada si no se puede guardar.
    }

    const url = enlaceWhatsApp(
      ajustes.whatsapp,
      mensajePedido({
        renglones: renglones.map((r) => ({ nombre: r.nombre, cantidad: r.cantidad, importe: r.importe })),
        total,
        nombre: campos.nombre.trim(),
        direccion: campos.direccion.trim().replace(/\s*\n\s*/g, ', '),
        fecha: campos.fecha,
        hora: campos.hora,
        pago,
        comentarios: campos.comentarios.trim().replace(/\s*\n\s*/g, ' '),
      }),
    );
    setEnlace(url);
    window.open(url, '_blank', 'noopener');
  }

  async function copiarClabe() {
    try {
      await navigator.clipboard.writeText(ajustes.clabe);
      setCopiada(true);
      window.setTimeout(() => setCopiada(false), 2500);
    } catch {
      // Si el navegador no deja copiar, la CLABE sigue a la vista para copiarla a mano.
    }
  }

  if (!montado) return <div className="pedido__espera" aria-hidden="true" />;

  if (renglones.length === 0) {
    return (
      <div className="vacio">
        <p>Tu pedido está vacío. Agrega algo del menú.</p>
        <Link href="/" className="boton">
          Ver el menú
        </Link>
      </div>
    );
  }

  if (enlace) {
    return (
      <div className="enviado" role="status">
        <h2>Abrimos WhatsApp con tu pedido.</h2>
        <p>
          Dale enviar en el chat para que lo recibamos.
          {pago === 'transferencia' ? ' Adjunta ahí tu comprobante de transferencia.' : ''}
        </p>
        <div className="enviado__acciones">
          <a className="boton" href={enlace} target="_blank" rel="noopener noreferrer">
            Abrir WhatsApp otra vez
          </a>
          <button type="button" className="boton boton--linea" onClick={() => setEnlace('')}>
            Cambiar el pedido
          </button>
          <button
            type="button"
            className="boton boton--linea"
            onClick={() => {
              vaciar();
              setEnlace('');
            }}
          >
            Vaciar pedido
          </button>
        </div>
      </div>
    );
  }

  return (
    <form className="pedido" onSubmit={enviar} noValidate ref={formulario}>
      <ul className="renglones">
        {renglones.map((r) => (
          <li key={r.slug} className="renglon">
            <span
              className={`renglon__color${saborDe(r.sabor).claro && !r.foto ? ' renglon__color--claro' : ''}`}
              style={{ backgroundColor: saborDe(r.sabor).color }}
            >
              {r.foto ? <img src={r.foto} alt="" loading="lazy" /> : null}
            </span>
            <span className="renglon__texto">
              <strong>{r.nombre}</strong>
              <span>{precio(r.precio)} cada uno</span>
            </span>
            <span className="contador">
              <button type="button" onClick={() => quitar(r.slug)} aria-label={`Quitar uno: ${r.nombre}`}>
                <Menos />
              </button>
              <output aria-label={`Cantidad de ${r.nombre}`}>{r.cantidad}</output>
              <button type="button" onClick={() => agregar(r.slug)} aria-label={`Agregar otro: ${r.nombre}`}>
                <Mas />
              </button>
            </span>
            <span className="renglon__importe">{precio(r.importe)}</span>
          </li>
        ))}
      </ul>

      <p className="total">
        <span>Total</span>
        <strong>{precio(total)}</strong>
      </p>
      {ajustes.envio_nota ? <p className="nota">{ajustes.envio_nota}</p> : null}

      <fieldset className="bloque">
        <legend>Entrega</legend>

        <div className="campo">
          <label htmlFor="nombre">Tu nombre</label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            autoComplete="name"
            value={campos.nombre}
            onChange={(e) => cambiar('nombre', e.target.value)}
            aria-invalid={errores.nombre ? true : undefined}
            aria-describedby={errores.nombre ? 'e-nombre' : undefined}
          />
          {errores.nombre ? <p className="error" id="e-nombre">{errores.nombre}</p> : null}
        </div>

        <div className="campo">
          <label htmlFor="direccion">Dirección de entrega</label>
          <textarea
            id="direccion"
            name="direccion"
            rows={3}
            autoComplete="street-address"
            placeholder="Calle, número, colonia y referencias"
            value={campos.direccion}
            onChange={(e) => cambiar('direccion', e.target.value)}
            aria-invalid={errores.direccion ? true : undefined}
            aria-describedby={errores.direccion ? 'e-direccion' : undefined}
          />
          {errores.direccion ? <p className="error" id="e-direccion">{errores.direccion}</p> : null}
        </div>

        <div className="campos-dos">
          <div className="campo">
            <label htmlFor="fecha">Día de entrega</label>
            <input
              id="fecha"
              name="fecha"
              type="date"
              min={fechaMinima}
              value={campos.fecha}
              onChange={(e) => cambiar('fecha', e.target.value)}
              aria-invalid={errores.fecha ? true : undefined}
              aria-describedby={errores.fecha ? 'e-fecha' : 'a-fecha'}
            />
            {errores.fecha ? (
              <p className="error" id="e-fecha">{errores.fecha}</p>
            ) : (
              <p className="ayuda" id="a-fecha">Desde {fechaLarga(fechaMinima)}.</p>
            )}
          </div>
          <div className="campo">
            <label htmlFor="hora">
              Hora <span className="opcional">(opcional)</span>
            </label>
            <input id="hora" name="hora" type="time" value={campos.hora} onChange={(e) => cambiar('hora', e.target.value)} />
          </div>
        </div>
      </fieldset>

      <fieldset className="bloque">
        <legend>Pago</legend>
        <div className="opciones">
          <label className="opcion">
            <input type="radio" name="pago" checked={pago === 'transferencia'} onChange={() => setPago('transferencia')} />
            <span>Transferencia</span>
          </label>
          <label className="opcion">
            <input type="radio" name="pago" checked={pago === 'efectivo'} onChange={() => setPago('efectivo')} />
            <span>Efectivo al recibir</span>
          </label>
        </div>

        {pago === 'transferencia' ? (
          hayDatosBanco ? (
            <div className="banco">
              <dl>
                {ajustes.banco ? (
                  <div>
                    <dt>Banco</dt>
                    <dd>{ajustes.banco}</dd>
                  </div>
                ) : null}
                {ajustes.titular ? (
                  <div>
                    <dt>A nombre de</dt>
                    <dd>{ajustes.titular}</dd>
                  </div>
                ) : null}
                <div>
                  <dt>CLABE</dt>
                  <dd className="banco__clabe">{ajustes.clabe.replace(/(\d{4})(?=\d)/g, '$1 ')}</dd>
                </div>
              </dl>
              <button type="button" className="boton boton--linea boton--chico" onClick={copiarClabe}>
                {copiada ? (
                  <>
                    <Palomita /> CLABE copiada
                  </>
                ) : (
                  'Copiar CLABE'
                )}
              </button>
              <p className="ayuda">Transfiere {precio(total)} más el envío que acordemos y adjunta tu comprobante en el chat.</p>
            </div>
          ) : (
            <p className="ayuda">Te mandamos los datos de transferencia por WhatsApp.</p>
          )
        ) : (
          <p className="ayuda">Pagas al repartidor o como lo acordemos por WhatsApp.</p>
        )}
      </fieldset>

      <div className="campo">
        <label htmlFor="comentarios">
          Comentarios <span className="opcional">(opcional)</span>
        </label>
        <textarea
          id="comentarios"
          name="comentarios"
          rows={2}
          placeholder="Alergias, dedicatoria, quién recibe"
          value={campos.comentarios}
          onChange={(e) => cambiar('comentarios', e.target.value)}
        />
      </div>

      {ajustes.whatsapp ? (
        <>
          <button type="submit" className="boton boton--grande">
            Enviar pedido por WhatsApp
          </button>
          <p className="ayuda ayuda--centro">Se abre WhatsApp con tu pedido ya escrito. Solo dale enviar.</p>
        </>
      ) : (
        <p className="aviso" role="alert">
          Falta el número de WhatsApp del negocio, así que el pedido todavía no se puede enviar. Se agrega en el panel de
          administración, en Ajustes.
        </p>
      )}
    </form>
  );
}
