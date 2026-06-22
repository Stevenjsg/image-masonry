# Image Masonry

Proyecto de práctica para crear un **layout grid masonry** consumiendo imágenes desde la **API de Pexels** mediante `fetch`. La página obtiene fotos curadas en el servidor y las muestra en una grilla responsiva de columnas que conserva la relación de aspecto de cada imagen.

## Propósito

Ejercicio para practicar:

- Construcción de un layout **masonry** con CSS Grid y columnas responsivas.
- Consumo de una API REST externa (Pexels) con `fetch` y cabeceras de autorización.
- Obtención de datos en **Server Components** (Next.js App Router) y optimización de imágenes con `next/image`.

## Stack

- **Next.js 16** (App Router) + **React 19**
- **TypeScript**
- **Tailwind CSS v4**
- **pnpm** como gestor de paquetes
- **Pexels API v1** como fuente de imágenes

## Estructura del proyecto

```
image-masonry/
├── app/
│   ├── components/
│   │   └── gridMasonry.tsx     # Grilla masonry responsiva (client component)
│   ├── services/
│   │   ├── config.ts           # API key y configuración de la petición
│   │   └── getPhotoPexels.ts   # Funciones fetch a la API de Pexels
│   ├── types/
│   │   └── photo.d.ts          # Tipos: Photo, ResponsePhoto, Src
│   ├── globals.css             # Estilos base (Tailwind) y tema
│   ├── layout.tsx              # Layout raíz y fuentes
│   └── page.tsx                # Home: obtiene fotos y renderiza la grilla
├── public/                     # Assets estáticos
├── next.config.ts              # Config Next (dominios de imágenes remotas)
├── tsconfig.json
├── eslint.config.mjs
├── postcss.config.mjs
├── SDD.md                      # Documento de diseño de software
└── package.json
```

## Instalación

Requisitos: Node.js 20+ y pnpm.

```bash
# 1. Instalar dependencias
pnpm install

# 2. Crear el archivo .env en la raíz con tu API key de Pexels
echo "PEXEL_API_KEY=tu_api_key" > .env
```

Obtén una API key gratuita en https://www.pexels.com/api/.

> El proyecto autoriza imágenes desde `images.pexels.com` en `next.config.ts`. Si usas otro dominio de imágenes, agrégalo allí.

## Scripts

| Script | Comando | Descripción |
|--------|---------|-------------|
| Desarrollo | `pnpm dev` | Inicia el servidor de desarrollo en http://localhost:3000. |
| Build | `pnpm build` | Genera la build de producción. |
| Producción | `pnpm start` | Sirve la build de producción. |
| Lint | `pnpm lint` | Ejecuta ESLint. |

## Cómo funciona

1. `app/page.tsx` (Server Component) llama a `getCuRatedPhotos(80)` para traer fotos curadas de Pexels.
2. Las fotos se pasan al componente cliente `GridMasonry`.
3. `GridMasonry` calcula el número de columnas según el ancho del viewport (de 2 a 6 columnas) y distribuye las imágenes entre ellas, conservando su relación de aspecto.

Más detalles de arquitectura y decisiones de diseño en [SDD.md](./SDD.md).
