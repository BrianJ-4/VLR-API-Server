const { getPage, getExpectedOutput } = require("../utils/test_helper")
const { getUpcomingAndLiveMatches, getCompletedMatches, getMatchInformation } = require("../../scrapers/matches/matches_scraper");
const path = require("path");

describe("getUpcomingAndLiveMatches()", () => {
    const testCases = [
        {
            name: "List with TBD's",
            htmlFile: "test1.html",
            expectedFile: "test1.json"
        },
        // {
        //     name: "set 2",
        //     htmlFile: "completed-2.html",
        //     expectedFile: "completed-2.expected.json"
        // }
    ]
    
    test.each(testCases)(
        "$name - should return correct data",
        async ({htmlFile, expectedFile}) => {
            const data = await getUpcomingAndLiveMatches(await getPage(path.join(__dirname, "data", "getUpcomingAndLiveMatches", htmlFile)));
            const expected = await getExpectedOutput(path.join(__dirname, "data", "getUpcomingAndLiveMatches", expectedFile));
            expect(data).toEqual(expected);
        }
    );
});