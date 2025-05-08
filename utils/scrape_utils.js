const axios = require("axios");
const parser = require("node-html-parser");

async function fetchAndParse(path, func) {
    const url = `https://vlr.gg${path}`;
    const doc = await getPage(url);
    return await func(doc); 
}

async function getPage(url) {
    const response = await axios.get(url);
    const doc = parser.parse(response.data);
    return doc;
}

function getText(element) {
    return element.text.trim();
}

module.exports = { fetchAndParse, getPage, getText };