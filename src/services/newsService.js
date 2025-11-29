const Parser = require('rss-parser');
const parser = new Parser();

async function getTechNews() {
    try {
        // Infobae Argentina - Últimas Noticias
        const feed = await parser.parseURL('https://www.infobae.com/feeds/rss/');
        return feed.items.slice(0, 5).map(item => ({
            title: item.title,
            link: item.link,
            pubDate: item.pubDate
        }));
    } catch (error) {
        console.error('News Error:', error);
        throw error;
    }
}

module.exports = { getTechNews };
