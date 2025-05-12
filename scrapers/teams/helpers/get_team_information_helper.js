const { getText } = require("../../../utils/scrape_utils");
const { processMatchCard } = require("../../../utils/match_card_processor");

function getMainHeaderData(mainHeader) {

}

function getTeamMatches(matchesSection) {
    let matches = {};
    const upcomingMatchesLabel = getText(matchesSection.querySelectorAll("h2.wf-label.mod-large")[0]).toLowerCase();
    if (upcomingMatchesLabel == "upcoming matches") {
        let current = matchesSection.children[0].nextElementSibling;
        const upcomingMatchesArray = [];

        while (Object.keys(current.attributes).length == 0) {
            upcomingMatchesArray.push(current);
            current = current.nextElementSibling;
        }

        const upcomingMatches = {};
        for (let i = 0; i < upcomingMatchesArray.length; i++)
            upcomingMatches[i] = processMatchCard(upcomingMatchesArray[i], false);

        matches.UpcomingMatches = upcomingMatches;

        matches.RecentMatches = processRecentResults(matchesSection.querySelectorAll("h2.wf-label.mod-large")[1].nextElementSibling);
    }
    else
        matches.RecentMatches = processRecentResults(matchesSection.querySelectorAll("h2.wf-label.mod-large")[0].nextElementSibling);

    return matches;
}

function getTeamRoster() {

}

function getTeamWinnings() {

}

function processRecentResults(recentResultsSection) {
    const recentMatches = {}
    const matches = recentResultsSection.children
    for (let i = 0; i < matches.length - 1; i++) // Skips the last element since its something different
        recentMatches[i] = processMatchCard(matches[i], true);
    
    return recentMatches;
}

module.exports = { getMainHeaderData, getTeamMatches, getTeamRoster, getTeamWinnings };