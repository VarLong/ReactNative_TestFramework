const extend = require("lodash/object/extend");

// Shield options.
const shield = [
    "env",
    "deployment",
    "device",
    "var",
    "retry"
];

// Support Wdio options. Should be kept up to date with new releases.origin addr https://webdriver.io/docs/clioptions.html
const wdioCommandlineOptions = {
    string: [
        "hostname",
        "user",
        "key",
        "logLevel",
        "baseUrl",
        "framework",
        "mochaOpts",
        "jasmineNodeOpts"
    ],
    array: [
        "reporters",
        "suite",
        "spec",
        "exclude"
    ],
    number: [
        "port",
        "bail",
        "waitforTimeout"
    ],
    boolean: ["help", "version", "watch"],
    alias: {
        hostname: "h",
        port: "p",
        user: "u",
        key: "k",
        logLevel: "l",
        waitforTimeout: "w",
        framework: "f",
        reporters: "r"
    },
};

// Expose combined Shield & Wdio options for correct arg parsing.
module.exports = {
    shield: shield,
    nw: wdioCommandlineOptions
};
