# 🤖 WhatsApp Bot con IA & Servicios Argentinos 🇦🇷

Este es un bot de WhatsApp avanzado y modular, diseñado para asistir con información en tiempo real, inteligencia artificial y servicios específicos para Argentina.

## ✨ Características Principales

- **🧠 Inteligencia Artificial (Gratis)**: Charla natural con el bot usando modelos generativos (vía Pollinations.ai).
- **🔍 Búsqueda Web en Tiempo Real**: Investiga temas actuales en Google directamente desde WhatsApp.
- **💸 Finanzas Argentina**: Cotizaciones en vivo de Dólar Blue, Oficial, MEP, CCL y Criptomonedas.
- **🌤 Clima Inteligente**: Reporte meteorológico detallado (detecta Buenos Aires por defecto).
- **📰 Noticias**: Últimos titulares de tecnología y actualidad (Infobae/Xataka).
- **📅 Feriados**: Consulta el próximo feriado nacional en Argentina.
- **🛡️ Seguridad**: Restricción de uso por ID de grupo o nombre de comunidad ("Inteligencia Artificial").

## 🛠 Tecnologías Usadas

- **Node.js**: Entorno de ejecución.
- **whatsapp-web.js**: Librería principal para la conexión con WhatsApp.
- **Axios**: Para consumo de APIs externas (DolarApi, Open-Meteo, etc.).
- **GoogleThis**: Para scraping de resultados de búsqueda.
- **RSS-Parser**: Para lectura de feeds de noticias.

## 🚀 Instalación y Ejecución

### 1. Clonar el repositorio
```bash
git clone https://github.com/programador077/workflow-bot.git
cd workflow-bot
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Iniciar el Bot
```bash
node index.js
```

### 4. Vincular WhatsApp
- Al ejecutar el comando, aparecerá un **Código QR** en la terminal.
- Abre WhatsApp en tu celular > **Dispositivos vinculados** > **Vincular dispositivo**.
- Escanea el QR.

¡Listo! El bot guardará la sesión localmente en la carpeta `.wwebjs_auth` para no pedir el QR nuevamente.

## 📖 Guía de Uso

El bot responde automáticamente en grupos que contengan "Inteligencia Artificial" en su nombre.

### Comandos Disponibles:

| Comando | Descripción | Ejemplo |
|---------|-------------|---------|
| `!menu` | Muestra la lista de comandos | `!menu` |
| `!chat` | Habla con la IA (o escribe normal) | `!chat Hola amigo` |
| `!investigar` | Busca información en Google | `!investigar Precio Bitcoin hoy` |
| `!dolar` | Cotizaciones Dólar y Cripto | `!dolar` |
| `!clima` | Clima actual y pronóstico | `!clima Cordoba` |
| `!noticias` | Últimas noticias tech/locales | `!noticias` |
| `!feriado` | Próximo feriado en Argentina | `!feriado` |
| `!wiki` | Resumen de Wikipedia | `!wiki Messi` |
| `!id` | Obtiene el ID del grupo actual | `!id` |

## 📂 Estructura del Proyecto

```
workflow-bot/
├── src/
│   ├── config/         # Constantes y configuraciones
│   ├── services/       # Lógica de negocio separada (IA, Clima, Crypto...)
│   └── bot.js          # Lógica principal del cliente de WhatsApp
├── index.js            # Punto de entrada
└── README.md           # Documentación
```

## ⚠️ Nota sobre Puppeteer
El bot utiliza un navegador Chromium en segundo plano (Puppeteer). Si lo ejecutas en un servidor sin interfaz gráfica (como Linux VPS), asegúrate de instalar las dependencias necesarias para Chromium.
