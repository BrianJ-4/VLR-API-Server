const { getText } = require("../../../utils/scrape_utils");
const datePattern = /^[A-Z][a-z]{2}\s\d{1,2},\s\d{4}(\s+to\s+[A-Z][a-z]{2}\s\d{1,2},\s\d{4})?/;

function getEventSectionResults(events) {
    let eventResults = {}
    events.forEach(event => {
        let eventDetails = {}
        eventDetails.Name = getText(event.querySelector("div.search-item-title"));
        eventDetails.ID = event.getAttribute("href").split("/")[4];
        eventDetails.Image = event.querySelector("img").getAttribute("src");
        eventDetails.Dates = getText(event.querySelector("div.search-item-desc")).split(/[\t]/)[0].trim();
        eventResults[eventDetails.Name] = eventDetails;
    });
    return eventResults;
}

function getTeamSectionResults(teams) {
    let teamResults = {}
    teams.forEach(team => {
        let teamDetails = {}
        teamDetails.Name = getText(team.querySelector("div.search-item-title")).split(/[\t]/)[0].trim();
        teamDetails.Inactive = team.querySelector("span") !== null;
        teamDetails.ID = team.getAttribute("href").split("/")[4];
        teamDetails.Image = team.querySelector("img").getAttribute("src");
        teamResults[teamDetails.Name] = teamDetails;
    });
    return teamResults
}

function getSectionResults(results) {
    let sectionResults = {}
    results.forEach(result => {
        let resultDetails = {}
        resultDetails.Name = getText(result.querySelector("div.search-item-title"));
        resultDetails.ID = result.getAttribute("href").split("/")[4];
        resultDetails.Image = result.querySelector("img").getAttribute("src");
        sectionResults[resultDetails.Name] = resultDetails;
    });
    return sectionResults;
}

module.exports = { getEventSectionResults, getTeamSectionResults, getSectionResults };