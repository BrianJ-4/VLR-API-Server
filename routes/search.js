const express = require("express");

const { getSearchResults } = require("../scrapers/search/search_scraper");
const { checkCache, setCache } = require("../utils/cache")
const { fetchAndParse } = require("../utils/scrape_utils")

const router = express.Router();

// Get search results by query
router.get("/:query", async (req, res) => {
    const query = req.params.query;
    const key = `/search/${query}` // Key for cache
    const cacheData = checkCache(key);
    if (cacheData)
        return res.status(200).json(cacheData);
    try {
        const searchResults = await fetchAndParse(`/search/?q=${query}`, getSearchResults)
        setCache(key, searchResults, 600) // Cache search results for 10 minutes
        res.status(200).json(searchResults);
    } 
    catch (error) {
        res.status(500).json({ error: "Failed to get search results" });
    }
});

module.exports = router;