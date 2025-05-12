const { getText } = require("../../../utils/scrape_utils");
const { processMatchCard } = require("../../../utils/match_card_processor");

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

function getPlayerResults(resultsSection) {
    let results = {};
    const matches = resultsSection.children;

    for (let i = 0; i < matches.length - 1; i++) // Skips the last element since its something different
        results[i] = processMatchCard(matches[i], true);

    return results;
}

// Need to rewrite to remove repeated code
function getPlayerTeams(section) {
    let teams = {};

    const labels = section.querySelectorAll("h2.wf-label.mod-large");
    const teamSections = section.querySelectorAll('div[class="wf-card"]');

    if (labels.length == 3) {
        // Current team
        teams.CurrentTeam = processTeamCard(teamSections[0].querySelector("a"));

        // Past teams
        let pastTeams = {};
        const pastTeamCards = teamSections[1].querySelectorAll("a");
        for (let i = 0; i < pastTeamCards.length; i++)
            pastTeams[i] = processTeamCard(pastTeamCards[i]);
        teams.PastTeams = pastTeams;
    }
    else {
        if (getText(labels[1]) == "Current Teams")
            teams.CurrentTeam = processTeamCard(teamSections[0].querySelector("a"));
        else if (getText(labels[1]) == "Past Teams") {
            let pastTeams = {};
            const pastTeamCards = teamSections[0].querySelectorAll("a");
            for (let i = 0; i < pastTeamCards.length; i++)
                pastTeams[i] = processTeamCard(pastTeamCards[i]);
            teams.PastTeams = pastTeams;
        }
    }
    return teams;
}

function processTeamCard(teamCard) {
    let teamInfo = {};
    const teamID = teamCard.attributes.href
    teamInfo.TeamID = teamID.split("/")[2];
    teamInfo.TeamImage = teamCard.querySelector("img").attributes.src;
    teamInfo.TeamName = getText(teamCard.lastElementChild.firstElementChild);
    teamInfo.Note = getText(teamCard.lastElementChild.lastElementChild);
    return teamInfo;
}

module.exports = { getMainHeaderData, getPlayerAgentStats, getPlayerResults, getPlayerTeams };