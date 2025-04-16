function hoursSince(dateString) {
    const date = new Date(dateString);
    const currentDate = new Date();
    const diff = Math.floor((currentDate - date) / (1000 * 60 * 60));
    console.log(diff);
    return diff;
}

module.exports = { hoursSince };