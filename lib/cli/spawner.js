const os = require("os"),
    path = require("path"),
    createOutputStream = require("create-output-stream"),
    spawn = require("child_process").spawn,
    SUFFIX = os.platform() === "win32" ? ".cmd" : "",
    testFolder = path.resolve(__dirname, "../../tests"),
    IO_OPTS = { stdio: "inherit" },
    settings = require("../common/settings"),
    _ = require("underscore"),
    webDriverIOsetup = require("../common/setup"),
    FREE_NODE_QUERY_INTERVAL = settings.shieldTimeConfig.FREE_NODE_QUERY_INTERVAL;
let COMMAND = path.resolve(__dirname, "../../../../node_modules/.bin/wdio") + SUFFIX;

function runSpawner(testSuites, args, callback) {
    const wdioConfig = require("../../../../configs/wdio.conf").config;
    // Set default test case retrying
    const maxAttempt = args.retry ? args.retry : 0;
    const children = {};
    let deviceName = "";
    let env = args.env || "";
    COMMAND = path.resolve(__dirname, "../../../../node_modules/.bin/wdio") + SUFFIX;

    testSuites.forEach(function (test) {
        children[test] = { proc: undefined, msg: undefined, code: undefined, sig: undefined, attempt: 0, status: -1 };
    });
    // Getting device name from possible configurations, example: "--env hydra-chrome-win7" or "--deployment devtest --device chrome-win8"
    if (args.device) {
        deviceName = args.device;
        env = args.deployment + "-" + deviceName;
        deployment = args.deployment;
    } else if (args.env) {
        deviceName = args.env
            .split("-")
            .slice(1)
            .join("-");
        deployment = args.env.split("-")[0];
    }
    const params = args._;
    const toRunWithInterval = args.runWithIntervalSeconds;
    const runWithInterval =
        (args.runWithIntervalSeconds && args.runWithIntervalSeconds * 1000) ||
        settings.shieldTimeConfig.MOCK_TEST_INTERVAL;
    const seleniumHost = wdioConfig.hostname.toLowerCase();
    const seleniumPort = wdioConfig.port;
    const desiredCapabilities = wdioConfig.capabilities;
    const testHost =
        seleniumHost.indexOf("127.0.0.1") > -1 || seleniumHost.indexOf("localhost") > -1
            ? testHostType.local
            : seleniumHost.indexOf("10.160.195.243") > -1 || seleniumHost.indexOf("10.160.234.32") > -1
                ? testHostType.browserLab
                : testHostType.deviceLab;

    // The timeout settings is in common/settings.js
    // browserLab test timeout is calculated as labQueueTimeout + testCaseTimeout
    const testCaseTimeOut = args.testTimeout
        ? args.testTimeout
        : testHost === testHostType.browserLab
            ? settings.shieldTimeConfig.labTestTimeout + settings.shieldTimeConfig.labTestTimeout
            : settings.shieldTimeConfig.deviceTestTimeout;

    function exiterFn(name, procStartTime) {
        return function onExit(code, sig) {
            if (children[name].status === 0 || children[name].msg === settings.testResult.pass) {
                console.log("case already finished", name);
                return;
            }

            children[name].startTime = procStartTime;
            children[name].endTime = new Date();
            // pass: code - 0, sig - undefined
            // fail: code - 1, sig - undefined
            // timeout: code - undefined, sig - SIGTERM
            children[name].code = code;
            children[name].sig = sig;
            if (code === 0) {
                // pass
                children[name].status = 0;
                children[name].msg = settings.testResult.pass;
            } else {
                // failed or timeout
                if (sig === "SIGTERM") {
                    children[name].msg = settings.testResult.timeout;
                    children[name].code = -1;
                } else {
                    children[name].msg = settings.testResult.fail;
                }
                children[name].status = maxAttempt >= children[name].attempt ? -1 : 0;
                console.log(new Date(), children[name].msg + " done exe - " + name, code, sig, children[name].attempt);
            }
            // console.debug(children[name].msg + " done exe - " + name);
        };
    }

    // Relay a SIGINT to the child processes.
    process.on("SIGINT", function () {
        console.warn("\nOh noes. Attempting to exit...");
        Object.keys(children).forEach(function (child) {
            try {
                children[child].proc.kill("SIGINT");
            } catch (e) {
                console.log("Attempting to exit:", child, e);
            }
        });
    });

    function logToFiles(proc, testSuite) {
        const handleError = function (e) {
            console.log("wirte stream to log fail - " + e);
        };
        try {
            const relativePath = testSuite.replace(testFolder, "");
            const testPathObj = path.parse(relativePath);
            const logPath = path.resolve(
                `ShieldLog/${process.env.runId}/${relativePath.replace(
                    testPathObj.base,
                    testPathObj.name + "-wdio-" + children[testSuite].attempt + ".log"
                )}`
            );
            const logStream = createOutputStream(logPath);
            // Add stdout to main process
            // proc.stdout.pipe(process.stdout);
            proc.stdout.pipe(logStream).on("error", function (e) {
                handleError(e);
            });
            proc.stderr.pipe(logStream).on("error", function (e) {
                handleError(e);
            });
        } catch (e) {
            handleError(e);
        }
    }

    function spawnWdio(testSuite, vars) {
        let nwParams = ["./configs/wdio.conf.js", "--spec", testSuite, "--round", ++children[testSuite].attempt];
        nwParams = vars ? nwParams.concat(params, vars) : nwParams.concat(params);

        if (children[testSuite].status === 0 || children[testSuite].msg === settings.testResult.pass) {
            console.log("case already finished", testSuite);
            return;
        }

        // Start spawnWdio process
        const procStartTime = new Date();
        const proc = spawn(COMMAND, nwParams);
        children[testSuite].proc = proc;
        children[testSuite].code = undefined;
        children[testSuite].status = 1;
        // IO_OPTS will print out to shield std directly
        logToFiles(proc, testSuite);
        // Set timeout
        setTimeout(function () {
            if (proc) {
                proc.kill();
            }
        }, testCaseTimeOut);
        // var err = "";
        // proc.stderr.on("data", function (data) {
        //     err += data;
        // });
        proc.on("uncaughtException", function (err) {
            console.log("uncaughtException - " + err);
        });
        // Get an exit handler that knows which child it is.
        proc.on("exit", exiterFn(testSuite, procStartTime));
    }

    console.log(
        "###### Tests started. Please go to ShieldLog/" +
        process.env.runId +
        " to check the result after they are done. ######"
    );

    if (testSuites.length === 0) {
        console.log("");
        console.log("Shield summary for run : <b>" + process.env.runId + " </b>");
        console.log("No tests have been found and executed.");
    } else {
        console.log("###### Tests are running on " + deviceName.toUpperCase() + "... ######");
        scheduleJobs();
    }

    function scheduleJobs() {
        if (
            getAllWaitingStatusTests().length + getAllExecutingStatusTests().length === 0 &&
            getAllFinishedStatusTests().length === testSuites.length
        ) {
            console.log("=-=-=-=-=-=-=-=-");
            // The console log below here, would be able to display on tfs build result page
            console.log(`Total time for waiting free nodes: ${overallWaitingTime / 1000} seconds`);
            // It"s over Johnny.
            callback(undefined, children);
        } else {
            if (getAllWaitingStatusTests().length > 0) {
                getFreeNode().then((nodeCount) => {
                    console.log("get free node number: " + nodeCount);
                    if (nodeCount > 0) {
                        pushTestJobs(toRunWithInterval ? 1 : nodeCount);
                    }
                }, (e) => {
                    console.log(`-selenium- api call failed: ${e}`);
                });
            }
            // query selenium for free node every `FREE_NODE_QUERY_INTERVAL` secs
            setTimeout(
                () => {
                    scheduleJobs();
                },
                toRunWithInterval ? runWithInterval : FREE_NODE_QUERY_INTERVAL
            );
        }
    }

    function getFreeNode() {
        return new Promise(function (resolve, reject) {
            resolve(1)
        });
    }

    function pushTestJobs(nodeCount) {
        // get the waiting status tests to full fill the free node.
        const toBePushedTests = getAllWaitingStatusTests().slice(0, nodeCount);
        toBePushedTests.forEach(function (testSuite) {
            spawnWdio(testSuite);
        });
    }

    function getAllWaitingStatusTests() {
        return getTestsByStatus(-1);
    }
    function getAllExecutingStatusTests() {
        return getTestsByStatus(1);
    }
    function getAllFinishedStatusTests() {
        return getTestsByStatus(0);
    }
    function getTestsByStatus(status) {
        return Object.keys(children).filter((item) => children[item].status === status);
    }
}
module.exports = runSpawner;
