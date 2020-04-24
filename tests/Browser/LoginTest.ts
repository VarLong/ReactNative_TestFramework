
describe("Login Reach Client on Chrome browser_B", () => {
    const Tags = ["CI"];
    before(() => { });

    after(() => { });

    it("Test Api for WDIO step 1", async () => {
        browser.url("https://www.baidu.com/");
        // Once use await; the $() will return a promise.
        // const headWapper = await $("#head_wrapper");
        // console.log(headWapper);

        // E:\ReactNativeClientApp\shield\node_modules\webdriverio\build\commands\element\waitForDisplayed.js
        $("#head_wrapper").waitForDisplayed();
        $("//input[@id='su']").waitForDisplayed();
        const result = browser.execute((a, b, c) => {
            // const mstv = (<any>window).mstv;
            return a + b + c;
        }, 1, 2, 3);
        console.log("result:");
        console.log(result);
        // done() is necessary in executeAsync.
        // TODO: How to get window
        const resultAsync = browser.executeAsync((done) => {
            // window.alert('aaa');
            done();
        });
        console.log("resultAsync:");
        console.log(resultAsync);

        const callres = browser.call(() => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    console.log("setTimeout----->");
                    resolve();
                }, 5000);
            });
        });
        console.log(callres);

        console.log(browser.getWindowRect());
        console.log(browser.getWindowSize());

        // Appium only. Save a video started by startRecordingScreen command to file.
        // browser.startRecordingScreen();
        // browser.url("https://webdriver.io");
        // browser.saveRecordingScreen('./video.mp4');

        // browser.addLocatorStrategy('myStrat', (selector) => {
        // return (<any>document).querySelectorAll(selector);
        // })
        // const pluginWrapper = browser.custom$$('myStrat', '.pluginWrapper');

        // https://w3c.github.io/webdriver/#keyboard-actions
        browser.keys(["Meta", "a"]);

        // Open new window in browser. This command is the equivalent function to `window.open()`. This command does not work in mobile environments.
        // Core Code: E:\ReactNativeClientApp\shield\node_modules\webdriverio\build\commands\browser\newWindow.js
        browser.newWindow("https://webdriver.io", "WebdriverIO window", "width=420,height=230,resizable,scrollbars=yes,status=1");

        // Creates a new Selenium session with your current capabilities.
        browser.reloadSession();
        browser.url("https://webdriver.io");

        // Core Code: E:\ReactNativeClientApp\shield\node_modules\webdriverio\build\commands\browser\pause.js
        browser.pause(5000);
    });

    it("Test Api for WDIO step 2", () => {
    });
});
