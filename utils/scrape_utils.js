const axios = require("axios");

async function getPage(url) {
    const response = await axios.get(url);
    return response;
}

function getText(element) {
    return element.text.trim();
}

module.exports = { getPage, getText };