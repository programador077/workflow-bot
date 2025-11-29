const axios = require('axios');

async function getAIResponse(prompt, context = '') {
    try {
        // Pollinations.ai ofrece acceso gratuito a modelos de texto
        // Usamos encodeURIComponent para asegurar que el texto viaje bien en la URL
        const systemPrompt = "Eres un asistente útil, amable y con acento argentino. Tu nombre es Bot. Responde de forma concisa.";
        const fullPrompt = `${systemPrompt}\n\nUsuario: ${prompt}\nBot:`;

        const url = `https://text.pollinations.ai/${encodeURIComponent(fullPrompt)}`;

        const response = await axios.get(url);

        return response.data;
    } catch (error) {
        console.error('AI Service Error:', error);
        return 'Che, se me complicó pensar una respuesta. Probá de nuevo.';
    }
}

module.exports = { getAIResponse };
