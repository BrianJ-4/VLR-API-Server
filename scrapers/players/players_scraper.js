const { getMainHeaderData, getPlayerAgentStats, getPlayerResults, getPlayerTeams } = require("../players/helpers/get_player_information_helper")
const { getCompletedMatches } = require("../../utils/completed_matches_processor");

async function getPlayerInformation(doc) {
    let playerInformation = {};
    try {
        // Get Information From Helpers
        playerInformation.Details = getMainHeaderData(doc.querySelector("div.player-header"));
        playerInformation.AgentStats = getPlayerAgentStats(doc.querySelector("table.wf-table"));
        playerInformation.Results = getPlayerResults(doc.querySelector("div.player-summary-container-1").children[3]);
        playerInformation.Teams = getPlayerTeams(doc.querySelector("div.player-summary-container-1"));

        return playerInformation;
    }
    catch (error) {
        console.log("Error: " + error);
    }
}

async function getPlayerCompletedMatches(doc) {
    try {
        return getCompletedMatches(doc);
    }
    catch (error) {
        console.log("Error: " + error);
    }
}

module.exports = { getPlayerInformation, getPlayerCompletedMatches };