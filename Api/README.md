# Chat + Login API

API backend para sistema de chat con autenticación, chat público y chat privado.

## Características

- 🔐 Sistema de autenticación con JWT
- 💬 Chat público para todos los usuarios registrados
- 📱 Chat privado entre usuarios
- 🔄 Comunicación en tiempo real con Socket.IO
- 🛡️ Validación de datos con express-validator

## Requisitos Previos

- Node.js (v16 o superior)
- npm o yarn
- Base de datos (PostgreSQL, MySQL, o MongoDB según tu elección)

## Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno:
```bash
cp .env.example .env
```
Edita el archivo `.env` con tus configuraciones.

3. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

4. Iniciar el servidor de producción:
```bash
npm start
```

## Estructura del Proyecto

```
Api/
├── src/
│   ├── config/          # Configuraciones (DB, JWT, etc.)
│   ├── controllers/     # Controladores de rutas
│   ├── middlewares/     # Middlewares (auth, validación, etc.)
│   ├── models/          # Modelos de datos
│   ├── routes/          # Definición de rutas
│   ├── services/        # Lógica de negocio
│   ├── sockets/         # Manejadores de Socket.IO
│   ├── utils/           # Utilidades y helpers
│   └── index.js         # Punto de entrada
├── .env.example         # Ejemplo de variables de entorno
├── .gitignore
├── package.json
└── README.md
```

## Scripts Disponibles

- `npm start` - Inicia el servidor en modo producción
- `npm run dev` - Inicia el servidor en modo desarrollo con nodemon
- `npm test` - Ejecuta los tests (por configurar)

## Variables de Entorno

Ver archivo `.env.example` para la lista completa de variables requeridas.

## API Endpoints

### Autenticación
- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/logout` - Cerrar sesión
- `GET /api/auth/me` - Obtener usuario actual

### Chat Público
- `GET /api/chat/public/messages` - Obtener mensajes públicos
- Socket events: `public:message`, `public:join`, `public:leave`

### Chat Privado
- `GET /api/chat/private/:userId` - Obtener mensajes privados con un usuario
- Socket events: `private:message`, `private:typing`, `private:read`

### Usuarios
- `GET /api/users` - Listar usuarios registrados
- `GET /api/users/:id` - Obtener usuario por ID

## Licencia

ISC
