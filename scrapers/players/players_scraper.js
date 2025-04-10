const { getPage, getText } = require("../../utils/scrape_utils");
const { getMainHeaderData, getPlayerAgentStats } = require("../players/helpers/get_player_information_helper")

async function getPlayerInformation(playerID) {
    const url = `https://vlr.gg/player/${playerID}/?timespan=all`;
    let playerInformation = {};
    try {
        // Access page and get HTML
        const doc = await getPage(url);

        // Get Information From Helpers
        playerInformation.Details = getMainHeaderData(doc.querySelector("div.player-header"));
        playerInformation.AgentStats = getPlayerAgentStats(doc.querySelector("table.wf-table"));

        return playerInformation;
    }
    catch (error) {
        console.log("Error: " + error);
    }
}

module.exports = { getPlayerInformation };