const axios = require('axios');

async function getCryptoPrices() {
    try {
        const url = 'https://api.coincap.io/v2/assets?ids=bitcoin,ethereum,solana,tether&limit=4';
        const res = await axios.get(url);
        return res.data.data.map(coin => ({
            name: coin.name,
            symbol: coin.symbol,
            price: parseFloat(coin.priceUsd).toFixed(2),
            change24h: parseFloat(coin.changePercent24Hr).toFixed(2)
        }));
    } catch (error) {
        console.error('Crypto Error:', error);
        throw error;
    }
}

async function getDolarArgentina() {
    try {
        // API oficial de la comunidad dev argentina
        const url = 'https://dolarapi.com/v1/dolares';
        const res = await axios.get(url);
        return res.data; // Retorna array con Oficial, Blue, Bolsa, CCL, etc.
    } catch (error) {
        console.error('Dolar Error:', error);
        throw error;
    }
}

module.exports = { getCryptoPrices, getDolarArgentina };
