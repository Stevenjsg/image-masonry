# Software Design Document (SDD) — Image Masonry

## 1. Introducción

### 1.1 Propósito
Este documento describe el diseño técnico de **Image Masonry**, una aplicación de práctica construida con Next.js cuyo objetivo es implementar un layout tipo **grid masonry** alimentado por peticiones (`fetch`) a la **API de Pexels**. El proyecto sirve como ejercicio para practicar consumo de APIs externas, renderizado en servidor y construcción de grillas responsivas con CSS Grid.

### 1.2 Alcance
La aplicación obtiene fotografías de la API de Pexels y las muestra en una grilla de columnas que se reorganiza según el ancho de la pantalla, manteniendo la relación de aspecto original de cada imagen. No incluye autenticación de usuarios, persistencia ni backend propio más allá del consumo de la API de Pexels.

### 1.3 Definiciones
- **Masonry**: disposición de elementos en columnas donde cada celda conserva su altura natural, evitando los huecos de una grilla rígida.
- **Pexels API**: servicio REST que provee fotografías gratuitas. Requiere una API key enviada en la cabecera `Authorization`.
- **SSR (Server-Side Rendering)**: renderizado de la página en el servidor; aquí la obtención inicial de fotos ocurre en un Server Component.

## 2. Visión general del sistema

La aplicación está construida sobre **Next.js 16** (App Router) con **React 19**, **TypeScript** y **Tailwind CSS v4**. El gestor de paquetes es **pnpm**.

El flujo principal es:

1. La página raíz (`app/page.tsx`), que es un Server Component asíncrono, solicita un lote de fotos curadas a la API de Pexels al renderizar.
2. Las fotos se pasan como props al componente cliente `GridMasonry`.
3. `GridMasonry` distribuye las fotos entre N columnas (según el ancho de viewport) y las renderiza con el componente `next/image`, preservando la relación de aspecto de cada imagen.

```
Pexels API  ──fetch──>  page.tsx (Server)  ──props──>  GridMasonry (Client)  ──>  <Image />
```

## 3. Arquitectura

### 3.1 Capas

| Capa | Archivo(s) | Responsabilidad |
|------|-----------|-----------------|
| Presentación (servidor) | `app/page.tsx`, `app/layout.tsx` | Layout raíz, fuentes, obtención inicial de datos y composición de la página. |
| Presentación (cliente) | `app/components/gridMasonry.tsx` | Cálculo de columnas responsivas, distribución de fotos y renderizado de la grilla. |
| Servicios / datos | `app/services/getPhotoPexels.ts`, `app/services/config.ts` | Acceso a la API de Pexels y configuración de la petición (key, cabeceras). |
| Tipos | `app/types/photo.d.ts` | Contratos de datos (`Photo`, `ResponsePhoto`, `Src`). |
| Estilos | `app/globals.css` | Tema base, variables de color y modo oscuro. |
| Configuración | `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs` | Configuración de Next, TypeScript, linting y PostCSS/Tailwind. |

### 3.2 Decisiones de diseño relevantes
- **Obtención de datos en el servidor**: `page.tsx` es `async` y obtiene las fotos antes de enviar HTML al cliente, mejorando el primer renderizado y evitando exponer la API key en el navegador.
- **Componente cliente para la responsividad**: `GridMasonry` usa `"use client"` porque necesita `matchMedia` y `window.resize` para recalcular el número de columnas en tiempo real.
- **Imágenes remotas autorizadas**: `next.config.ts` declara `images.pexels.com` en `remotePatterns` para permitir su optimización mediante `next/image`.

> Nota: este repositorio fija una versión de Next.js con cambios de ruptura respecto a versiones previas. Antes de modificar código, consulta las guías en `node_modules/next/dist/docs/`.

## 4. Diseño de componentes

### 4.1 `app/layout.tsx` (RootLayout)
Define el documento HTML, carga las fuentes Geist (sans y mono) vía `next/font/google` y aplica clases base de Tailwind. Establece la metadata del documento. Envuelve a todos los `children` con un `body` flex en columna.

### 4.2 `app/page.tsx` (Home)
Server Component asíncrono. Llama a `getCuRatedPhotos(80)` para traer un lote de fotos curadas, desestructura `photos` y los entrega a `GridMasonry`. Es el punto de entrada de datos de la aplicación.

