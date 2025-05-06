const express = require("express");

const { getPlayerInformation } = require("../scrapers/players/players_scraper");
const { checkCache, setCache } = require("../utils/cache")

const router = express.Router();

// Get player data by ID
router.get("/:playerID", async (req, res) => {
    const playerID = parseInt(req.params.playerID);
    const key = `/players/${playerID}` // Key for cache
    const cacheData = checkCache(key);
    if (cacheData)
        return res.status(200).json(cacheData);
    try {
        const playerInformation = await getPlayerInformation(playerID);
        setCache(key, playerInformation, 600) // Cache player information for 10 minutes
        res.status(200).json(playerInformation);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to get player data" });
    }
});

module.exports = router;