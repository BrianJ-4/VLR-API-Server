const { getText } = require("../../utils/scrape_utils");
const { getMainHeaderData, getStreamsAndVods, getStats } = require("../matches/helpers/get_match_information_helper");

async function getUpcomingAndLiveMatches(doc) {
    try {
        let upcomingAndLiveMatches = {};
        const dateSections = doc.querySelectorAll("div.wf-card[style]");
        let dates = doc.querySelectorAll("div.wf-label.mod-large");
        dates = dates.map(date => getText(date));
        let i = 0;

        dateSections.forEach(day => {
            let k = 0;
            const matches = day.children;
            let dateMatches = {};

            matches.forEach(match => {
                dateMatches[k] = {
                    ID: match.attributes["href"].match(/\/(\d+)\//)[1],
                    Time: getText(match.querySelector("div.match-item-time")),
                    TeamA: getText(match.querySelectorAll("div.match-item-vs-team-name")[0]),
                    TeamB: getText(match.querySelectorAll("div.match-item-vs-team-name")[1]),
                    Event: getText(match.querySelector("div.match-item-event.text-of").childNodes[2]),
                    SubEvent: getText(match.querySelector("div.match-item-event.text-of").childNodes[1]),
                    Status: getText(match.querySelector("div.ml-status"))
                };
                if (dateMatches[k].Status == "LIVE") {
                    const scores = match.querySelectorAll("div.match-item-vs-team-score")
                    dateMatches[k].TeamAScore = getText(scores[0]);
                    dateMatches[k].TeamBScore = getText(scores[1]);
                }
                // Upcoming match
                else {
                    const timeUntil = getText(match.querySelector("div.ml-eta"));
                    dateMatches[k].TimeUntil = timeUntil;
                }
                k += 1;
            });
            if (dates[i].includes("Today")) {
                dates[i] = dates[i].split("\n")[0].trim();
            }
            upcomingAndLiveMatches[dates[i]] = dateMatches;
            i += 1;
        });
        return upcomingAndLiveMatches;
    } 
    catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: "Failed to fetch site data" });
    }
}

async function getCompletedMatches(doc) {
    try {
        let completedMatches = {};
        const dateSections = doc.querySelectorAll("div.wf-card[style]");
        let dates = doc.querySelectorAll("div.wf-label.mod-large");
        dates = dates.map(date => getText(date));
        let i = 0;

        dateSections.forEach(day => {
            let k = 0;
            const matches = day.children;
            let dateMatches = {};

            matches.forEach(match => {
                const scores = match.querySelectorAll("div.match-item-vs-team-score")
                const completedSince = match.querySelector("div.ml-eta.mod-completed")
                dateMatches[k] = {
                    ID: match.attributes["href"].match(/\/(\d+)\//)[1],
                    Time: getText(match.querySelector("div.match-item-time")),
                    TeamA: getText(match.querySelectorAll("div.match-item-vs-team-name")[0]),
                    TeamB: getText(match.querySelectorAll("div.match-item-vs-team-name")[1]),
                    Event: getText(match.querySelector("div.match-item-event.text-of").childNodes[2]),
                    SubEvent: getText(match.querySelector("div.match-item-event.text-of").childNodes[1]),
                    TeamAScore: getText(scores[0]),
                    TeamBScore: getText(scores[1]),
                    TimeCompleted: getText(completedSince)
                };
                k += 1;
            });
            if (dates[i].includes("Today") || dates[i].includes("Yesterday")) {
                dates[i] = dates[i].substring(0, dates[i].indexOf("\n") - 1);
            }
            completedMatches[dates[i]] = dateMatches;
            i += 1;
        });
        return completedMatches;
    } 
    catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: "Failed to fetch site data" });
    }
}

async function getMatchInformation(doc) {
    let matchInformation = {};
    try {
        // Get Information From Helpers
        matchInformation.MatchDetails = getMainHeaderData(doc.querySelector("div.wf-card.match-header"));
        matchInformation.Videos = getStreamsAndVods(doc.querySelector("div.match-streams-bets-container"));
        matchInformation.Stats = getStats(doc.querySelector("div.vm-stats-container"), matchInformation.MatchDetails.Status, matchInformation.MatchDetails.TeamA, matchInformation.MatchDetails.TeamB);
        return matchInformation;
    }
    catch (error) {
        console.log("Error: " + error);
    }
}

module.exports = { getUpcomingAndLiveMatches, getCompletedMatches, getMatchInformation };