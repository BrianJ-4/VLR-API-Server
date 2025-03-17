const { getPage } = require("../../utils/scrape_utils");
const { getMainHeaderData, getStreamsAndVods, getStats } = require("../matches/helpers/get_match_information_helper");

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
    let matchInformation = {}
    try {
        // Access page and get HTML
        const doc = await getPage(url);

        // Get Information From Helpers
        matchInformation.MatchDetails = getMainHeaderData(doc.querySelector("div.wf-card.match-header"));
        matchInformation.Videos = getStreamsAndVods(doc.querySelector("div.match-streams-bets-container"));
        matchInformation.Stats = getStats(doc.querySelector("div.vm-stats-container"), matchInformation.MatchDetails.Status);
        return matchInformation;
    }
    catch (error) {
        console.log("Error: " + error);
    }
}

module.exports = { getUpcomingAndLiveMatches, getCompletedMatches, getMatchInformation };