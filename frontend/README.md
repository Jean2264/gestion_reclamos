# Gestión de reclamos municipales

Aplicación web para registrar y administrar reclamos vinculados con servicios municipales. El sistema reúne un portal para la ciudadanía y un panel interno para que el personal municipal pueda consultar, organizar y dar seguimiento a los casos.

## Alcance actual

### Portal ciudadano

- Registro e inicio de sesión de ciudadanos.
- Consulta y edición del perfil propio.
- Creación de reclamos con ubicación, descripción, área de gestión y datos requeridos para identificar el caso.
- Adjuntar hasta dos imágenes a un reclamo.
- Consulta de los reclamos propios y de su estado.

### Panel administrativo

- Acceso diferenciado para administradores y empleados municipales.
- Consulta y gestión de reclamos, con búsqueda, filtros y paginación.
- Revisión del detalle del reclamo y actualización de su área y estado.
- Registro de reclamos en nombre de un ciudadano.
- Gestión de ciudadanos y perfiles.
- Administración de empleados (alta, edición, consulta y desactivación), reservada al rol administrador.

Los roles contemplados son **Administrador**, **Empleado** y **Ciudadano**. Los estados de reclamo definidos en la base de datos son **Nuevo**, **Asignado**, **En proceso** y **Finalizado**. El historial permite registrar cambios y resoluciones asociados a un reclamo.

## Tecnologías

| Parte | Tecnologías |
| --- | --- |
| Frontend | React 19, React Router 7, Vite 8, JavaScript y CSS |
| Backend | Node.js (ES modules), Express 5 |
| Persistencia | PostgreSQL, mediante `pg` |
| Autenticación | JSON Web Tokens (`jsonwebtoken`), cookies y contraseñas con `bcrypt` |
| Archivos e imágenes | `multer` para cargas y `browser-image-compression` para compresión de imágenes |
| Interfaz y documentos | Bootstrap Icons, Motion y jsPDF |
| Calidad de código | ESLint |

## Estructura

```text
backend/
  database/       Esquema SQL de la aplicación
  scripts/        Scripts de administración inicial
  src/
    config/       Conexión a PostgreSQL, JWT y archivos
    controllers/  Manejo de solicitudes HTTP
    middleware/  Autenticación, roles y cargas
    repositories/ Acceso a datos
    routes/       Rutas de la API
    services/     Lógica de negocio
    validators/   Validaciones de entrada
  uploads/        Imágenes cargadas
frontend/
  docs/           Documentación complementaria
  src/
    components/   Componentes de interfaz
    context/      Estado de autenticación
    layouts/      Diseños públicos y administrativos
    pages/        Páginas de la aplicación
    routes/       Rutas públicas y protegidas
    services/     Comunicación con la API
```

El backend expone la API bajo `/api` y sirve las imágenes desde `/uploads`. Sus rutas están organizadas por usuarios, ciudadanos, empleados y reclamos; las operaciones internas están protegidas según el rol.

## Requisitos y configuración

- Node.js y npm.
- Una instancia de PostgreSQL.
- Variables de entorno configuradas para el backend.

En `backend/.env`, configurar:

```env
PORT=3000
FRONTEND_URL=http://localhost:5173
DB_HOST=localhost
DB_PORT=5432
DB_NAME=gestion_reclamos
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
JWT_SECRET=una_clave_secreta_de_al_menos_32_caracteres
```

`JWT_SECRET` es obligatorio y debe tener al menos 32 caracteres. Actualmente, la mayoría de los servicios del frontend usa `http://localhost:3000/api` de forma directa; el servicio de empleados permite configurar esa URL mediante `VITE_API_URL`, cuyo valor predeterminado también es `http://localhost:3000/api`. Si se despliega la aplicación en otro entorno, revisar las URLs de los servicios del frontend además de configurar `FRONTEND_URL` en el backend.

Crear la base de datos y ejecutar el esquema de [`backend/database/tables.sql`](../backend/database/tables.sql) sobre ella antes de iniciar la aplicación. El script crea las tablas de usuarios, roles, ciudadanos, empleados, áreas, estados, reclamos, historial e imágenes.

## Instalación y ejecución

Instalar las dependencias en cada aplicación:

```bash
cd backend
npm install
```

```bash
cd frontend
npm install
```

Iniciar cada parte en una terminal separada:

```bash
# Terminal 1
cd backend
npm run dev
```

```bash
# Terminal 2
cd frontend
npm run dev
```

Vite muestra la dirección local del frontend (habitualmente `http://localhost:5173`) y el backend escucha en el puerto configurado (por defecto, `3000`). Para permitir el acceso al frontend desde otros dispositivos de la red durante el desarrollo, se puede iniciar Vite con `npm run dev -- --host 0.0.0.0`.

## Comandos disponibles

En `frontend/`:

- `npm run dev`: inicia el servidor de desarrollo.
- `npm run build`: genera la versión de producción.
- `npm run lint`: ejecuta ESLint.
- `npm run preview`: previsualiza la compilación.

En `backend/`:

- `npm run dev`: inicia el servidor con Nodemon.
- `npm start`: inicia el servidor con Node.js.

## Fuera del alcance actual

La aplicación cubre el registro y seguimiento operativo de reclamos, pero no implica por sí sola la ejecución del servicio municipal solicitado ni una integración con sistemas externos. Las mejoras propuestas para el futuro deben distinguirse de las funciones ya implementadas.
