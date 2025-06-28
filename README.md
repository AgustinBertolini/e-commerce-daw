# E-Commerce DAW

Este proyecto es una aplicación de e-commerce desarrollada con Next.js, TypeScript y Tailwind CSS. Permite a los usuarios explorar productos, agregarlos al carrito, realizar compras, gestionar favoritos y administrar productos (para administradores).

## Características principales

- **Autenticación de usuarios**: Registro, inicio de sesión y gestión de perfiles.
- **Catálogo de productos**: Navegación, búsqueda y filtrado de productos.
- **Carrito de compras**: Agregar, eliminar y modificar productos en el carrito.
- **Favoritos**: Guardar productos favoritos para fácil acceso.
- **Proceso de compra**: Checkout y confirmación de compra.
- **Panel de administración**: Gestión de productos (crear, editar, eliminar).
- **Diseño responsivo**: Adaptado para dispositivos móviles y escritorio.
- **UI moderna**: Utiliza Tailwind CSS y componentes personalizados.

## Estructura del proyecto

- `/app`: Rutas y páginas principales de la aplicación.
- `/components`: Componentes reutilizables de UI y lógica.
- `/hooks`: Custom hooks para lógica compartida.
- `/lib`: Funciones auxiliares y lógica de negocio (API, autenticación, carrito, etc).
- `/public`: Recursos estáticos (imágenes, logos, etc).
- `/styles`: Archivos de estilos globales.
- `/types`: Definiciones de tipos TypeScript.

## Instalación

1. **Clona el repositorio:**
   ```bash
   git clone <url-del-repositorio>
   cd e-commerce-daw
   ```
2. **Instala las dependencias:**
   ```bash
   pnpm install
   ```
3. **Configura las variables de entorno:**
   Crea un archivo `.env.local` en la raíz y agrega las variables necesarias (por ejemplo, claves de API, URLs de backend, etc).

4. **Ejecuta el proyecto en desarrollo:**

   ```bash
   pnpm dev
   ```

5. **Abre la aplicación:**
   Visita [http://localhost:3000](http://localhost:3000) en tu navegador.

## Scripts disponibles

- `pnpm dev`: Inicia el servidor de desarrollo.
- `pnpm build`: Genera la build de producción.
- `pnpm start`: Inicia la aplicación en modo producción.
- `pnpm lint`: Ejecuta el linter para revisar el código.

## Tecnologías utilizadas

- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [PNPM](https://pnpm.io/)

## Estructura de carpetas

```
app/                # Páginas y rutas principales
components/         # Componentes reutilizables
hooks/              # Custom hooks
lib/                # Lógica de negocio y utilidades
public/             # Archivos estáticos
styles/             # Estilos globales
types/              # Tipos TypeScript
```

## Contribución

¡Las contribuciones son bienvenidas! Por favor, abre un issue o pull request para sugerencias o mejoras.

## Licencia

Este proyecto está bajo la licencia MIT.
