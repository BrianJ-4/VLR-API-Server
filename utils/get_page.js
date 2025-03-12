const axios = require("axios");

async function getPage(url) {
    const response = await axios.get(url);
    return response;
}

module.exports = {getPage};