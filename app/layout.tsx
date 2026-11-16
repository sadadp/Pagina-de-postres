import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { OrderBar } from '@/components/OrderBar';
import { RegisterSW } from '@/components/RegisterSW';
import { leerAjustes, leerProductos } from '@/lib/content';
import './globals.css';

const fuente = localFont({
  src: './fonts/schibsted-grotesk-latin-wght-normal.woff2',
  weight: '400 900',
  display: 'swap',
  variable: '--fuente',
  fallback: ['Helvetica Neue', 'Arial', 'sans-serif'],
});

const ajustes = leerAjustes();
const descripcion = `Roles, churros, pan, pasteles y postres en vaso hechos por pedido${
  ajustes.ciudad ? ` en ${ajustes.ciudad}` : ''
}. Arma tu pedido y mándalo por WhatsApp.`;

export const metadata: Metadata = {
  metadataBase: ajustes.sitio_url ? new URL(ajustes.sitio_url) : undefined,
  title: { default: 'Canelia: postres por pedido', template: '%s | Canelia' },
  description: descripcion,
  applicationName: 'Canelia',
  appleWebApp: { capable: true, title: 'Canelia', statusBarStyle: 'default' },
  formatDetection: { telephone: false },
  openGraph: {
    title: 'Canelia: postres por pedido',
    description: descripcion,
    siteName: 'Canelia',
    locale: 'es_MX',
    type: 'website',
    images: [{ url: '/icons/compartir.png', width: 1200, height: 630, alt: 'Canelia' }],
  },
  icons: {
    icon: [
      { url: '/icons/favicon-48.png', sizes: '48x48', type: 'image/png' },
      { url: '/icons/icono-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: '/icons/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const precios = Object.fromEntries(
    leerProductos()
      .filter((p) => !p.agotado)
      .map((p) => [p.slug, p.precio]),
  );

  return (
    <html lang="es-MX" className={fuente.variable}>
      <body>
        <a className="saltar" href="#contenido">
          Ir al contenido
        </a>
        <Header />
        <main id="contenido">{children}</main>
        <Footer ajustes={ajustes} />
        <OrderBar precios={precios} />
        <RegisterSW />
      </body>
    </html>
  );
}
