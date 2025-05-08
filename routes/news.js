const express = require("express");
const router = express.Router();

const { getArticles, getArticleByID } = require("../scrapers/news/news_scraper");
const { checkCache, setCache } = require("../utils/cache")
const { hoursSince } = require("../utils/date_time");
const { fetchAndParse } = require("../utils/scrape_utils")

// Get list of articles
router.get("/:page", async (req, res) => {
    const page = parseInt(req.params.page) || 1;
    const key = `/news/${page}` // Key for cache
    const cacheData = checkCache(key);
    if (cacheData)
        return res.status(200).json(cacheData);
    try {
        const articles = await fetchAndParse(`/news/?page=${page}`, getArticles);
        setCache(key, articles, 1800) // Cache articles list for 30 minutes
        res.status(200).json(articles);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to get articles" });
    }
});

// Get an article by ID
router.get("/article/:articleID", async (req, res) => {
    const articleID = parseInt(req.params.articleID);
    const key = `/news/article/${articleID}` // Key for cache
    const cacheData = checkCache(key);
    if (cacheData)
        return res.status(200).json(cacheData);
    try {
        const article = await fetchAndParse(`/${articleID}`, getArticleByID);
        if (hoursSince(article.date) <= 168) // Cache article published within one week for 84 hours
            setCache(key, article, 5040)
        res.status(200).json(article);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to get article" });
    }
});

// Handle 404 routes
router.use((req, res) => {
    res.status(404).json({ error: "Route not found in /news" });
});

module.exports = router;