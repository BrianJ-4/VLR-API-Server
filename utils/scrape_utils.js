const axios = require("axios");
const parser = require("node-html-parser");

async function getPage(url) {
    const response = await axios.get(url);
    const doc = parser.parse(response.data);
    return doc;
}

function getText(element) {
    return element.text.trim();
}

module.exports = { getPage, getText };