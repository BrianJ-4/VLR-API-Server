const { getMainHeaderData, getTeamMatches, getTeamRoster, getTeamWinnings } = require("../teams/helpers/get_team_information_helper")

async function getTeamInformation(doc) {
    let teamInformation = {};
    try {
        // Get Information From Helpers
        teamInformation.Details = getMainHeaderData();

        return teamInformation;
    }
    catch (error) {
        console.log("Error: " + error);
    }
}

module.exports = { getTeamInformation };