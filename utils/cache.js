const NodeCache = require("node-cache");
const cache = new NodeCache();

function checkCache(key) {
    return cache.get(key);
}

function setCache(key, data, ttl) {
    cache.set(key, data, ttl);
}

module.exports = { checkCache, setCache };