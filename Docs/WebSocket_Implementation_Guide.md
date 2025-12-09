# Guía de Implementación de WebSockets para Chat Global

Esta guía detalla paso a paso cómo integrar `Socket.IO` en tu aplicación para habilitar un chat en tiempo real donde todos los usuarios puedan interactuar.

## 1. Backend (API)

Necesitamos transformar tu servidor Express actual en un servidor HTTP que soporte WebSockets.

### Paso 1.1: Instalar Dependencias
En la terminal, dentro de la carpeta `Api`:
```bash
npm install socket.io
npm install @types/socket.io --save-dev
```
*(Nota: `@types/socket.io` puede no ser necesario si usas la versión más reciente que ya incluye tipos, pero es bueno tenerlo en cuenta).*

### Paso 1.2: Modificar el Punto de Entrada (`src/index.ts`)
Actualmente usas `app.listen()`. Debemos cambiar esto para usar `http.createServer`.

**Cambios necesarios:**
1. Importar `createServer` de `http`.
2. Importar `Server` de `socket.io`.
3. Crear el `httpServer` usando tu `app` de Express.
4. Inicializar `Socket.IO` con configuraciones de CORS (para permitir la conexión desde tu Frontend).
5. Cambiar `app.listen` por `httpServer.listen`.

**Ejemplo de código:**
```typescript
import { createServer } from "http";
import { Server } from "socket.io";
// ... otros imports ...

const app = express();
const httpServer = createServer(app); // 1. Crear servidor HTTP

// 2. Configurar Socket.io
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173", // URL de tu frontend Vite
        methods: ["GET", "POST"],
        credentials: true
    }
});

// 3. Lógica de conexión
io.on("connection", (socket) => {
    console.log(`Usuario conectado: ${socket.id}`);

    // Escuchar mensajes del cliente
    socket.on("client:message", (data) => {
        // Reenviar a TODOS los clientes conectados
        io.emit("server:message", data);
    });

    socket.on("disconnect", () => {
        console.log("Usuario desconectado");
    });
});

// ... middlewares y rutas ...

// 4. Iniciar servidor
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```

---

## 2. Frontend (React)

El frontend necesita un cliente para conectarse a este servidor WebSocket.

### Paso 2.1: Instalar Cliente
En la terminal, dentro de la carpeta `Front/Chat+Login`:
```bash
npm install socket.io-client
```

### Paso 2.2: Crear el Hook o Servicio de Socket
Es buena práctica no meter toda la lógica dentro del componente visual. Puedes crear una instancia del socket.

Puedes configurar la conexión en el archivo `src/request.ts` o crear un nuevo archivo `src/socket.ts`.

**Ejemplo básico en el componente de Chat:**
```tsx
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

// Conexión fuera del componente para evitar reconexiones en cada render
const socket = io("http://localhost:4000", {
    withCredentials: true
});

export default function ChatArea() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    useEffect(() => {
        // Escuchar eventos del servidor
        socket.on("server:message", (newMessage) => {
            setMessages((prev) => [...prev, newMessage]);
        });

        // Limpieza: dejar de escuchar al desmontar
        return () => {
            socket.off("server:message");
        };
    }, []);

    const sendMessage = () => {
        if (input.trim()) {
            socket.emit("client:message", {
                text: input,
                // Puedes agregar usuario, hora, etc.
            });
            setInput("");
        }
    };

    return (
        // ... JSX de tu chat ...
    );
}
```

## 3. Flujo de Datos Resumido

1.  **Emisión**: El usuario escribe un mensaje y el frontend ejecuta `socket.emit("client:message", data)`.
2.  **Recepción en Servidor**: El backend recibe el evento `client:message`.
3.  **Broadcast**: El backend ejecuta `io.emit("server:message", data)` para enviar ese mensaje a **todos** los sockets conectados.
4.  **Actualización**: Cada frontend recibe `server:message` y actualiza su estado (array de mensajes) para mostrar el nuevo mensaje en pantalla.

---

## Siguientes Pasos Recomendados

1.  **Refactorizar**: Crear una carpeta `sockets` en el backend para separar la lógica del `index.ts`.
2.  **Autenticación**: Validar que el usuario que se conecta al socket esté autenticado (usando el token JWT).
3.  **Salas (Rooms)**: Si en el futuro quieres chats privados, usarás `socket.join("sala_privada")` y `io.to("sala_privada").emit(...)`.
