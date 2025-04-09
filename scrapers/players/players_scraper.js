const { getPage, getText } = require("../../utils/scrape_utils");
const { getMainHeaderData } = require("../players/helpers/get_player_information_helper")

async function getPlayerInformation(playerID) {
    const url = `https://vlr.gg/player/${playerID}`;
    let playerInformation = {};
    try {
        // Access page and get HTML
        const doc = await getPage(url);

        // Get Information From Helpers
        playerInformation.PlayerDetails = getMainHeaderData(doc.querySelector("div.player-header"));

        return playerInformation;
    }
    catch (error) {
        console.log("Error: " + error);
    }
}

module.exports = { getPlayerInformation };