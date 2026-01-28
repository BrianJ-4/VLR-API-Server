const { getText } = require("../utils/scrape_utils");

function processMatchCard(match, completed) {
    let matchDetails = {};
    const matchID = match.querySelector("a").attributes.href;

    matchDetails.MatchID = matchID.slice(matchID.indexOf('/') + 1, matchID.indexOf('/', 1));

    // Event details
    matchDetails.EventImage = match.querySelector("div.fc-flex.m-item-thumb").querySelector("img").attributes.src;
    eventNameContainer = match.querySelector("div.m-item-event").firstElementChild
    matchDetails.EventName = getText(eventNameContainer);
    eventNameContainer.remove();
    matchDetails.SubEvent = getText(match.querySelector("div.m-item-event")).replace(/\s+/g, ' ');
    
    // Team info
    const teamNameSpans = match.querySelectorAll("span.m-item-team-name");
    matchDetails.TeamAName = getText(teamNameSpans[0]);
    matchDetails.TeamAImage = match.querySelector("div.m-item-logo img").getAttribute("src");
    matchDetails.TeamBName = teamNameSpans[1] ? getText(teamNameSpans[1]) : "TBD";
    matchDetails.TeamBImage = match.querySelector("div.m-item-logo.mod-right img").getAttribute("src");

    // Score
    const resultContainer = match.querySelector("div.m-item-result");
    if (completed) {
        matchDetails.TeamAScore = getText(resultContainer.querySelectorAll("span")[0]);
        matchDetails.TeamBScore = getText(resultContainer.querySelectorAll("span")[1]);
        if (resultContainer.classList.contains("mod-win"))
            matchDetails.TeamAWin = true;
        else
            matchDetails.TeamAWin = false;
        matchDetails.Status = "Completed";
    }
    else {
        matchDetails.Status = "Upcoming";
    }
    
    // Date and time
    const dateTimeContainer = match.querySelector("div.m-item-date");
    const dateContainer = dateTimeContainer.querySelector("div");
    matchDetails.Date = getText(dateContainer);
    dateContainer.remove();
    matchDetails.Time = getText(dateTimeContainer).replace(/\s+/g, ' ');

    return matchDetails;
}

module.exports = { processMatchCard };