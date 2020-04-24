/// <reference path="../../typings/tsd.d.ts" />

// import { CommonActionOn10ft, PconActionOn10ft } from "./CommonActionOn10ft";
// import { DiscoveryService } from "./DiscoveryService";
// import { SubscriberService } from "./SubscriberService";
// import { MockHttps } from "./Mock/mockHttps";
// import { MockFramework } from "./Mock/mockFramework";
// import { MockMode } from "./Mock/MockDefinition";
const LoggerFactory = require("./logger");
const fs = require("fs");
const https = require("https");
const util = require("util");
const utils = require("./utils");

let featureGroups: any[];
let notificationGroups: any[];
let channelMapGroups: { Id: string, Name: string }[];
let offerGroups: { Data: string, Name: string }[];
let serviceMapGroups: any[];
let envFeatureGroup: any = undefined;
let assignedChannelMap: string = undefined;
let defaultSubscriberRoutingGroup: string = undefined;

let testUser: LogInCredential = undefined;
let testUserId: string = undefined;

let tenantId: string = undefined;
let isTestEnv: boolean = true;

let subscriber_host: string = undefined;
let dvrproxy_host: string = undefined;

// Token to access to subscriber
let token: string = undefined;
let accountId: string = undefined;
let deviceId: string = undefined;
let userCreated = false;

// SSO credential to create an user with
let testSSOId: string = undefined;
let testSSOPassword: string = undefined;

let wdioConfig: any = undefined;
const REQUEST_TIMEOUT = 40000;
const logger = LoggerFactory.getDefInstance();

interface LogInCredential {
    login: string;
    password: string;
}

const onFailed = function (error: any) {
    return new Promise(function (resolve: any, reject: any) {
        logger.info("Promise throwing error : " + error);
        reject(error);
    });
};

module.exports = {
    initializeTestUser: (wdio: any) => {
        wdioConfig = wdio;
        isTestEnv = wdioConfig.test_settings.featureGroups.isTestEnv;
        const tokenRequestParams = {
            hostname: wdioConfig.test_settings.cert_url,
            path: "/certactive",
            method: "GET",
            pfx: fs.readFileSync(wdioConfig.test_settings.cert_path),
            passphrase: wdioConfig.test_settings.cert_passphrase
        };
        return getAuthenticationToken(tokenRequestParams)
            .then(() => {
                new Promise((resolve: any, reject: any) => {
                    resolve();
                });
            }).catch((e) => {
                logger.info(`Create user account error ${e}`);
            });
    },

    cleanupTestUser: () => {
        return new Promise((resolve: any, reject: any) => {
            resolve();
        });
    }
};

function getAuthenticationToken(requestParams: any) {
    return new Promise((resolve: any, reject: any) => {
        logger.info("Getting authentication token");
        const req = https.request(requestParams, (res: any) => {
            if (res.statusCode !== 200) {
                reject(`Unexpected status code ${res.statusCode} while getting authentication token by ${requestParams.hostname + requestParams.path}`);
            }
            let body = "";
            res.on("data", function (data: any) {
                // Assemble response body by listening to "data" event
                body += data;
            });
            res.on("end", function () {
                token = JSON.parse(body).AccessToken;
                logger.info(`Got authentication token!`);
                resolve();
            });
        });
        req.end();
        req.on("error", function (e: any) {
            reject(`Error while getting authentication token by ${requestParams.hostname + requestParams.path}: ${e}`);
        });
    });
}
