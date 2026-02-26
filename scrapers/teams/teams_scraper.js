const { getMainHeaderData, getTeamMatches, getTeamRoster } = require("../teams/helpers/get_team_information_helper")
const { getCompletedMatches } = require("../../utils/completed_matches_processor");

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

async function getTeamCompletedMatches(doc) {
    try {
        return getCompletedMatches(doc);
    }
    catch (error) {
        console.log("Error: " + error);
    }
}

module.exports = { getTeamInformation, getTeamCompletedMatches };