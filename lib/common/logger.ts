const log4js = require("log4js");
const shield_stdout = "shield_stdout";

export interface FileAppender {
    appenderName: string;
    folderPath: string;
    fileName: string;
    extendFileName: string;
}
export interface StdoutAppender {
    appenderName: string;
}

module.exports = {
    configureLog4Js(stdoutAppenders: StdoutAppender[], fileAppenders: FileAppender[]) {
        const appenders = {};
        const categories = {
            default: { appenders: [shield_stdout], level: "debug" }
        };
        log4js.addLayout(shield_stdout, (config: any) => function (logEvent: any) {
            return `${logEvent.startTime.toISOString()} ${logEvent.level.levelStr}: ${logEvent.data.join(" ")}`;
        });

        let shieldStdoutAppenders: StdoutAppender[] = [{
            appenderName: shield_stdout
        }];
        if (stdoutAppenders) {
            shieldStdoutAppenders = shieldStdoutAppenders.concat(stdoutAppenders);
        }
        shieldStdoutAppenders.forEach((appender: StdoutAppender) => {
            appenders[appender.appenderName] = { type: "stdout", layout: { type: shield_stdout } };
            categories[appender.appenderName] = { appenders: [appender.appenderName], level: "debug" };
        });
        if (fileAppenders) {
            fileAppenders.forEach((appender: FileAppender) => {
                const logPath = appender.folderPath + "\/" + appender.fileName + "-" + appender.appenderName + "-" + appender.extendFileName + ".log";
                appenders[appender.appenderName] = { type: "file", filename: logPath, category: appender.appenderName, absolute: true, "layout": { "type": "messagePassThrough" } };
                categories[appender.appenderName] = { appenders: [appender.appenderName], level: "debug" };
            });
        }

        log4js.configure({
            appenders: appenders,
            categories: categories
        });
        return log4js;
    },

    getLog4jsInstance(stdoutAppenders: StdoutAppender[], fileAppenders: FileAppender[]) {
        // appenderType: stuout, file
        return this.configureLog4Js(stdoutAppenders, fileAppenders);
    },

    getDefInstance(categoryName = shield_stdout) {
        this.getLog4jsInstance([], []);
        return log4js.getLogger(categoryName);
    }
};

// exports["logger"] = new Logger().logger;
