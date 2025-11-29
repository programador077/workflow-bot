# Proyecto Workflow WhatsApp Bot

Este proyecto es un bot de WhatsApp creado con Node.js y la librería `whatsapp-web.js`.

## Requisitos

- Node.js instalado
- Una cuenta de WhatsApp en tu teléfono

## Instalación

1. Instala las dependencias:
   ```bash
   npm install
   ```

## Uso

1. Ejecuta el bot:
   ```bash
   node index.js
   ```
2. Escanea el código QR que aparecerá en la terminal con tu aplicación de WhatsApp (Dispositivos vinculados -> Vincular dispositivo).

## Estructura

- `index.js`: Archivo principal con la lógica del bot.
- `.wwebjs_auth`: Carpeta donde se guarda la sesión (se crea automáticamente después de escanear el QR).

## Personalización

Edita el archivo `index.js` para agregar tu propia lógica de workflow en el evento `client.on('message', ...)`.
