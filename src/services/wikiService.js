const axios = require('axios');

async function searchWiki(query) {
    try {
        const url = `https://es.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`;
        const res = await axios.get(url);

        if (res.data.type === 'standard') {
            return {
                title: res.data.title,
                extract: res.data.extract,
                url: res.data.content_urls.desktop.page,
                thumbnail: res.data.thumbnail ? res.data.thumbnail.source : null
            };
        }
        return null;
    } catch (error) {
        // 404 means not found
        return null;
    }
}

module.exports = { searchWiki };
