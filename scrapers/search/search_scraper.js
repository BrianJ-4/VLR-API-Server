const { getEventSectionResults, getTeamSectionResults, getSectionResults } = require("../search/helpers/get_search_results_helper")
const { getText } = require("../../utils/scrape_utils");

async function getSearchResults(doc) {
    let searchResults = {};
    try {
        // Get result types
        const resultsContainer = doc.querySelector("div.col.mod-1");
        const labels = resultsContainer.querySelectorAll("div.wf-label.mod-large");

        labels.forEach(label => {
            const sectionName = getText(label);
            // Get wf-card for section and then all elements within section
            const associatedSection = label.nextElementSibling;
            const results = associatedSection.querySelectorAll("a");

            if (sectionName === "events") 
                searchResults[sectionName] = getEventSectionResults(results);
            else if (sectionName === "teams")
                searchResults[sectionName] = getTeamSectionResults(results);
            else
                searchResults[sectionName] = getSectionResults(results);
        });
        return searchResults;
    }
    catch (error) {
        console.log("Error: " + error);
    }
}

module.exports = { getSearchResults };