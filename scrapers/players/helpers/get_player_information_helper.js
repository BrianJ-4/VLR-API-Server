const parser = require("node-html-parser");

const { getText } = require("../../../utils/scrape_utils");

function getMainHeaderData(mainHeader) {
    let playerDetails = {};
    
    // Player image
    playerDetails.PlayerImage = mainHeader.querySelector("img").attributes.src;
    
    // Player name and real name
    const playerDetailsSection = mainHeader.children[1];
    playerDetails.PlayerName = getText(playerDetailsSection.querySelector("h1.wf-title"));
    playerDetails.PlayerRealName = getText(playerDetailsSection.querySelector("h2.player-real-name"));
    
    // Player socials links
    const socials = playerDetailsSection.querySelectorAll("a");
    let playerSocials = {};
    socials.forEach(item => {
        const socialName = getText(item);
        const socialLink = item.attributes.href;
        if (socialName != "") {
            playerSocials[socialName] = socialLink;
        }
    });
    playerDetails.Socials = playerSocials;

    // Player nationality
    playerDetails.Nationality = getText(playerDetailsSection.querySelector("i.flag").nextSibling);
    
    return playerDetails;
}

function getPlayerAgentStats(statsTable) {
    const agentRows = statsTable.querySelector("tbody").querySelectorAll("tr");
    let agentStats = {};

    agentRows.forEach(agent => {
        let agentInfo = {};
        const values = agent.querySelectorAll("td");

        let agentName = values[0].querySelector("img").attributes.alt;
        agentName = agentName.charAt(0).toUpperCase() + agentName.slice(1); // Capitalize first letter
        agentInfo.Pick = getText(values[1]).split(" ")[1];

        const keys = [
            "Rounds", "Rating", "ACS", "KD", "ADR", "KAST", "KPR", "APR", 
            "FKPR", "FDPR", "Kills", "Deaths", "Assists", "FKs", "FDs"
        ];
        keys.forEach((key, i) => {
            agentInfo[key] = getText(values[i + 2]);
        });
        agentStats[agentName] = agentInfo;
    });
    return agentStats;
}

module.exports = { getMainHeaderData, getPlayerAgentStats };