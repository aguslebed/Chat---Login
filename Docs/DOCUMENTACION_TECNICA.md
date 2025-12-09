# Documentación Funcional del Frontend - Chat+

Este documento explica el flujo de datos y la gestión de estado en la aplicación, específicamente cómo se maneja la sesión del usuario, la navegación por pestañas y la persistencia de mensajes.

## 1. Gestión del Usuario Actual (`currentUser`)

El manejo del usuario logueado en la aplicación sigue el siguiente flujo:

1.  **Estado Global**: En `App.tsx`, existe un estado `user` que almacena la información del usuario autenticado.
    ```typescript
    const [user, setUser] = useState<any>(null);
    ```

2.  **Autenticación**:
    *   Si `user` es `null`, se muestra `AuthPage` (formularios de Login/Registro).
    *   Cuando el usuario se loguea exitosamente en `LoginForm`, se llama a `onLoginSuccess`.
    *   `App.tsx` recibe los datos del usuario y actualiza el estado `user`.

3.  **Renderizado Condicional**:
    *   Una vez que `user` tiene datos, la aplicación renderiza `ChatPage`, pasando el objeto `currentUser` como prop.
    *   Esto permite que `ChatPage` sepa quién es el usuario activo (p.ej. para mostrar "Welcome, User" o marcar mensajes como propios).

4.  **Logout**:
    *   La función `handleLogout` en `App.tsx` limpia el estado `user` y elimina el token del `localStorage`, devolviendo al usuario a la pantalla de login.

## 2. Sistema de Pestañas (Tabs)

La navegación entre diferentes chats (Global y usuarios privados) se gestiona dentro de `ChatPage.tsx`:

1.  **Chats Abiertos (`openChats`)**:
    *   Es un array de objetos que representa las pestañas visibles en la barra superior.
    *   Siempre se inicializa con el chat global: `[{ id: 'global', name: 'Global Chat' }]`.
    *   Al hacer clic en un usuario de la lista (`UserList`), se verifica si ya está en el array. Si no, se agrega una nueva pestaña.

2.  **Chat Activo (`activeChat`)**:
    *   Almacena el `id` del chat que se está visualizando actualmente.
    *   Al hacer clic en una pestaña o en un usuario, se actualiza este estado, lo que cambia el contenido del área principal.

3.  **Cierre de Pestañas**:
    *   Permite cerrar chats privados eliminándolos del array `openChats`.
    *   Si se cierra la pestaña activa, la aplicación cambia el foco automáticamente a la pestaña anterior (o al Global Chat).

## 3. Persistencia de Mensajes

Para evitar que los mensajes se borren al cambiar de pestaña, se implementó una estrategia de "Levantamiento de Estado" (State Lifting):

*   **Ubicación del Estado**: En lugar de guardar los mensajes dentro del componente hijo `ChatArea`, se guardan en el componente padre `ChatPage`.
    ```typescript
    const [messagesByChat, setMessagesByChat] = useState<Record<string, Message[]>>({ ... });
    ```
    
*   **Estructura de Datos**: Se utiliza un objeto (diccionario) donde:
    *   La **clave** es el ID del chat (ej. `'global'`, `'1'`, `'2'`).
    *   El **valor** es un array de mensajes (`Message[]`).

*   **Flujo de Envío**:
    1.  El usuario escribe en `ChatArea` y envía el mensaje.
    2.  `ChatArea` llama a la función `onSendMessage` (pasada por prop desde `ChatPage`).
    3.  `ChatPage` recibe el texto, crea el objeto del mensaje y actualiza `messagesByChat` usando el `activeChat` actual como clave.
    
*   **Visualización**:
    *   `ChatPage` pasa a `ChatArea` únicamente los mensajes correspondientes al `activeChat`.
    *   Al cambiar de pestaña, `ChatPage` simplemente envía un array diferente de mensajes a `ChatArea`. Como los datos están en el padre, no se pierden al desmontar/montar el componente hijo.

## Resumen del Flujo de Datos

```
App (Tiene currentUser)
 └── ChatPage (Maneja Tabs y Diccionario de todos los Mensajes)
      ├── UserList (Selecciona usuario -> Abre Tab -> Cambia ActiveChat)
      └── ChatArea (Recibe solo los mensajes del ActiveChat y función para enviar)
```
