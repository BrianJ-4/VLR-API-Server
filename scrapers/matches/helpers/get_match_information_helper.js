const parser = require("node-html-parser");

const { getText } = require("../../../utils/scrape_utils");

function getMainHeaderData(mainHeader) {
    let matchInfo = {};
    // Match event and date information ************************************************************
    // Collects: Event Name, Match in Event, Date, Time
    const matchInformationSection = mainHeader.querySelector("div.match-header-super");

    // Event details
    const eventSection = matchInformationSection.children[0].querySelector("a.match-header-event");
    matchInfo.EventID = eventSection.attributes.href.split("/")[2];
    matchInfo.EventName = getText(eventSection.querySelector("div > div"));
    matchInfo.SubEvent = getText(eventSection.querySelector("div.match-header-event-series")).replace(/\s+/g, " ").trim();

    // Date details
    const dateSection = matchInformationSection.querySelector("div.match-header-date");
    matchInfo.Date = getText(dateSection.children[0]);
    matchInfo.Time = dateSection.children[1].attributes["data-utc-ts"].replace(" ", "T") + "Z";

    // Match and teams information *****************************************************************
    // Collects: Team Names, Team Scores, Match Status, Best of, Team Images
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
    // Collects Picks and Bans
    const picksAndBansSection = mainHeader.querySelector("div.match-header-note");
    if (picksAndBansSection)
        matchInfo.PicksAndBans = getText(picksAndBansSection).split(";").map((element) => element.trim()) // Clean extra spaces

    return matchInfo;
}

function getStreamsAndVods(videosSection) {
    let videos = {};
    // Streams ************************************************************
    const streamsContainer = videosSection.querySelector("div.match-streams-container");
    const streams = {};
    streamsContainer.children.forEach(stream => {
        const streamName = getText(stream);
        if (!streamName.includes("More Streams")) {
            const elementTag = stream.tagName;
            streams[streamName] = elementTag == "DIV" ? stream.querySelector("a").attributes.href : stream.attributes.href;
        }
    });

    // Vods ************************************************************
    const vodsContainer = videosSection.querySelectorAll("div.match-streams-container")[1];
    const vods = {};
    vodsContainer.children.forEach(vod => {
        if (vod.tagName == "A") {
            vods[getText(vod)] = vod.attributes.href;
        }
    });

    // Add only if there are streams/vods
    if (Object.keys(streams).length != 0)
        videos.Streams = streams;
    if (Object.keys(vods).length != 0)
        videos.Vods = vods

    return videos
}

function getStats(statsSection, matchStatus, teamAName, teamBName) {
    let stats = {};
    if (matchStatus == "final" || matchStatus == "live") {
        const matchMapStatsContainers = statsSection.querySelectorAll("div.vm-stats-game");
        stats = getPlayerStatsByMap(matchMapStatsContainers, teamAName, teamBName);
    }

    if (matchStatus == "final") {
        // get economy stats here
        // stats.Economy = getEconomyStats
    }

    return stats;
}

function getPlayerStatsByMap(matchMapStatsContainers, teamAName, teamBName) {
    let matchStats = {};
    let tbdCounter = 0;
    matchMapStatsContainers.forEach(map => {
        let mapName = "";
        let mapDetails = {};
        if (map.attributes["data-game-id"] != "all") {
            mapName = getText(map.querySelector("div.map")).split("\t")[0];
            if (mapName != "TBD") {
                mapDetails.roundsA = getText(map.querySelectorAll("div.score")[0]);
                mapDetails.roundsB = getText(map.querySelectorAll("div.score")[1]);
                // Only get details if map has been started in live match
                if (mapDetails.roundsA != 0 && mapDetails.roundsB != 0) {
                    mapDetails.tRoundsA = getText(map.querySelectorAll("span.mod-t")[0]);
                    mapDetails.tRoundsB = getText(map.querySelectorAll("span.mod-t")[1]);
                    mapDetails.ctRoundsA = getText(map.querySelectorAll("span.mod-ct")[0]);
                    mapDetails.ctRoundsB = getText(map.querySelectorAll("span.mod-ct")[1]);
                }
                else {
                    mapDetails = "None";
                    return;
                }
            }
            else {
                matchStats[`TBD ${String(tbdCounter)}`] = "None";
                tbdCounter += 1;
                return;
            }
        }
        else {
            mapName = "All";
        }
        const playerTables = map.querySelectorAll("tbody");
        mapDetails[teamAName] = getTeamPlayerStats(playerTables[0].querySelectorAll("tr"));
        mapDetails[teamBName] = getTeamPlayerStats(playerTables[1].querySelectorAll("tr"));

        matchStats[mapName] = mapDetails;
    });
    return matchStats;
}

function getTeamPlayerStats(tableRows) {
    let teamStats = {};
    tableRows.forEach(player => {
        const stats = player.querySelectorAll("td");
        const playerName = getText(player.querySelector("div.text-of"));

        let playerStats = {
            Agent: player.querySelector("img").attributes["alt"],
            Rating: getStatValue(stats[2]),
            ACS: getStatValue(stats[3]),
            Kills: getStatValue(stats[4]),
            Deaths: getStatValue(stats[5]),
            Assists: getStatValue(stats[6]),
            KdDiff: getStatValue(stats[7]),
            KAST: getStatValue(stats[8]),
            ADR: getStatValue(stats[9]),
            HeadshotPercent: getStatValue(stats[10]),
            FirstKills: getStatValue(stats[11]),
            FirstDeaths: getStatValue(stats[12]),
            FkDiff: getStatValue(stats[13])
        };

        teamStats[playerName] = playerStats;
    });
    return teamStats;
}

// Helps to remove repetitive code
function getStatValue(stat) {
    return getText(stat.querySelector("span.mod-both"));
}

module.exports = { getMainHeaderData, getStreamsAndVods, getStats };