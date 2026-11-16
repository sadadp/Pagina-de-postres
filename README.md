# Canelia

Página web y app instalable para vender postres por pedido. El cliente arma su pedido, lo manda por WhatsApp y paga por transferencia o en efectivo. Todo funciona sin costo mensual.

## Qué incluye

- **Menú** (`/`): productos por categoría. Mientras un producto no tiene foto se muestra como una ficha del color de su sabor.
- **Pedido** (`/pedido`): cantidades, dirección, día de entrega y forma de pago. El botón abre WhatsApp con el pedido ya escrito.
- **Eventos** (`/eventos`): formulario para cotizar mesas de postres por WhatsApp.
- **Cómo pedir** (`/como-pedir`): los pasos del pedido y cómo instalar la app en el celular.
- **Panel de administración** (`/admin`): para cambiar productos, precios, fotos y los datos del negocio.
- **App instalable**: se agrega a la pantalla de inicio en iPhone y Android y abre sin conexión.

## Antes de compartir la página

El menú y los precios son de ejemplo. En el panel, cambia:

1. **Ajustes → Datos del negocio**: tu número de WhatsApp (sin él los pedidos no se pueden enviar), tu ciudad y tus datos de transferencia.
2. **Productos**: tus productos y precios reales.
3. **Ajustes → Categorías**: si quieres otras categorías u otro orden.

## Publicar gratis en Cloudflare

1. Pasa el código a la rama `main` del repositorio en GitHub.
2. Crea una cuenta gratuita en Cloudflare y entra a **Workers & Pages**.
3. Crea un proyecto nuevo importando este repositorio de GitHub.
4. Usa estos comandos:
   - Compilación: `npm run build`
   - Publicación: `npx wrangler deploy`
5. Al terminar, Cloudflare te da una dirección del tipo `canelia.tu-cuenta.workers.dev`. Escríbela en el panel, en **Ajustes → Dirección de la página**.

Cada vez que guardas algo en el panel, la página se vuelve a publicar sola en un par de minutos.

Los nombres de los botones de Cloudflare pueden variar. El plan gratuito no debe usarse para capturar datos de tarjeta en la página; esta app no lo hace.

## Entrar al panel

1. Abre `tu-direccion/admin`.
2. Elige **iniciar sesión con token de acceso**.
3. Crea el token en GitHub: Settings → Developer settings → Personal access tokens → Fine-grained tokens. Dale acceso solo a este repositorio, con permiso de lectura y escritura en **Contents**.
4. Pega el token. Queda guardado en ese navegador.

El botón "Sign In with GitHub" no está configurado; usa el token.

## Fotos

Las fotos tuyas, aunque sean de celular, se ven mejor que cualquier imagen de banco.

- Luz natural, junto a una ventana, sin flash.
- El mismo fondo en todas: una mesa clara o una tabla.
- Foto vertical, con el postre al centro y un poco de aire alrededor.
- El mismo ángulo para productos parecidos.
- Sin filtros ni texto encima.

Súbelas desde el panel, en cada producto. Se achican solas.

## Trabajar en el código

```bash
npm install
npm run dev      # servidor de desarrollo
npm run build    # compila el sitio estático en out/
```

- `content/`: el menú y los datos del negocio (lo que edita el panel).
- `app/` y `components/`: páginas y piezas de la interfaz.
- `lib/sabores.ts`: los colores de cada sabor.
- `public/admin/config.yml`: los campos del panel.
- `public/sw.js`: lo que permite abrir la app sin conexión.
