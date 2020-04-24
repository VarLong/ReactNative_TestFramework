const spawner = require("./spawner");
const walker = require("./testsuitewalker");

function runShield(args, callback) {
    const filteredTestPaths = walker(args.tag, args.excludedCases, args.group);
    spawner(filteredTestPaths, args, callback);
    return;
}

module.exports = runShield;
