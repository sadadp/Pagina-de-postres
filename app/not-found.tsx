import Link from 'next/link';

export default function NoEncontrada() {
  return (
    <div className="hoja">
      <h1>Esa página no existe.</h1>
      <p className="hoja__entrada">Puede que el enlace esté mal escrito o que el postre ya no esté en el menú.</p>
      <Link href="/" className="boton">
        Ver el menú
      </Link>
    </div>
  );
}
