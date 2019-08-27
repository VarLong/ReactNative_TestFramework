const JSON5 = require('json5');
const fs = require("fs");
const minimist = require('minimist');
const capabilities = getConfigByPath("./config/capabilities.json5");
const deployments = getConfigByPath("./config/deployments.json5");
const config = getConfigByPath("./config/wdio.default.json5");
const options = require('../lib/cli/options');
const args = minimist(process.argv.slice(2), options.cli);
const vars = args.var ? [].concat(args.var) : [];

function getConfigByPath(pathname) {
    try {
        return JSON5.parse(fs.readFileSync(pathname).toString());
    } catch (err) {
        console.error(`Error loading config ${pathname} ${err}`);
        process.exit(9);
    }
}

function reConfig(configItem) {
    if (configItem['services'] && configItem['services'].indexOf("sauce") >= 0) {
        configItem["user"] = "yudeng";
        configItem["key"] = "79a359cf-71e6-4b8e-b56d-f262d50b025a";
    }
    return configItem;
}

if (!process.env.runId) {
    process.env.runId = process.env.buildStartTime ? new Date(process.env.buildStartTime).getTime().toString() + "0000" : function () {
        process.env.buildStartTime = new Date();
        return new Date(process.env.buildStartTime).getTime().toString() + "0000";
    }();
}

if (args.env) {
    console.log('args.env');
    console.log(args.env);
}
if (args.device) {
    const dev = args.device;
    if (capabilities[dev]) {
        console.log(`Add device ${dev} to test run.`);
        for (const key in capabilities[dev]) {
            config[key] = capabilities[dev][key];
        }
    } else {
        console.log(`Not find device ${dev} in capabilities.`);
    }
}

config.beforeSession = (config, capabilities, specs) => {
    require('@babel/register');
};
exports.config = reConfig(config);