const parser = require("node-html-parser");
const axios = require("axios");
const express = require("express");

const {getArticles, getArticleByID} = require("../scrapers/newsScraper");

const router = express.Router();

// Get list of articles
router.get("/:page", async (req, res) => {
    const page = parseInt(req.params.page) || 1;
    try {
        const articles = await getArticles(page);
        res.status(200).json(articles);
    } 
    catch (error) {
        res.status(500).json({ error: "Failed to get articles"});
    }
});

// Get an article by ID
router.get("/article/:articleID", async (req, res) => {
    const articleID = parseInt(req.params.articleID);
    try {
        const article = await getArticleByID(articleID);
        res.status(200).json(article);
    } 
    catch (error) {
        res.status(500).json({ error: "Failed to get article"});
    }
});

// Handle 404 routes
router.use((req, res) => {
    res.status(404).json({ error: "Route not found in /news" });
});

module.exports = router;