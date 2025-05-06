const express = require("express");
const router = express.Router();

const { getUpcomingAndLiveMatches, getCompletedMatches, getMatchInformation } = require("../scrapers/matches/matches_scraper");
const { checkCache, setCache } = require("../utils/cache")
const { hoursSince } = require("../utils/date_time");

// Get list of upcoming and live matches
router.get("/upcomingLive/:page", async (req, res) => {
    const page = parseInt(req.params.page) || 1;
    const key = `/matches/upcomingLive/${page}` // Key for cache
    const cacheData = checkCache(key);
    if (cacheData)
        return res.status(200).json(cacheData);
    try {
        const matches = await getUpcomingAndLiveMatches(page);
        setCache(key, matches, 300) // Cache upcoming and live matches list for 5 minutes
        res.status(200).json(matches);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to get upcoming and live matches" });
    }
});

// Get list of completed matches
router.get("/completed/:page", async (req, res) => {
    const page = parseInt(req.params.page) || 1;
    const key = `/matches/completed/${page}` // Key for cache
    const cacheData = checkCache(key);
    if (cacheData)
        return res.status(200).json(cacheData);
    try {
        const matches = await getCompletedMatches(page);
        setCache(key, matches, 300) // Cache completed matches list for 5 minutes
        res.status(200).json(matches);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to get completed matches" });
    }
});

// Get match data by ID
router.get("/:matchID", async (req, res) => {
    const matchID = parseInt(req.params.matchID);
    const key = `/matches/${matchID}` // Key for cache
    const cacheData = checkCache(key);
    if (cacheData)
        return res.status(200).json(cacheData);
    try {
        const matchInformation = await getMatchInformation(matchID);
        if (matchInformation.MatchDetails.Status == "live")
            setCache(key, matchInformation, 120); // Cache live match for 2 minutes
        else if (hoursSince(matchInformation.MatchDetails.Time) <= 336)
            setCache(key, matchInformation, 1800) // Cache matches completed within two weeks for 30 minutes
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