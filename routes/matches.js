const express = require("express");

const { getUpcomingAndLiveMatches, getCompletedMatches, getMatchStats } = require("../scrapers/matches_scraper");

const router = express.Router();

// Get list of upcoming and live matches
router.get("/upcomingLive", async (req, res) => {
    try {
        const matches = await getUpcomingAndLiveMatches();
        res.status(200).json(matches);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to get upcoming and live matches" });
    }
});

// Get list of completed matches
router.get("/completed", async (req, res) => {
    try {
        const matches = await getCompletedMatches();
        res.status(200).json(matches);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to get completed matches" });
    }
});

// Get match data by ID
router.get("/:matchID", async (req, res) => {
    const matchID = parseInt(req.params.matchID);
    try {
        const matchData = await getMatchStats(matchID);
        res.status(200).json(matchData);
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