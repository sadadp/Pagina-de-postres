import type { NextConfig } from 'next';

// El sitio se exporta como archivos estáticos (carpeta out/), sin servidor.
const config: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
};

export default config;
