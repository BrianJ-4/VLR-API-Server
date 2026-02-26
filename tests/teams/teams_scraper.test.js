const { getPage, getExpectedOutput } = require("../utils/test_helper")
const { getTeamInformation } = require("../../scrapers/teams/teams_scraper");
const path = require("path");

describe("getTeamInformation()", () => {
    const testCases = [
        {
            name: "Normal team page",
            htmlFile: "test1.html",
            expectedFile: "test1.json"
        },
        {
            name: "Upcoming match against TBD",
            htmlFile: "test2.html",
            expectedFile: "test2.json"
        },
        {
            name: "Player without real name",
            htmlFile: "test3.html",
            expectedFile: "test3.json"
        },
    ]
    
    test.each(testCases)(
        "$name - should return correct data",
        async ({htmlFile, expectedFile}) => {
            const data = await getTeamInformation(await getPage(path.join(__dirname, "data", "getTeamInformation", htmlFile)));
            const expected = await getExpectedOutput(path.join(__dirname, "data", "getTeamInformation", expectedFile));
            expect(data).toEqual(expected);
        }
    );
});