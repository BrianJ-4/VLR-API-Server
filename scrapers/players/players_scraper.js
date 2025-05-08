const { getPage, getText } = require("../../utils/scrape_utils");
const { getMainHeaderData, getPlayerAgentStats, getPlayerResults, getPlayerTeams } = require("../players/helpers/get_player_information_helper")

async function getPlayerInformation(doc) {
    let playerInformation = {};
    try {
        // Get Information From Helpers
        playerInformation.Details = getMainHeaderData(doc.querySelector("div.player-header"));
        playerInformation.AgentStats = getPlayerAgentStats(doc.querySelector("table.wf-table"));
        playerInformation.Results = getPlayerResults(doc.querySelector("div.player-summary-container-1").children[3]);
        playerInformation.Teams = getPlayerTeams(doc.querySelector("div.player-summary-container-1").querySelectorAll('div[class="wf-card"]'));

        return playerInformation;
    }
    catch (error) {
        console.log("Error: " + error);
    }
}

module.exports = { getPlayerInformation };