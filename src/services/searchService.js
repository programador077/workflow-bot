const google = require('googlethis');

async function searchWeb(query) {
    try {
        const options = {
            page: 0,
            safe: false, // Safe Search
            additional_params: {
                hl: 'es-419' // Español Latinoamericano
            }
        };

        const response = await google.search(query, options);

        if (!response.results || response.results.length === 0) {
            return null;
        }

        // Tomamos los 3 mejores resultados
        return response.results.slice(0, 3).map(r => ({
            title: r.title,
            description: r.description,
            url: r.url
        }));
    } catch (error) {
        console.error('Search Error:', error);
        throw error;
    }
}

module.exports = { searchWeb };
