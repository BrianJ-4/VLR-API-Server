const express = require("express");

const { getTeamInformation, getTeamCompletedMatches } = require("../scrapers/teams/teams_scraper");
const { checkCache, setCache } = require("../utils/cache")
const { fetchAndParse } = require("../utils/scrape_utils")

const router = express.Router();

// Get team data by ID
router.get("/:teamID", async (req, res) => {
    const teamID = parseInt(req.params.teamID);
    const key = `/teams/${teamID}` // Key for cache
    const cacheData = checkCache(key);
    if (cacheData)
        return res.status(200).json(cacheData);
    try {
        const teamInformation = await fetchAndParse(`/team/${teamID}`, getTeamInformation)
        setCache(key, teamInformation, 600) // Cache team information for 10 minutes
        res.status(200).json(teamInformation);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to get team data" });
    }
});

router.get("/:teamID/completed/:page", async (req, res) => {
    const teamID = parseInt(req.params.teamID);
    const page = parseInt(req.params.page);
    try {
        const matches = await fetchAndParse(`/team/matches/${teamID}/?group=completed&page=${page}`, getTeamCompletedMatches)
        res.status(200).json(matches);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to get team data" });
    }

});

module.exports = router;