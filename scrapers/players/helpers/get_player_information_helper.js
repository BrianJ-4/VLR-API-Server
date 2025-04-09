const parser = require("node-html-parser");

const { getText } = require("../../../utils/scrape_utils");

function getMainHeaderData(mainHeader) {
    let playerDetails = {};
    
    // Player image
    playerDetails.PlayerImage = mainHeader.querySelector("img").attributes.src;
    
    // Player name and real name
    const playerDetailsSection = mainHeader.children[1];
    playerDetails.PlayerName = getText(playerDetailsSection.querySelector("h1.wf-title"));
    playerDetails.PlayerRealName = getText(playerDetailsSection.querySelector("h2.player-real-name"));
    
    // Player socials links
    const socials = playerDetailsSection.querySelectorAll("a");
    let playerSocials = {};
    socials.forEach(item => {
        const socialName = getText(item);
        const socialLink = item.attributes.href;
        if (socialName != "") {
            playerSocials[socialName] = socialLink;
        }
    });
    playerDetails.Socials = playerSocials;

    // Player nationality
    playerDetails.Nationality = getText(playerDetailsSection.querySelector("i.flag").nextSibling);
    
    return playerDetails
}

module.exports = { getMainHeaderData };