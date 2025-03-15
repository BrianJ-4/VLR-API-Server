const { getPage, getText } = require("../utils/scrape_utils");
const { getMainHeaderData, getStreamsAndVods } = require("../utils/matches_utils");

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

async function getMatchInformation(matchID) {
    const url = `https://vlr.gg/${matchID}`;
    matchStats = {}
    try {
        // Access page and get HTML
        const doc = await getPage(url);

        // Get Information From Helpers
        matchStats.MatchDetails = getMainHeaderData(doc.querySelector("div.wf-card.match-header"));
        matchStats.Videos = getStreamsAndVods(doc.querySelector("div.match-streams-bets-container"));
        
        return matchStats;
    }
    catch (error) {
        console.log("Error: " + error);
    }
}

module.exports = { getUpcomingAndLiveMatches, getCompletedMatches, getMatchInformation };