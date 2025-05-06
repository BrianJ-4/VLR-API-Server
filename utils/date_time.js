const { DateTime } = require("luxon");
const geoip = require("geoip-lite");
const tzLookup = require("tz-lookup");
const publicAddress = require("public-address");

let serverTimezone = "";
(async () => {
    try {
        await storeServerTimezone();
        console.log("Server timezone retrieved:", serverTimezone);
    } 
    catch (err) {
        console.error("Failed to get server timezone:", err);
    }
})();

async function storeServerTimezone() {
    return new Promise((resolve, reject) => {
        publicAddress((err, data) => {
            if (err || !data?.address) 
                return reject("Failed to get IP");
            const ip = data.address;
            const geo = geoip.lookup(ip);
            if (!geo?.ll) 
                return reject("Failed to geolocate IP");
            serverTimezone = tzLookup(geo.ll[0], geo.ll[1]);
            resolve(serverTimezone);
        });
    });
}

function getServerTimezone() {
    return serverTimezone;
}

async function convertStringToUTC(timeString) {    
    const lastDigitIndex = timeString.search(/\d(?!.*\d)/)
    timeString = timeString.slice(0, lastDigitIndex + 1);

    const dt = DateTime.fromFormat(`${timeString} ${getServerTimezone()}`, "LLL d, yyyy 'at' HH:mm z", {
        zone: serverTimezone
    });

    return dt.toUTC().toISO(); // Convert to UTC ISO string
}

function hoursSince(dateString) {
    const date = new Date(dateString);
    const currentDate = new Date();
    const diff = Math.floor((currentDate - date) / (1000 * 60 * 60));
    return diff;
}

module.exports = { hoursSince, convertStringToUTC, getServerTimezone };