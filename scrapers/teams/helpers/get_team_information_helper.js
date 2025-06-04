const { getText } = require("../../../utils/scrape_utils");
const { processMatchCard } = require("../../../utils/match_card_processor");

function getMainHeaderData(mainHeader) {
    let teamDetails = {};

    // Team image
    teamDetails.TeamImage = mainHeader.querySelector("img").attributes.src;

    // Team name and tag
    const teamDetailsSection = mainHeader.querySelector("div.team-header-desc")
    teamDetails.TeamName = getText(teamDetailsSection.querySelector("h1.wf-title"));
    teamDetails.TeamTag = getText(teamDetailsSection.querySelector("h2.wf-title.team-header-tag"));

    // Team status (for inactive teams)
    const statusSection = teamDetailsSection.querySelector("span.team-header-status")
    if (statusSection)
        teamDetails.Status = getText(statusSection)

    // Team socials links
    const socials = teamDetailsSection.querySelectorAll("a");
    let teamSocials = {};
    socials.forEach(item => {
        const socialName = getText(item);
        const socialLink = item.attributes.href;
        if (socialName != "") {
            teamSocials[socialName] = socialLink;
        }
    });
    teamDetails.Socials = teamSocials;

    // Team region
    teamDetails.Region = getText(teamDetailsSection.querySelector("i.flag").nextSibling);

    return teamDetails
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

function getTeamRoster(people) {
    let roster = {}
    people.forEach(person => {
        let details = {}
        details.PlayerID = person.querySelector("a").attributes.href.split("/")[2]
        details.PlayerImage = person.querySelector("img").attributes.src
        details.PlayerName = getText(person.querySelector("div.team-roster-item-name-alias"))
        details.PlayerRealName = getText(person.querySelector("div.team-roster-item-name-real"))
        
        if (person.querySelector("i.fa.fa-star"))
            details.Note = "IGL"

        const notes = person.querySelectorAll("div.team-roster-item-name-role");
        if (notes.length > 0) {
            let playerNotes = {}
            notes.forEach((role, k) => {
                playerNotes[k] = getText(role)
            });
            details.Note = playerNotes
        }
        roster[details.PlayerName] = details
    });

    return roster
}

function processRecentResults(recentResultsSection) {
    const recentMatches = {}
    const matches = recentResultsSection.children
    for (let i = 0; i < matches.length - 1; i++) // Skips the last element since its something different
        recentMatches[i] = processMatchCard(matches[i], true);
    
    return recentMatches;
}

module.exports = { getMainHeaderData, getTeamMatches, getTeamRoster };