### 4.3 `app/components/gridMasonry.tsx` (GridMasonry)
Componente cliente que recibe `photos: Photo[]`. Lógica clave:

- **Breakpoints** (`breakpoints`): mapa de `minWidth → número de columnas` (1536→6, 1280→5, 1024→4, 768→3; por defecto 2).
- **`distributePhotos(photos, ncol)`**: reparte las fotos entre columnas usando módulo del índice (`i % ncol`), de modo que las imágenes se distribuyen en orden round-robin entre columnas.
- **`useEffect` + `matchMedia`**: al montar y en cada `resize`, recalcula `ncols` según el breakpoint activo.
- **Render**: una `<section>` con `grid-template-columns: repeat(ncols, 1fr)`; cada columna es un `<ul>` y cada foto un `<figure>` con `aspectRatio` derivado de `width/height`, un `<figcaption>` con el nombre del fotógrafo (visible en hover) y un `next/image` con `fill`.

### 4.4 Servicios

**`app/services/config.ts`**: lee `PEXEL_API_KEY` desde el entorno y lanza un error si falta. Exporta la key y un objeto `getRequest` con método `GET` y cabeceras (`accept`, `Authorization`).

**`app/services/getPhotoPexels.ts`**: tres funciones contra la API de Pexels:

| Función | Endpoint | Descripción |
|---------|----------|-------------|
| `getPhotoById(id)` | `/v1/photos/{id}` | Devuelve una foto por su id. |
| `searchPhoto(query, page)` | `/v1/search?query=&per_page=` | Busca fotos por término. |
| `getCuRatedPhotos(page)` | `/v1/curated?per_page=` | Devuelve fotos curadas (usado por la home). |

### 4.5 Tipos (`app/types/photo.d.ts`)
Define `ResponsePhoto` (envoltura con paginación y array `photos`), `Photo` (id, dimensiones, fotógrafo, `src`, `alt`, etc.) y `Src` (variantes de tamaño de la imagen: `original`, `large`, `medium`, etc.).

## 5. Diseño de datos

La unidad de datos es `Photo`, tal como la entrega Pexels. Los campos usados directamente en la UI son: `id` (key), `width`/`height` (relación de aspecto), `src.large` (fuente de imagen), `photographer` (caption) y `alt` (accesibilidad).

## 6. Flujo de una petición

1. El servidor renderiza `Home`.
2. `getCuRatedPhotos(80)` ejecuta `fetch` a `/v1/curated?per_page=80` con la cabecera `Authorization`.
3. Pexels responde con `ResponsePhoto`; se extrae `photos`.
4. `GridMasonry` recibe el array, calcula columnas según el viewport y renderiza la grilla.
5. `next/image` optimiza y sirve cada imagen desde `images.pexels.com`.

## 7. Configuración y entorno

- **Variable requerida**: `PEXEL_API_KEY` en un archivo `.env` en la raíz.
- **Imágenes remotas**: habilitadas para `images.pexels.com` en `next.config.ts`.
- **Estilos**: Tailwind CSS v4 vía `@import "tailwindcss"` en `globals.css`, con variables de tema y soporte de modo oscuro por `prefers-color-scheme`.

## 8. Consideraciones de calidad y mejoras futuras

- **Manejo de errores**: actualmente `page.tsx` usa un fallback poco robusto (`?? <div>Error 404</div>` sobre una desestructuración); convendría validar la respuesta de la API explícitamente.
- **Tipo de retorno**: alinear el tipado de las funciones de servicio con respuestas de error de la API.
- **Búsqueda en UI**: `searchPhoto` y `getPhotoById` existen pero aún no se exponen en la interfaz; son candidatos naturales para futuras funciones (buscador, vista de detalle).
- **Paginación / scroll infinito**: hoy se trae un único lote de 80 fotos.
- **Accesibilidad y metadata**: actualizar `title`/`description` del layout (hoy con valores por defecto de create-next-app).

## 9. Stack tecnológico

| Tecnología | Versión | Uso |
|-----------|---------|-----|
| Next.js | 16.2.9 | Framework (App Router, SSR, next/image). |
| React | 19.2.4 | Librería de UI. |
| TypeScript | ^5 | Tipado estático. |
| Tailwind CSS | ^4 | Estilos utilitarios. |
| pnpm | — | Gestor de paquetes. |
| Pexels API | v1 | Fuente de imágenes. |
