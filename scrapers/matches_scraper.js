const parser = require("node-html-parser");

const { getPage, getText } = require("../utils/scrape_utils");
const { getMainHeaderData } = require("../utils/matches_utils");

async function getUpcomingAndLiveMatches() {
    const toReturn = {
        function: "getUpcomingAndLiveMatches"
    };
    return toReturn;
}

async function getCompletedMatches() {
    return {
        function: "getCompletedMatches"
    };
}

async function getMatchStats(matchID) {
    const url = `https://vlr.gg/${matchID}`;
    try {
        // Access page and get HTML
        const response = await getPage(url);
        const doc = parser.parse(response.data);
        mainHeaderData = getMainHeaderData(doc.querySelector("div.wf-card.match-header"));
        return mainHeaderData;
    }
    catch (error) {
        console.log("Error: " + error);
    }
}

module.exports = { getUpcomingAndLiveMatches, getCompletedMatches, getMatchStats };