const express = require("express");

const { getPlayerInformation, getPlayerCompletedMatches } = require("../scrapers/players/players_scraper");
const { checkCache, setCache } = require("../utils/cache")
const { fetchAndParse } = require("../utils/scrape_utils")

const router = express.Router();

// Get player data by ID
router.get("/:playerID", async (req, res) => {
    const playerID = parseInt(req.params.playerID);
    const timespan = req.query.timespan || "all";

    const allowedTimespans = ["30", "60", "90", "all"];
    if (!allowedTimespans.includes(timespan.toString())) {
        return res.status(400).json({ 
            error: "Invalid timespan. Please use 30, 60, 90, or all." 
        });
    }
    const suffix = timespan === "all" ? "all" : `${timespan}d`;
    
    const key = `/players/${playerID}?timespan=${timespan}` // Key for cache
    const cacheData = checkCache(key);
    if (cacheData)
        return res.status(200).json(cacheData);
    try {
        const playerInformation = await fetchAndParse(`/player/${playerID}/?timespan=${suffix}`, getPlayerInformation)
        setCache(key, playerInformation, 600) // Cache player information for 10 minutes
        res.status(200).json(playerInformation);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to get player data" });
    }
});

// Get player completed matches
router.get("/:playerID/completed/:page", async (req, res) => {
    const playerID = parseInt(req.params.playerID);
    const page = parseInt(req.params.page);
    try {
        const matches = await fetchAndParse(`/player/matches/${playerID}/?page=${page}`, getPlayerCompletedMatches)
        res.status(200).json(matches);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to get player data" });
    }
});

module.exports = router;