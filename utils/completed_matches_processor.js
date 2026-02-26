const { processMatchCard } = require("./match_card_processor");

function getCompletedMatches(doc) {
    let completedMatches = {};
    const matches = doc.querySelector("div.mod-dark").children;
    for (let i = 0; i < matches.length; i++)
        completedMatches[i] = processMatchCard(matches[i], true);
    return completedMatches
}

module.exports = { getCompletedMatches };