const parser = require("node-html-parser");

const { getPage, getText } = require("../utils/scrape_utils");

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
    return {
        function: "getMatchStats",
        id: matchID
    };
}

module.exports = {getUpcomingAndLiveMatches, getCompletedMatches, getMatchStats};