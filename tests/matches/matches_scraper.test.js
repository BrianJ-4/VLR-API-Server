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

describe("getMatchInformation()", () => {
    const testCases = [
        {
            name: "Upcoming Match",
            htmlFile: "test1.html",
            expectedFile: "test1.json"
        },
        {
            name: "Completed Match",
            htmlFile: "test2.html",
            expectedFile: "test2.json"
        },
        {
            name: "Live Match with TBD Maps",
            htmlFile: "test3.html",
            expectedFile: "test3.json"
        }
    ]
    
    test.each(testCases)(
        "$name - should return correct data",
        async ({htmlFile, expectedFile}) => {
            const data = await getMatchInformation(await getPage(path.join(__dirname, "data", "getMatchInformation", htmlFile)));
            const expected = await getExpectedOutput(path.join(__dirname, "data", "getMatchInformation", expectedFile));
            expect(data).toEqual(expected);
        }
    );
});

describe("getCompletedMatches()", () => {
    const testCases = [
        {
            name: "Completed",
            htmlFile: "test1.html",
            expectedFile: "test1.json"
        }
    ]
    
    test.each(testCases)(
        "$name - should return correct data",
        async ({htmlFile, expectedFile}) => {
            const data = await getCompletedMatches(await getPage(path.join(__dirname, "data", "getCompletedMatches", htmlFile)));
            const expected = await getExpectedOutput(path.join(__dirname, "data", "getCompletedMatches", expectedFile));
            expect(data).toEqual(expected);
        }
    );
});