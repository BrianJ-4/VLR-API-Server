const parser = require("node-html-parser");

const { getText } = require("../utils/scrape_utils");

function getMainHeaderData(mainHeader) {
    let matchInfo = {};
    // Match event and date information ************************************************************
    // Collects: Event Name, Match in Event, Date, Time
    const matchInformationSection = mainHeader.querySelector("div.match-header-super");

    // Event details
    const eventSection = matchInformationSection.children[0].querySelector("a.match-header-event");
    matchInfo.EventID = eventSection.attributes.href.split("/")[2];
    matchInfo.EventName = getText(eventSection.querySelector("div > div"));
    matchInfo.SubEvent = getText(eventSection.querySelector("div.match-header-event-series")).replaceAll("\n", "").replaceAll("\t", "");

    // Date details
    const dateSection = matchInformationSection.querySelector("div.match-header-date");
    matchInfo.Date = getText(dateSection.children[0]);
    matchInfo.Time = getText(dateSection.children[1]);

    // Match and teams information *****************************************************************
    // Collects: Team Names, Team Scores, Match Status, Best of, Team Images, Picks and Bans
    const matchAndTeamInformationSection = mainHeader.querySelector("div.match-header-vs");

    // Team Names and Images
    matchInfo.TeamA = getText(matchAndTeamInformationSection.querySelector("div.match-header-link-name.mod-1").querySelector("div"));
    matchInfo.TeamB = getText(matchAndTeamInformationSection.querySelector("div.match-header-link-name.mod-2").querySelector("div"));
    const images = matchAndTeamInformationSection.querySelectorAll("img");
    matchInfo.TeamAImage = images[0].attributes.src.includes("vlr.png") ? "https://www.vlr.gg/img/vlr/tmp/vlr.png" : images[0].attributes.src;
    matchInfo.TeamBImage = images[1].attributes.src.includes("vlr.png") ? "https://www.vlr.gg/img/vlr/tmp/vlr.png" : images[1].attributes.src;

    // Match Status and Score (Not Applicable if upcoming match)
    matchInfo.Status = getText(matchAndTeamInformationSection.querySelectorAll("div.match-header-vs-note")[0]);
    if (matchInfo.Status == "live" || matchInfo.Status == "final") {
        const scores = matchAndTeamInformationSection.querySelector("div.js-spoiler").children;
        matchInfo.TeamAScore = Number(getText(scores[0]));
        matchInfo.TeamBScore = Number(getText(scores[2]));

        if (matchInfo.Status == "final")
            matchInfo.Winner = matchInfo.TeamAScore > matchInfo.TeamBScore ? matchInfo.TeamA : matchInfo.TeamB;
    }

    // Best of
    let bestOf = getText(matchAndTeamInformationSection.querySelectorAll("div.match-header-vs-note")[1]);
    matchInfo.BestOf = Number(bestOf.charAt(bestOf.length - 1));

    // Picks and Bans ******************************************************************************
    const picksAndBansSection = mainHeader.querySelector("div.match-header-note");
    if (picksAndBansSection)
        matchInfo.PicksAndBans = getText(picksAndBansSection).split(";").map((element) => element.trim()) // Clean extra spaces

    return matchInfo;
}

module.exports = { getMainHeaderData };