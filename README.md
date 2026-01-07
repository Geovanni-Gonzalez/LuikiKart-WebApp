# Luiki Kart - Proyecto Programado #4

## Introducción

Luiki Kart es un juego de carreras multijugador en tiempo real desarrollado como una aplicación web moderna. Utiliza una arquitectura cliente-servidor para permitir que múltiples jugadores compitan simultáneamente en pistas personalizadas.

## Tecnologías Usadas

- **Backend (Servidor)**: Node.js, Express, Socket.io, TypeScript.
- **Frontend (Cliente)**: React, Vite, TailwindCSS, TypeScript.
- **Comunicación**: WebSockets (Socket.io) para baja latencia.

## Estructura del Proyecto

- `server/`: Contiene la lógica del juego, gestión de salas y API.
  - `src/models/`: Clases del dominio (Game, Player, Map, Lobby).
  - `maps/`: Archivos de definición de pistas (JSON).
- `client/`: Contiene la interfaz de usuario.
  - `src/components/`: Componentes React (Lobby, GameRoom, Grid).

## Manual de Usuario

### Requisitos Previos

- Node.js (v18 o superior)
- Navegador Web Moderno (Chrome, Firefox, Edge)

### Instrucciones de Ejecución

1. **Iniciar el Servidor**:

   ```bash
   cd server
   npm install
   npm run start
   ```

   El servidor iniciará en el puerto 3001.

2. **Iniciar el Cliente**:

   ```bash
   cd client
   npm install
   npm run dev
   ```

   Acceda a `http://localhost:5173` en su navegador.

### Cómo Jugar

1. **Ingreso**: Ingrese un "Nickname" (apodo) en la pantalla de inicio y presione "START ENGINE".
2. **Lobby**:
   - Para crear una partida: Haga clic en "Create New Game", seleccione la pista y vueltas, y pulse "Create".
   - Para unirse: Busque una partida con estado "WAITING" en la lista y haga clic en "Join Race".
3. **Sala de Espera**:
   - Una vez en la sala, espere a otros jugadores.
   - Presione la tecla **'U'** para marcarse como "LISTO" (READY).
   - Cuando todos los jugadores estén listos, iniciará un conteo regresivo.
4. **Carrera**:
   - Use las **Flechas del Teclado** para mover su vehículo.
   - Complete las vueltas indicadas antes que sus oponentes.
   - ¡Evite las paredes!

## Análisis de Resultados

Se logró implementar exitosamente la arquitectura de juego en tiempo real, sincronizando el estado de múltiples clientes a través de WebSockets. La separación de responsabilidades entre Cliente y Servidor permite un código ordenado y mantenible.

## Notas Adicionales

- Para probar el modo multijugador localmente, abra `http://localhost:5173` en múltiples pestañas o ventanas del navegador incógnito.
