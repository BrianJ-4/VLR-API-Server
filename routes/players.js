const express = require("express");

const { getPlayerInformation } = require("../scrapers/players/players_scraper");

const router = express.Router();

// Get player data by ID
router.get("/:playerID", async (req, res) => {
    const playerID = parseInt(req.params.playerID);
    try {
        const playerInformation = await getPlayerInformation(playerID);
        res.status(200).json(playerInformation);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to get player data" });
    }
});

module.exports = router;