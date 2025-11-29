const axios = require('axios');

async function getNextHoliday() {
    try {
        const year = new Date().getFullYear();
        const url = `https://date.nager.at/api/v3/PublicHolidays/${year}/AR`;
        const res = await axios.get(url);

        const today = new Date();
        const futureHolidays = res.data.filter(h => new Date(h.date) >= today);

        if (futureHolidays.length > 0) {
            return futureHolidays[0]; // Próximo feriado
        }
        return null;
    } catch (error) {
        console.error('Holiday Error:', error);
        return null;
    }
}

module.exports = { getNextHoliday };
