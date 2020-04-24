
import { FileAppender } from "./logger";
const LoggerFactory = require("./logger");
const fs = require("fs-extra");
const utils = require("./utils");

module.exports = {
    configureLog4Js(sleniumLogPath: string, logTypes: string[], fileName: string, logOrder: any) {
        const fileAppenders: FileAppender[] = [];
        logTypes.forEach(function (type: string) {
            fileAppenders.push(
                {
                    appenderName: type,
                    folderPath: sleniumLogPath,
                    fileName: fileName,
                    extendFileName: logOrder
                }
            );
        });
        return LoggerFactory.getLog4jsInstance([], fileAppenders);
    },

    /**
     * Create a logs for test run.
     * @param browser
     * @param sleniumLogPath Path where shield save the logs.
     * @param fileName Test script name.
     * @param logOrder Count of retry or current time.
     */
    generateLocalLogs(browser: WebdriverIO.BrowserObject, sleniumLogPath: string, fileName: string, logOrder: string) {
        console.log("Start generate selenium logs.");
        utils.createDir(sleniumLogPath);
        const types = browser.getLogTypes();
        const mylog4js = this.configureLog4Js(sleniumLogPath, types, fileName, logOrder);
        types.forEach((typeName: string) => {
            const logs: any[] = browser.getLogs(typeName);
            const logger = mylog4js.getLogger(typeName);
            if (logs) {
                if (logs instanceof Array) {
                    if (logs.length > 0) {
                        for (let index = 0; index < logs.length; index++) {
                            const log = logs[index];
                            if (log === "server" || log === "bugreport") {
                                continue;
                            }
                            logger.info(new Date(log.timestamp).toISOString() + " [" + log.level + "]" + " : " + log.message + typeName);
                        }
                    } else {
                        logger.info("No logs were found for " + types);
                    }
                } else {
                    const logString = JSON.stringify(logs);
                    logger.info(logString);
                }

            } else {
                logger.info("No logs were found for " + typeName);
            }
        });
    },

    /**
     * Create screenshot for test run.
     * @param browser
     * @param sleniumLogPath Path where shield save the screenshot.
     * @param fileName Screenshot name
     * @param logOrder Count of retry or current time.
     */
    generateScreenShotLocalLogs(browser: WebdriverIO.BrowserObject, sleniumLogPath: string, fileName: string, logOrder: string) {
        utils.createDir(sleniumLogPath);
        browser.saveScreenshot(`${sleniumLogPath}/${fileName}_${logOrder}.png`);
    },

    /**
     * Generate a base log path for shield based on the @filePath.
     * @param filePath A test script path.
     * @param basePath ShieldLog base path.
     * @param args Extend path. Will be add behind the @basePath.
     */
    generateLocalLogsPath(filePath: string, basePath: string, ...args: string[]) {
        const logFolder = filePath.replace(/.*tests[\/|\\]/, basePath).replace(".js", "").replace(/[\/|\\]/g, "\/");
        return logFolder + args.join("/");
    },

    /**
     * GenerateMstvLogs
     * @param browser
     * @param logPath logPath
     * @param fileName fileName
     * @param logOrder Count of retry or current time.
     */
    generateMstvLogs(browser: WebdriverIO.BrowserObject, logPath: string, fileName: string, logOrder: string) {
        // TODO: webdriver always return null. { script: 'alert();', args: [ 'test' ] }[0-0] null
        //     const result = browser.executeScript("alert();", ["test"]);
        //     // console.log(result);

        //     repoter.configureLog4Js(logPath, ["browserConsole"], fileName, logOrder);
        //     const browserLogger = log4js.getLogger("browserConsole");
        //     if (result.value instanceof Array) {
        //         result.value.forEach(function (log: string) {
        //             browserLogger.info(log);
        //         });
        //     } else {
        //         browserLogger.info(result.value);
        //     }

    }
};