const { getPage, getText } = require("../../utils/scrape_utils");
const { convertStringToUTC } = require("../../utils/date_time");

async function getArticles(page) {
    const url = `https://vlr.gg/news/?page=${page}`;
    try {
        // Access page and get HTML
        const doc = await getPage(url);

        // Get articles in page
        const news = doc.querySelector("div.wf-card");
        const articleElements = news.querySelectorAll("a");
        const articles = [];
        // Create article object for all articles
        articleElements.forEach((article) => {
            let articleObj = {};

            // Get title and description
            articleObj.ID = article.attributes.href.match(/\/(\d+)\//)[1];
            articleObj.Title = getText(article.querySelector("div").children[0]);
            articleObj.Description = getText(article.querySelector("div").children[1]);

            // Get date and author (Has more steps)
            const dateAndAuthor = getText(article.querySelector("div.ge-text-light"));
            const parts = dateAndAuthor.split("•").map(part => part.trim());
            articleObj.Date = parts[1];
            articleObj.Author = parts[2]?.replace("by ", "").trim();
            
            articles.push(articleObj);
        });
        return articles;
    }
    catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: "Failed to fetch site data" });
    }
}

async function getArticleByID(articleID) {
    const url = `https://vlr.gg/${articleID}`;
    try {
        // Access page and get HTML
        const doc = await getPage(url);

        // Get title and author
        const article = doc.querySelector("div.wf-card.mod-article");
        const title = getText(article.querySelector("h1.wf-title"));
        const author = getText(article.querySelector("a.article-meta-author"));

        // Get date
        const dateAttributes = article.querySelector("span.js-date-toggle").attributes;
        const date = await convertStringToUTC(dateAttributes.title);

        // Get article content
        const content = article.querySelector("div.article-body").innerHTML;

        // Construct article object
        const articleObj = {
            title: title,
            author: author,
            date: date,
            content: content.replace(/\s+/g, ' ').trim()
        };
        return articleObj;
    }
    catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: "Failed to fetch site data" });
    }
}

module.exports = { getArticles, getArticleByID };