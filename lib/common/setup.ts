/**
 *  Functions related to setup: logging in and out, etc.
 */

const querystring = require("querystring");

export function begin(browser: any) {

}

export function end(browser: any, callback: Function) {
    console.log("Get the sessionId: " + browser.sessionId);
    const sendLogs = (callback: Function) => {
        callback && typeof callback === "function" && callback();
    };
    sendLogs(callback);
}

export function callAPI(
    host: string,
    endpoint: string,
    method: string,
    key: string = "",
    data: Object = {},
    port?: number,
    isHttps: boolean = true
) {
    return new Promise(function (resolve: any, reject: any) {
        const dataString = JSON.stringify(data);
        let headers = {};
        if (method === "GET") {
            endpoint += "?" + querystring.stringify(data);
        } else {
            headers = {
                "Content-Type": "application/json",
                "Content-Length": dataString.length,
            };
        }
        const options = {
            host: host,
            port: port,
            path: endpoint,
            method: method,
            auth: key,
            headers: headers,
        };
        const protocol = isHttps ? require("https") : require("http");
        const req = protocol.request(options, function (res: any) {
            // reject on bad status
            if (res.statusCode < 200 || res.statusCode >= 300) {
                const errCode = new Error("statusCode=" + res.statusCode);
                return reject(errCode);
            }
            res.setEncoding("utf-8");
            let responseString = "";
            res.on("data", function (data: any) {
                responseString += data;
            });
            res.on("end", function () {
                resolve(responseString);
            });
        });
        req.on("error", function (e: Error) {
            reject(e);
        });
        if (dataString) {
            req.write(dataString);
        }
        req.end();
    });
}

// get current date time, if the timestamp was empty;
export function getFormattedDateTime(timestamp?: number) {
    // multiplied by 1000 so that the argument is in milliseconds, not seconds.
    const date = timestamp ? new Date(timestamp * 1000) : new Date();
    const hours = ("0" + date.getHours()).substr(-2);
    const minutes = ("0" + date.getMinutes()).substr(-2);
    const seconds = ("0" + date.getSeconds()).substr(-2);
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    return month + "/" + day + "/" + year + " " + hours + ":" + minutes + ":" + seconds;
}
