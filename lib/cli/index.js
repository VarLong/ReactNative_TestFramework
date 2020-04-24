const minimist = require("minimist"),
    groupify = require("./groupify"),
    fs = require("fs-extra"),
    argv = process.argv.slice(2),
    querystring = require("querystring"),
    settings = require("../common/settings"),
    webDriverIOsetup = require("../common/setup");

const privateRunStr = settings.shieldRunSettings.privateRunStr;
const privateBuildStr = settings.shieldRunSettings.privateBuildStr;
const allVars = [];

function reporter(results, callback) {
    const wdioConfig = require("../../../../configs/wdio.conf.js").config;
    const tableOptions = {
        chars: {
            "top": "",
            "top-mid": "",
            "top-left": "",
            "top-right": "",
            "bottom": "",
            "bottom-mid": "",
            "bottom-left": "",
            "bottom-right": "",
            "left": "",
            "left-mid": "",
            "mid": "",
            "mid-mid": "",
            "right": "",
            "right-mid": "",
            "middle": " ",
        },
        style: { "padding-left": 0, "padding-right": 0 },
    };

    const isHourlyRun = process.env.RunType === "HourlyRun";
    const isPrivateRun =
        (process.env.RunType === privateRunStr || process.env.BuildNumber === privateBuildStr) && !isHourlyRun;

    const rid = process.env.runId;
    const webHostAddress = settings.shieldRunSettings.RCAutomationToolAddress;
    const passedTable = new Table(tableOptions);
    const failedTable = new Table(tableOptions);
    const timedOutTable = new Table(tableOptions);
    const timedOutResults = {};

    let passedCount = 0;
    let failedCount = 0;
    let totalCount = 0;

    const failedTests = [];
    const timeoutTests = [];
    const passedTests = [];
    const fdata = {
        rid: rid,
        ctest: "",
    };

    const getShotPath = function(testPathWin) {
        return testPathWin.substring(testPathWin.indexOf("tests\\") + 6, testPathWin.length - 3);
    };

    Object.keys(results).forEach(function(key) {
        totalCount++;
        const testPathWin = key.replace(/\//g, "\\");
        const procCode = results[key].proc.code;
        const runTime = results[key].endTime - results[key].startTime;
        const retry = results[key].attempt - 1;

        let retryMessage = "";
        retryMessage = retry > 0 ? `(with ${retry} retry)` : " ";
        const runMessage = `run ${runTime / 1000} sec ${retryMessage}`;
        if (results[key].msg === settings.testResult.pass || procCode === 0) {
            passedCount++;
            passedTable.push([getShotPath(testPathWin), results[key].msg, runMessage]);
            passedTests.push(getShotPath(testPathWin));
        } else if (results[key].msg === settings.testResult.fail || procCode === 1) {
            failedCount++;
            fdata.ctest = getShotPath(testPathWin);
            failedTests.push(fdata.ctest);
            if (isPrivateRun) {
                failedTable.push([getShotPath(testPathWin), results[key].msg, runMessage]);
            } else {
                failedTable.push([
                    `<a href="${webHostAddress}/ati?${querystring.stringify(fdata)}" target="_blank">${
                        fdata.ctest
                    }</a>`,
                    results[key].msg,
                    runMessage,
                ]);
            }
        } else {
            fdata.ctest = getShotPath(testPathWin);
            timedOutResults[fdata.ctest] = results[key];
            timeoutTests.push(fdata.ctest);
            if (isPrivateRun) {
                timedOutTable.push([fdata.ctest, results[key].msg, runMessage]);
            } else {
                timedOutTable.push([
                    `<a href="${webHostAddress}/ati?${querystring.stringify(fdata)}" target="_blank">${
                        fdata.ctest
                    }</a>`,
                    results[key].msg,
                    runMessage,
                ]);
            }
        }
    });
    const exitCode = totalCount - passedCount;
    const runInfo = {
        agent: require("os").hostname(),
        url: wdioConfig.test_settings.launch_url,
        runId: rid,
        env: process.env.deployment,
        dev: process.env.device,
        buildNumber: process.env.BuildNumber,
        runType: process.env.RunType,
        tag: process.env.tag,
        var: allVars,
        stime: new Date(process.env.buildStartTime).getTime(), // test start time - timestamp
        etime: Date.now(), // test end time - timestamp
        totalCount: totalCount,
        ftests: failedTests,
        ttests: timeoutTests,
        ptests: passedTests,
        excluded: process.env.excludedCases ? process.env.excludedCases.split(",") : [],
    };
    const testLog = JSON.stringify(runInfo);
    fs.writeFile("ShieldLog/" + rid + "/testLog.json", testLog, function(err) {
        if (err) return console.error("Write to 'testLog.json' failed: " + err);
    });

    const boldLeft = isPrivateRun ? "" : "<b>";
    const boldRight = isPrivateRun ? "" : "</b>";
    const lineBreak = isPrivateRun ? " " : "<br />";
    console.log(`Shield summary for run: ${boldLeft + rid + boldRight}`);
    console.log(`Build: ${boldLeft + process.env.BuildNumber + boldRight}`);
    console.log(`Total No Of Tests Executed: ${boldLeft + totalCount + boldRight}`);
    console.log(lineBreak);

    if (failedCount > 0) {
        console.log(`${boldLeft}********* FAILED TEST CASES - INVESTIGATE *************${boldRight}`);
        if (!isPrivateRun) {
            console.log(
                `<b><a href="${webHostAddress}/ati?rid=${rid}" target="_blank">Click Here for failed tests investigation</a></b>`
            );
        }
        console.log(`Total No Of Tests ${boldLeft}FAILED: ${failedCount + boldRight}`);
        console.log(failedTable.toString());
        console.log(lineBreak);
    }

    if (totalCount - (failedCount + passedCount) > 0) {
        console.log(`${boldLeft}********* TIMED OUT TEST CASES *****************${boldRight}`);
        console.log(timedOutTable.toString());
        console.log(lineBreak);
    }

    console.log(`${boldLeft}********* PASSED TEST CASES *****************${boldRight}`);
    console.log(`Total No Of Tests ${boldLeft}PASSED: ${passedCount}${boldRight}`);
    console.log(passedTable.toString());
    console.log(lineBreak);

    // updateMongoDb(runInfo, settings.shieldRunSettings.RCAutomationToolHost, settings.shieldRunSettings.RCAutomationToolPort);
    if (!isPrivateRun && !isHourlyRun) {
        // Promise.all([
        //     webDriverIOsetup.callAPI(settings.shieldRunSettings.RCAutomationToolHost, "/updateinfo4builds", "PUT", "", runInfo, settings.shieldRunSettings.RCAutomationToolPort, false).catch((e) => console.log("Catch", e)),
        //     updateDB(process.env.runId, totalCount).catch((e) => console.log("Catch", e))
        // ]).then(res => {
        //     if (res[0])
        //         console.log("-RCAutomationTool- sent build test info to RCAutomationTool: ", res[0]);
        //     if (res[1]) {
        //         console.log(res[1]);
        //     }
        //     if (callback && typeof callback === "function") {
        //         callback(exitCode);
        //     }
        // });
    } else if (callback && typeof callback === "function") {
        callback(exitCode);
    }
}

function killProcess(exitCode) {
    // node.exe processes still exist after run finished on Windows OS. Kill them to unblock the Shield Folder.
    console.log("Start kill Process.");
    if (process.platform === "win32") {
        const workingDic = process.cwd().replace(new RegExp("\\\\", "g"), "\\\\");
        const cp = require("child_process");
        cp.exec(
            "wmic process where (name='node.exe' and commandline like \"%" + workingDic + '%") call terminate',
            function(error, stdout, stderr) {
                if (error !== null) {
                    console.log("kill node error: " + error);
                }
                process.exit(exitCode);
            }
        );
    } else {
        process.exit(exitCode);
    }
}

function done(err, results) {
    if (err) {
        console.error("\nShield stopped due to error: " + err);
        process.exit();
    } else {
        reporter(results, killProcess);
    }
}

function runStart(args, callback) {
    let env;
    if (args.env && typeof args.env === "string") {
        env = args.env;
        process.env.deployment = env.substr(0, env.indexOf("-"));
        process.env.device = env.substr(env.indexOf("-") + 1);
    } else if (args.deployment && args.device) {
        env = args.deployment + "-" + args.device;
        argv.push("--env", env);
        process.env.deployment = args.deployment;
        process.env.device = args.device;
    }  else {
        process.env.tag = args.tag;
    }
    // Begin.
    groupify(args, callback);
}

if (require.main === module) {
    runStart(minimist(argv), done);
}
