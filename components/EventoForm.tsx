'use client';

import { useEffect, useRef, useState } from 'react';
import { fechaISO, hoyMas } from '@/lib/format';
import { enlaceWhatsApp, mensajeEvento } from '@/lib/whatsapp';

const TIPOS = ['Boda', 'Cumpleaños', 'Bautizo o primera comunión', 'Baby shower', 'Evento de empresa', 'Otro'];

type Campos = { tipo: string; fecha: string; personas: string; nombre: string; comentarios: string };
type Errores = Partial<Record<'fecha' | 'personas' | 'nombre', string>>;

export function EventoForm({ whatsapp }: { whatsapp: string }) {
  const [campos, setCampos] = useState<Campos>({ tipo: TIPOS[0], fecha: '', personas: '', nombre: '', comentarios: '' });
  const [errores, setErrores] = useState<Errores>({});
  const [enlace, setEnlace] = useState('');
  const formulario = useRef<HTMLFormElement>(null);
  // Se calcula en el navegador: la página se compila una sola vez y la fecha cambia cada día.
  const [manana, setManana] = useState('');
  useEffect(() => setManana(fechaISO(hoyMas(1))), []);

  function cambiar<K extends keyof Campos>(campo: K, valor: string) {
    setCampos((c) => ({ ...c, [campo]: valor }));
    if (campo in errores) setErrores((e) => ({ ...e, [campo]: undefined }));
  }

  function enviar(evento: React.FormEvent) {
    evento.preventDefault();
    const e: Errores = {};
    if (!campos.fecha) e.fecha = 'Elige la fecha del evento.';
    else if (campos.fecha < fechaISO(hoyMas(1))) e.fecha = 'Elige una fecha a partir de mañana.';
    if (!(Number(campos.personas) > 0)) e.personas = 'Escribe cuántas personas van.';
    if (!campos.nombre.trim()) e.nombre = 'Escribe tu nombre.';
    setErrores(e);
    const primero = (['fecha', 'personas', 'nombre'] as const).find((c) => e[c]);
    if (primero) {
      formulario.current?.querySelector<HTMLElement>(`#ev-${primero}`)?.focus();
      return;
    }
    const url = enlaceWhatsApp(
      whatsapp,
      mensajeEvento({
        tipo: campos.tipo,
        fecha: campos.fecha,
        personas: String(Math.round(Number(campos.personas))),
        nombre: campos.nombre.trim(),
        comentarios: campos.comentarios.trim().replace(/\s*\n\s*/g, ' '),
      }),
    );
    setEnlace(url);
    window.open(url, '_blank', 'noopener');
  }

  if (enlace) {
    return (
      <div className="enviado" role="status">
        <h2>Abrimos WhatsApp con tu solicitud.</h2>
        <p>Dale enviar en el chat y te respondemos con la cotización.</p>
        <div className="enviado__acciones">
          <a className="boton" href={enlace} target="_blank" rel="noopener noreferrer">
            Abrir WhatsApp otra vez
          </a>
          <button type="button" className="boton boton--linea" onClick={() => setEnlace('')}>
            Cambiar los datos
          </button>
        </div>
      </div>
    );
  }

  return (
    <form className="pedido" onSubmit={enviar} noValidate ref={formulario}>
      <div className="campo">
        <label htmlFor="ev-tipo">Tipo de evento</label>
        <select id="ev-tipo" name="tipo" value={campos.tipo} onChange={(e) => cambiar('tipo', e.target.value)}>
          {TIPOS.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>

      <div className="campos-dos">
        <div className="campo">
          <label htmlFor="ev-fecha">Fecha</label>
          <input
            id="ev-fecha"
            name="fecha"
            type="date"
            min={manana || undefined}
            value={campos.fecha}
            onChange={(e) => cambiar('fecha', e.target.value)}
            aria-invalid={errores.fecha ? true : undefined}
            aria-describedby={errores.fecha ? 'e-ev-fecha' : undefined}
          />
          {errores.fecha ? <p className="error" id="e-ev-fecha">{errores.fecha}</p> : null}
        </div>
        <div className="campo">
          <label htmlFor="ev-personas">Personas</label>
          <input
            id="ev-personas"
            name="personas"
            type="number"
            inputMode="numeric"
            min={1}
            value={campos.personas}
            onChange={(e) => cambiar('personas', e.target.value)}
            aria-invalid={errores.personas ? true : undefined}
            aria-describedby={errores.personas ? 'e-ev-personas' : undefined}
          />
          {errores.personas ? <p className="error" id="e-ev-personas">{errores.personas}</p> : null}
        </div>
      </div>

      <div className="campo">
        <label htmlFor="ev-nombre">Tu nombre</label>
        <input
          id="ev-nombre"
          name="nombre"
          type="text"
          autoComplete="name"
          value={campos.nombre}
          onChange={(e) => cambiar('nombre', e.target.value)}
          aria-invalid={errores.nombre ? true : undefined}
          aria-describedby={errores.nombre ? 'e-ev-nombre' : undefined}
        />
        {errores.nombre ? <p className="error" id="e-ev-nombre">{errores.nombre}</p> : null}
      </div>

      <div className="campo">
        <label htmlFor="ev-comentarios">
          Qué te gustaría <span className="opcional">(opcional)</span>
        </label>
        <textarea
          id="ev-comentarios"
          name="comentarios"
          rows={3}
          placeholder="Postres que quieres, colores, lugar del evento"
          value={campos.comentarios}
          onChange={(e) => cambiar('comentarios', e.target.value)}
        />
      </div>

      {whatsapp ? (
        <>
          <button type="submit" className="boton boton--grande">
            Pedir cotización por WhatsApp
          </button>
          <p className="ayuda ayuda--centro">Se abre WhatsApp con tus datos ya escritos. Solo dale enviar.</p>
        </>
      ) : (
        <p className="aviso" role="alert">
          Falta el número de WhatsApp del negocio, así que la solicitud todavía no se puede enviar. Se agrega en el panel
          de administración, en Ajustes.
        </p>
      )}
    </form>
  );
}
