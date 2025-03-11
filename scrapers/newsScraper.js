const parser = require("node-html-parser");
const axios = require("axios");

async function getArticles(page) {
    const articles = [];
    try {
        // Access page
        const response = await axios.get(`https://vlr.gg/news/?page=${page}`);
        const doc = parser.parse(response.data);

        // Get articles in page
        const news = doc.querySelector("div.wf-card");
        const articleElements = news.querySelectorAll("a");

        // Create article object for all articles
        articleElements.forEach((article) => {
            // Get title and description
            const title = article.querySelector("div").children[0].text.trim();
            const description = article.querySelector("div").children[1].text.trim();

            // Get date and author (Has more steps)
            const dateAndAuthor = article.querySelector("div.ge-text-light").text.trim();
            const parts = dateAndAuthor.split("•").map(part => part.trim());
            const date = parts[1];
            const author = parts[2]?.replace("by ", "").trim();

            // Construct article object and add to list
            const articleObj = {
                title : title,
                description : description,
                author : author,
                date : date
            }
            articles.push(articleObj);
        });
        return articles;
    } 
    catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: "Failed to fetch site data" });
    }
}

module.exports = {getArticles};