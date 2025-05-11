const parser = require("node-html-parser");
const fs = require('fs').promises;

async function getPage(file) {
    try {
        const html = await fs.readFile(file, 'utf8');
        const doc = parser.parse(html);        
        return doc;
    } 
    catch (error) {
        console.error("Failed to retrieve HTML: ", error);
        return null;
    }
    
}

async function getExpectedOutput(file) {
    try {
        const data = await fs.readFile(file, 'utf8');
        return JSON.parse(data);
    }
    catch (error) {
        console.error("Failed to get validation data: ", error);
        return null;
    }
    
}

// getPage("../test_data/matches/test_upcoming_match.html")
//     .then(doc => console.log(doc.innerHTML))
//     .catch(err => console.error(err));


module.exports = { getPage, getExpectedOutput };