**Resumen**
- **Proyecto**: Chat + Login — aplicación de ejemplo con backend en TypeScript (Node/Express) y frontend en React (Vite + TypeScript).
- **Propósito**: demostrar un flujo básico de registro/login, verificación por código, recuperación de contraseña y chat en tiempo real con persistencia de mensajes.

**Funcionalidades**
- **Registro de usuario**: endpoints para crear usuarios y validación básica de entrada.
- **Verificación por código**: envío de código de verificación por correo (servicio de correo incluido) para confirmar cuentas o restablecer contraseña.
- **Login**: autenticación y protección de rutas mediante middleware (`authMiddleware`).
- **Recuperación de contraseña**: flujo de "olvidé mi contraseña" con envío de código y restablecimiento.
- **Chat en tiempo real**: comunicación en tiempo real usando WebSockets (implementado en `sockets/socket.ts`) con almacenamiento de mensajes en la base de datos (`messageModel`, `messageRepository`).
- **APIs REST**: rutas separadas para autenticación y mensajes (`routes/authRoutes.ts`, `routes/messageRoutes.ts`).

**Tecnologías utilizadas**
- **Backend**: Node.js con TypeScript, Express.
- **Base de datos**: MongoDB (acceso desde `src/config/db.ts` usando un ORM/driver típico de Node).
- **Autenticación**: JWT / middleware (implementación en `middlewares/authMiddleware.ts`).
- **Correo electrónico**: módulo de correo personalizado (`utils/Mailer.ts`, `services/emailService.ts`) para envío de códigos.
- **WebSocket**: Socket-based implementation (archivo `sockets/socket.ts`) para mensajería en tiempo real.
- **Frontend**: React + TypeScript con Vite (carpeta `Front/Chat+Login`).
- **Estructura de proyecto**: separación entre `Api/` (servidor) y `Front/` (cliente).

**Estructura relevante**
- **Backend**: `Api/src` contiene controladores, servicios, modelos y rutas.
- **Frontend**: `Front/Chat+Login/src` contiene componentes de autenticación y chat.
- **Archivos clave**: `Api/src/config/db.ts`, `Api/src/middlewares/authMiddleware.ts`, `Api/src/sockets/socket.ts`, `Front/Chat+Login/src/socket.ts`.

**Instalación y ejecución (desarrollo)**
- **Requisitos previos**: Node.js instalado, instancia de MongoDB accesible, variables de entorno configuradas (URI de BD, credenciales SMTP, `JWT_SECRET`, etc.).

- **Backend**
```bash
cd Api
npm install
npm run dev
```
- **Frontend**
```bash
cd Front/Chat+Login
npm install
npm run dev
```
