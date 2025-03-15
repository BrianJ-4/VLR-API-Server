const { getPage, getText } = require("../utils/scrape_utils");

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
            // Get title and description
            const title = getText(article.querySelector("div").children[0]);
            const description = getText(article.querySelector("div").children[1]);

            // Get date and author (Has more steps)
            const dateAndAuthor = getText(article.querySelector("div.ge-text-light"));
            const parts = dateAndAuthor.split("•").map(part => part.trim());
            const date = parts[1];
            const author = parts[2]?.replace("by ", "").trim();

            // Construct article object and add to list
            const articleObj = {
                title: title,
                description: description,
                author: author,
                date: date
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
        const date = dateAttributes.title;

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