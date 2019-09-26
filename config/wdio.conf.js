const minimist = require('minimist');
const Utils = require("../lib/common/Utils");
const resolve = require("path").resolve;
const nwargs = minimist(process.argv.slice(2), {});
const extend = require("lodash/object/extend");
const merge = require("lodash/object/merge");
const capabilities = Utils.getJSON5ConfigByPath("./config/capabilities.json5");
const deployments = Utils.getJSON5ConfigByPath("./config/deployments.json5");
const config = Utils.getJSON5ConfigByPath("./config/wdio.default.json5");
const options = require('../lib/cli/options');
const args = minimist(process.argv.slice(2), options.cli);
const vars = args.var ? [].concat(args.var) : [];

function reConfig(configItem) {
    if (configItem['services'] && configItem['services'].indexOf("sauce") >= 0) {
        configItem["user"] = "yudeng";
        configItem["key"] = "79a359cf-71e6-4b8e-b56d-f262d50b025a";
    }
    return configItem;
}

function reConfigBaseUrl(url) {
    return url;
}

function doEnvironments(deployment) {
    console.log(`merge the test environment settings ${deployment}`);
    const envConfigPath = "config/TestConfigData/";
    const commonVal = Utils.getJSON5ConfigByPath(resolve(envConfigPath + "common.json5"));
    const val = Utils.getJSON5ConfigByPath(resolve(envConfigPath + deployment + '.json5'));
    config['test_settings'] = merge({}, commonVal, val);
}

config.onPrepare = (config, capabilities) => {
    if (!process.env.runId) {
        process.env.runId = process.env.buildStartTime ? new Date(process.env.buildStartTime).getTime().toString() + "0000" : function () {
            process.env.buildStartTime = new Date();
            return new Date(process.env.buildStartTime).getTime().toString() + "0000";
        }();
    }
    console.log(`runId: ${process.env.runId}`);
    const folderlogPath = "ShieldLog/" + process.env.runId;
    Utils.createDir(folderlogPath);

    if (args.env) {
        const i = args.env.indexOf('-');
        const dep = args.env.slice(0, i);
        const dev = args.env.slice(i + 1, args.env.length);
        args['device'] = dev;
        args['deployment'] = dep;
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

    if (args.deployment) {
        config['deployment'] = args.deployment;
        const deploment = deployments[args.deployment];
        config['baseUrl'] = deploment['launch_url'];
        doEnvironments(args.deployment);
        // add deployment
        for (const key in deploment) {
            config['test_settings'][key] = deploment[key];
        }
    }
    console.log('onPrepare------------->');
};
config.before = (config, capabilities, specs) => {
    console.log('before------------->');
};
config.beforeSession = (config, capabilities, specs) => {
    console.log('beforeSession------------->');
};
config.beforeSuite = (config, capabilities, specs) => {
    console.log('beforeSuite------------->');
};
config.beforeHook = (config, capabilities, specs) => {
    console.log('beforeHook------------->');
};
config.beforeTest = (config, capabilities, specs) => {
    console.log('beforeTest------------->');
};
config.beforeCommand = (config, capabilities, specs) => {
    console.log('beforeCommand------------->');
};
config.afterCommand = (config, capabilities, specs) => {
    console.log('afterCommand------------->');
};
config.afterTest = (config, capabilities, specs) => {
    console.log('afterTest------------->');
};
config.afterHook = (config, capabilities, specs) => {
    console.log('afterHook------------->');
};
config.afterSuite = (config, capabilities, specs) => {
    console.log('afterSuite------------->');
};
config.afterSession = (config, capabilities, specs) => {
    console.log('afterSession------------->');
};
config.after = (config, capabilities, specs) => {
    console.log('after------------->');
};
config.onComplete = (config, capabilities, specs) => {
    console.log('onComplete------------->');
};
config.onReload = (config, capabilities, specs) => {
    console.log('onReload------------->');
};
config.beforeFeature = (config, capabilities, specs) => {
    console.log('beforeFeature------------->');
};
config.beforeScenario = (config, capabilities, specs) => {
    console.log('beforeScenario------------->');
};
config.beforeStep = (config, capabilities, specs) => {
    console.log('beforeStep------------->');
};
config.afterStep = (config, capabilities, specs) => {
    console.log('afterStep------------->');
};
config.afterScenario = (config, capabilities, specs) => {
    console.log('afterScenario------------->');
};
config.afterFeature = (config, capabilities, specs) => {
    console.log('afterFeature------------->');
};
config.beforeSession = (config, capabilities, specs) => {
    require('@babel/register');
};

exports.config = reConfig(config);