const minimist = require("minimist");
const options = require("../cli/options");
const fs = require("fs-extra");
const log4js = require("log4js");
const config = require("../../config/wdio.conf");
const { getJSON5ConfigByPath } = require("../common/Utils");
const deployments = getJSON5ConfigByPath("./config/deployments.json5");

const REPORT_TITLE = "Shield";

class TEST_STATUS {
    Passed = "Passed";
    Failed = "Failed";
    Skipped = "Skipped";
    TimedOut = "TimedOut";
}

class TEST_OUTCOME_FLAG {
    Passed = "Passed";
    Failed = "Failed";
}

class IErrorDetail {
    message;
    stacktrace;
    failure;
}

class ITestData {
    reporttitle;
    buildnumber;
    runid;
    area;
    testscenariosessionid; // used to group all tests in the same file together in ES
    priority;
    environment;
    platform;
    testcontroller;
    testenvironment;
    testruntype;
    testcasename;
    teststepindex;
    testoutcome;
    testoutcomerate; // 0 for failed, 1 for passed
    teststarttime;
    testendtime;
    testdurationmilliseconds;
    errorsummary;
    errormessage;
    testresultid; // runid
    operator;
    // Not available in nightwatch
    testcaseid;
    owner;
    testmethod;
    teststorage;
    callstack;
    testrunname;
    agentname;
    site;
    slot;
    testAccountID;
    computerName;
    tenantId;
    currentLocale;

    cloudContainer;
    cloudBlob;
}

class Reporter {
    environment;
    os;
    platform;
    browser;
    selenium_host;
    buildStartTime;
    testDataTemplate;
    operator = "mr";
    runId;

    constructor() {
    }

    outputShieldLog() {
        // console.log("config------>");
        // console.log(config);
        // console.log("browser------>");
        // console.log(browser);
        // console.log("driver------>");
        // console.log(driver);
        // fs.writeFileSync();
    }

    generateLogs(browser, seleniumAndBrowserLogPath, executingTestCaseName, logOrder) {
        browser.getLogTypes(function (typesArray) {
            if (typesArray instanceof Array) {
                this.configureLog4Js(typesArray, seleniumAndBrowserLogPath, executingTestCaseName, logOrder);
                console.log(typesArray);
                typesArray.forEach(function (type) {
                    browser.getLog(type, function (logs) {
                        var logger = log4js.getLogger(type);
                        if (logs) {
                            if (logs instanceof Array) {
                                if (logs.length > 0) {
                                    logs.forEach(function (log) {
                                        logger.info(new Date(log.timestamp).toISOString() + '[' + log.level + '] ' + ' : ' + log.message);
                                    });
                                } else {
                                    logger.info("No logs were found for " + type);
                                }
                            } else if (logs instanceof Object) {
                                var logJson = JSON.stringify(logs);
                                logger.info(logJson);
                            } else {
                                var logString = logs.toString();
                                logger.info(logString);
                            }

                        } else {
                            logger.info("No logs were found for " + type);
                        }
                    });
                });
            }
        });
    }

    configureLog4Js(logTypes, seleniumAndBrowserLogPath, executingTestCaseName, logOrder) {
        var appenders = {};
        var categories = {};
        logTypes.forEach(function (type) {
            var logPath = seleniumAndBrowserLogPath + "\/" + executingTestCaseName + "-" + type + "-" + logOrder + ".log";
            appenders[type] = { type: 'file', filename: logPath, category: type, absolute: true, "layout": { "type": "messagePassThrough" } };
            categories[type] = { appenders: [type], level: "debug" };
        });
        categories["default"] = { appenders: logTypes, level: "debug" };

        log4js.configure({
            appenders: appenders,
            categories: categories
        });
    }
}
module.exports = new Reporter();