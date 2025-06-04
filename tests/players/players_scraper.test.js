const { getPage, getExpectedOutput } = require("../utils/test_helper")
const { getPlayerInformation } = require("../../scrapers/players/players_scraper");
const path = require("path");

describe("getPlayerInformation()", () => {
    const testCases = [
        {
            name: "Normal Player",
            htmlFile: "test1.html",
            expectedFile: "test1.json"
        },
        {
            name: "Retired Player",
            htmlFile: "test2.html",
            expectedFile: "test2.json"
        },
        {
            name: "Player With No Past Teams",
            htmlFile: "test3.html",
            expectedFile: "test3.json"
        },
    ]
    
    test.each(testCases)(
        "$name - should return correct data",
        async ({htmlFile, expectedFile}) => {
            const data = await getPlayerInformation(await getPage(path.join(__dirname, "data", "getPlayerInformation", htmlFile)));
            const expected = await getExpectedOutput(path.join(__dirname, "data", "getPlayerInformation", expectedFile));
            expect(data).toEqual(expected);
        }
    );
});