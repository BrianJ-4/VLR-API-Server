const { getMainHeaderData, getTeamMatches, getTeamRoster, getTeamWinnings } = require("../teams/helpers/get_team_information_helper")

async function getTeamInformation(doc) {
    let teamInformation = {};
    try {
        // Get Information From Helpers
        teamInformation.Details = getMainHeaderData(doc.querySelector("div.team-header"));
        teamInformation.Matches = getTeamMatches(doc.querySelector("div.team-summary-container-1"));
        teamInformation.Roster = getTeamRoster(doc.querySelectorAll("div.team-roster-item"));
        return teamInformation;
    }
    catch (error) {
        console.log("Error: " + error);
    }
}

module.exports = { getTeamInformation };