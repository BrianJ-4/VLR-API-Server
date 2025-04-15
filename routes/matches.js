const express = require("express");
const router = express.Router();

const { getUpcomingAndLiveMatches, getCompletedMatches, getMatchInformation } = require("../scrapers/matches/matches_scraper");
const { checkCache, setCache } = require("../utils/")

// Get list of upcoming and live matches
router.get("/upcomingLive/:page", async (req, res) => {
    const page = parseInt(req.params.page) || 1;
    try {
        const matches = await getUpcomingAndLiveMatches(page);
        res.status(200).json(matches);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to get upcoming and live matches" });
    }
});

// Get list of completed matches
router.get("/completed/:page", async (req, res) => {
    const page = parseInt(req.params.page) || 1;
    try {
        const matches = await getCompletedMatches(page);
        res.status(200).json(matches);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to get completed matches" });
    }
});

// Get match data by ID
router.get("/:matchID", cache(`/matches/${req.params.matchID}`, 600), async (req, res) => {
    const matchID = parseInt(req.params.matchID);
    const cacheData = checkCache(`/matches/${matchID}`);
    if (cacheData) {
        return res.status(200).json(cacheData);
    }
    try {
        const matchInformation = await getMatchInformation(matchID);
        setCache(key, matchInformation, 600);
        res.status(200).json(matchInformation);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to get match data" });
    }
});

// Handle 404 routes
router.use((req, res) => {
    res.status(404).json({ error: "Route not found in /matches" });
});

module.exports = router;