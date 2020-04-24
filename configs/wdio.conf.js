const utils = require("../artifacts/build/lib/common/utils");
const repoter = require("../artifacts/build/lib/common/repoter");
const LoggerFactory = require("../artifacts/build/lib/common/logger");
const userAccountManager = require("../artifacts/build/lib/common/userAccountManager");
const minimist = require("minimist");
const klawSync = require("klaw-sync");
const path = require("path");
const resolve = require("path").resolve;
const nwargs = minimist(process.argv.slice(2), {});
const merge = require("lodash").merge;
const capabilities = utils.getJSON5ConfigByPath("./configs/capabilities.json5");
const deployments = utils.getJSON5ConfigByPath("./configs/deployments.json5");
const args = minimist(process.argv.slice(2), {});
const vars = args.var ? [].concat(args.var) : [];
const fs = require("fs-extra");
let config = utils.getJSON5ConfigByPath("./configs/wdio.default.json5");
const logger = LoggerFactory.getDefInstance();
let logFolderPath = "./ShieldLog/";

function reConfig(configItem) {
    return configItem;
}

function reConfigBaseUrl(url) {
    return url;
}

function doEnvironments(deployment) {
    // merge the test environment settings
    const envConfigPath = "configs/testEnvConfigs/";
    logger.info(resolve(envConfigPath + "common.json5"));
    const commonVal = utils.getJSON5ConfigByPath(resolve(envConfigPath + "common.json5"));
    const val = utils.getJSON5ConfigByPath(resolve(envConfigPath + deployment + ".json5"));
    config["test_settings"] = merge(config["test_settings"], commonVal, val);
}

function getArgs() {
    if (args.env) {
        const i = args.env.indexOf("-");
        const e = args.env.slice(0, i);
        const d = args.env.slice(i + 1, args.env.length);
        args["device"] = d;
        args["deployment"] = e;
    } else {
        if (!args["deployment"] || !args["device"]) {
            logger.info(`Please add device or deployment.`);
            return;
        }
        args["env"] = `${args["deployment"]}-${args["device"]}`;
    }
    if (args.device) {
        const dev = args.device;
        if (capabilities[dev]) {
            for (const key in capabilities[dev]) {
                config[key] = capabilities[dev][key];
            }
        } else {
            logger.info(`Not find device ${dev} in capabilities.`);
        }
    }

    if (args.deployment) {
        config["deployment"] = args.deployment;
        const deploment = deployments[args.deployment];
        config["baseUrl"] = deploment["launch_url"];
        doEnvironments(args.deployment);
        // add deployment
        for (const key in deploment) {
            config["test_settings"][key] = deploment[key];
        }
    }
}

function addCommands() {
    logger.info(`Start add commands in folder.`);
    const filterFn = (item) => {
        return (
            path.extname(item.path) === ".js"
        );
    };
    const pathsObjs = klawSync(path.resolve(__dirname, "../artifacts/build/lib/custom-commands/"), { filter: filterFn });
    pathsObjs.forEach(item => {
        const obj = require(item.path);
        for (const key in obj) {
            browser.addCommand(key, obj[key]);
        }
    });
}

getArgs();

if (!process.env.runId) {
    process.env.runId = process.env.buildStartTime
        ? new Date(process.env.buildStartTime).getTime().toString() + "0000"
        : (function () {
            process.env.buildStartTime = new Date();
            return new Date(process.env.buildStartTime).getTime().toString() + "0000";
        })();
}
logFolderPath = logFolderPath + process.env.runId + "/";
config["logFolderPath"] = logFolderPath;
logger.info(`runId: ${process.env.runId}`);

config.onPrepare = (config) => {
    this.config.test_settings.loginType = this.config.test_settings.loginType ? this.config.test_settings.loginType : "TestSSO";
    if (process.env.testAccountID) {
        this.config.test_settings.testAccountID = process.env.testAccountID;
    }
    if (process.env.testAccountPassword) {
        this.config.test_settings.testAccountPassword = process.env.testAccountPassword;
    }
};

config.before = (config, capabilities, specs) => {
    const chai = require("chai");
    global.expect = chai.expect;
    chai.Should();
    addCommands();
};

config.beforeCommand = (commandName, args) => { };

config.beforeHook = (test, context, stepData, world) => { };

config.beforeSession = (config, capabilities, specs) => {
    // return userAccountManager.initializeTestUser(this.config);
};

config.beforeSuite = (suite) => {
};

config.beforeTest = (test, context) => { };

config.afterHook = (test, context, result, stepData, world) => { };

config.after = (result, capabilities, specs) => { };

config.afterSession = (config, capabilities, specs) => { };

config.afterSuite = (suite) => {
    const index1 = ((suite.file.lastIndexOf("\/") > suite.file.lastIndexOf("\\")) ? suite.file.lastIndexOf("\/") : suite.file.lastIndexOf("\\")) + 1;
    const index2 = suite.file.indexOf(".js");
    const fileName = suite.file.substring(index1, index2);
    // Based on retries or timestamp we have a new log file for every retry.
    const logOrder = args.round ? args.round : new Date().getTime().toString();
    const seleniumAndBrowserLogPath = repoter.generateLocalLogsPath(suite.file, logFolderPath);
    // repoter.generateLocalLogs(browser, seleniumAndBrowserLogPath, fileName, logOrder);
    repoter.generateMstvLogs(browser, seleniumAndBrowserLogPath, fileName, logOrder);
    return userAccountManager.cleanupTestUser();
};

config.afterTest = (test, context, result) => {
    // if(this.config.test_settings.shieldLogEnabled !== "false"){
    if (!result.passed) {
        const logOrder = args.round ? args.round : new Date().getTime().toString();
        const screenShotLogPath = repoter.generateLocalLogsPath(test.file, logFolderPath, "/ScreenShots");
        repoter.generateScreenShotLocalLogs(browser, screenShotLogPath, test.title, logOrder);
    }
    // }
};

config.onReload = (oldSessionId, newSessionId) => {
};

config.onComplete = (exitCode, config, capabilities, results) => {
    logger.info("Customized Test Suite onComplete--------------->");
};

exports.config = reConfig(config);
