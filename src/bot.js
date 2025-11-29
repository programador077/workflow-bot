const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { ALLOWED_GROUP_ID, ALLOWED_GROUP_NAME, PREFIX, MESSAGES } = require('./config/constants');

// Services
const weatherService = require('./services/weatherService');
const cryptoService = require('./services/cryptoService');
const newsService = require('./services/newsService');
const wikiService = require('./services/wikiService');
const argentinaService = require('./services/argentinaService');
const searchService = require('./services/searchService');
const aiService = require('./services/aiService');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox']
    }
});

client.on('qr', (qr) => {
    console.log('QR Code received');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Bot is ready!');
});

client.on('message', async msg => {
    const chat = await msg.getChat();

    let contactName = 'Che';
    try {
        const contact = await msg.getContact();
        contactName = contact.pushname || contact.name || contact.number;
    } catch (err) {
        contactName = 'Amigo';
    }

    // Security Check
    const isAllowed =
        (ALLOWED_GROUP_ID && msg.from === ALLOWED_GROUP_ID) ||
        chat.name.toLowerCase().includes(ALLOWED_GROUP_NAME) ||
        msg.body === '!id';

    if (!isAllowed) return;

    console.log(`[${chat.name}] ${contactName}: ${msg.body}`);

    const body = msg.body.trim();
    const args = body.split(' ');
    const command = args[0].toLowerCase();
    const query = args.slice(1).join(' ');

    // --- COMMANDS ---

    // 1. Setup ID
    if (command === '!id') {
        await msg.reply(`🆔 ID: \`${chat.id._serialized}\`\nNombre: ${chat.name}`);
        return;
    }

    // 2. Menu / Help
    if (command === '!menu' || command === '!ayuda') {
        await msg.reply(
            `🇦🇷 *ASISTENTE ARGENTINO*\n` +
            `Hola *${contactName}*, hablame normal o usá comandos:\n\n` +
            `🗣 *!chat [mensaje]* - Hablar con IA (o simplemente escribí)\n` +
            `🔍 *!investigar [tema]* - Buscar en Web\n` +
            `🌤 *!clima [ciudad]* - Clima\n` +
            `💸 *!dolar* - Cotizaciones\n` +
            `📰 *!noticias* - Infobae\n` +
            `📅 *!feriado* - Próximo feriado`
        );
        return;
    }

    // 3. Weather (Default Buenos Aires)
    if (command === '!clima') {
        const city = query || 'Buenos Aires';
        try {
            const data = await weatherService.getWeather(city);
            if (!data) {
                await msg.reply('❌ Che, no encuentro esa ciudad.');
                return;
            }
            await msg.reply(
                `🌤 *Clima en ${data.location}*\n` +
                `🌡 Actual: ${data.temp}°C\n` +
                `📈 Máx: ${data.max}°C | 📉 Mín: ${data.min}°C\n` +
                `💨 Viento: ${data.wind} km/h`
            );
        } catch (e) {
            await msg.reply(MESSAGES.ERROR);
        }
        return;
    }

    // 4. Finance (Dolar Blue & Crypto)
    if (command === '!dolar' || command === '!finanzas' || command === '!blue') {
        try {
            const dolares = await cryptoService.getDolarArgentina();
            const cryptos = await cryptoService.getCryptoPrices();

            let text = `💸 *COTIZACIONES ARGENTINA*\n\n`;

            // Dolares
            dolares.forEach(d => {
                if (['Oficial', 'Blue', 'Bolsa', 'Contado con liquidacion'].includes(d.nombre)) {
                    text += `💵 *${d.nombre}*: C$${d.compra} / V$${d.venta}\n`;
                }
            });

            text += `\n*Criptos (USD):*\n`;
            cryptos.forEach(c => {
                const icon = parseFloat(c.change24h) >= 0 ? '📈' : '📉';
                text += `${icon} *${c.symbol}*: $${c.price}\n`;
            });

            await msg.reply(text);
        } catch (e) {
            console.error(e);
            await msg.reply('❌ No pude traer las cotizaciones, che.');
        }
        return;
    }

    // 5. News (Argentina)
    if (command === '!noticias') {
        try {
            const news = await newsService.getTechNews();
            let text = `📰 *ÚLTIMAS NOTICIAS*\n\n`;
            news.forEach((n, i) => {
                text += `${i + 1}. ${n.title}\n🔗 ${n.link}\n\n`;
            });
            await msg.reply(text);
        } catch (e) {
            await msg.reply(MESSAGES.ERROR);
        }
        return;
    }

    // 6. Wikipedia
    if (command === '!wiki') {
        if (!query) {
            await msg.reply('⚠️ Decime qué buscar: `!wiki Messi`');
            return;
        }
        try {
            const data = await wikiService.searchWiki(query);
            if (!data) {
                await msg.reply('❌ No encontré nada sobre eso.');
                return;
            }
            let text = `🧠 *${data.title}*\n\n${data.extract}\n\n🔗 ${data.url}`;
            await msg.reply(text);
        } catch (e) {
            await msg.reply(MESSAGES.ERROR);
        }
        return;
    }

    // 7. Feriados
    if (command === '!feriado' || command === '!feriados') {
        try {
            const feriado = await argentinaService.getNextHoliday();
            if (feriado) {
                await msg.reply(
                    `📅 *Próximo Feriado*\n` +
                    `🎉 *${feriado.localName}*\n` +
                    `🗓 Fecha: ${feriado.date}`
                );
            } else {
                await msg.reply('No encontré feriados cercanos.');
            }
        } catch (e) {
            await msg.reply(MESSAGES.ERROR);
        }
        return;
    }

    // 8. Web Search (AI Context)
    if (command === '!investigar' || command === '!buscar') {
        if (!query) {
            await msg.reply('⚠️ Decime qué querés investigar.');
            return;
        }
        try {
            await msg.reply('🔍 Buscando...');
            const results = await searchService.searchWeb(query);

            if (!results) {
                await msg.reply('❌ No encontré nada.');
                return;
            }

            let text = `🌐 *RESULTADOS*\n\n`;
            results.forEach((r, i) => {
                text += `*${i + 1}. ${r.title}*\n${r.description}\n🔗 ${r.url}\n\n`;
            });

            await msg.reply(text);
        } catch (e) {
            await msg.reply(MESSAGES.ERROR);
        }
        return;
    }

    // 9. AI Chat
    if (command === '!chat') {
        if (!query) {
            await msg.reply('⚠️ Decime qué querés charlar: `!chat Hola, cómo estás?`');
            return;
        }
        try {
            const chatObj = await msg.getChat();
            chatObj.sendStateTyping();

            const response = await aiService.getAIResponse(query);
            await msg.reply(response);

            chatObj.clearState();
        } catch (e) {
            console.error(e);
            await msg.reply(MESSAGES.ERROR);
        }
        return;
    }

    // 10. AI Chat (Fallback)
    // Si no es un comando conocido, asumimos que quiere charlar
    if (!body.startsWith('!')) {
        try {
            // Simulamos "escribiendo..."
            const chatObj = await msg.getChat();
            chatObj.sendStateTyping();

            const response = await aiService.getAIResponse(body);
            await msg.reply(response);

            chatObj.clearState();
        } catch (e) {
            console.error(e);
            // Optionally, reply with an error message if AI fails for fallback
            // await msg.reply(MESSAGES.ERROR);
        }
    }

});

module.exports = client;
