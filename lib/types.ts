export type Producto = {
  slug: string;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  sabor: string;
  foto: string;
  anticipacion: number;
  agotado: boolean;
  orden: number;
};

export type Categoria = {
  id: string;
  nombre: string;
  nota: string;
};

export type Ajustes = {
  whatsapp: string;
  ciudad: string;
  portada_titulo: string;
  portada_texto: string;
  envio_nota: string;
  banco: string;
  titular: string;
  clabe: string;
  instagram: string;
  sitio_url: string;
};
