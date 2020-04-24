import MenuBarComponent from "./Browser/MenuBarComponent";
import YourPage2ft from "./Browser/YourPage2ft";
const userAccountManager = require("../common/userAccountManager");
const url = require("url");
const querystring = require("querystring");

enum URLParameter {
    TLS = "?oauth=endusers",
    SKT = "?oauth=saml",
    CCX = "?oauth=genericendusers",
    LIVE = "?oauth=liveid"
}
class LandingPage {
    config = browser.config;
    // elements on login page when login type is LiveID
    liveIDEmailCss = "[type='email']";
    liveIDPasswordCss = "[type='password']";
    liveIDSigninCss = "#idSIButton9";

    // elements on login page when login type is TestSSO
    testssoUserNameXpath = "[name='UserName']";
    testssoPasswordXpath = "[name='Password']";
    testssoLoginXpath = "input[type='submit'][value='Log in']";

    // elements on login page when login type is TLSsso
    tlsSSOEmailCss = "#username";
    tlsSSOPasswordCss = "#password";
    tlsSSOLoginCss = "button[title='Login']";

    // elements on login page when login type is SKTsso
    sktSSOEmailCss = "#username";
    sktSSOPasswordCss = "#password";
    sktSSOLoginCss = "input[type='submit'][value='Log in']";

    // elements on login page when login type is CCXsso
    ccxSSOEmailXpath = "#idToken1";
    ccxSSOPasswordXpath = "#idToken2";
    ccxSSOLoginCss = "input[type='submit'][value='Log in']";

    hubPath = "//android.widget.TextView";

    movie =
        "/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup[1]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[1]/android.widget.HorizontalScrollView/android.view.ViewGroup/android.view.ViewGroup[1]/android.view.ViewGroup/android.view.ViewGroup/android.widget.ImageView";
    rottenTomatoRating =
        "/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.widget.ImageView[3]";
    popCornRating =
        "/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.widget.ImageView[4]";
    posterImage =
        "/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup[1]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[3]/android.widget.ImageView[1]";
    assetName =
        "/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.widget.TextView[1]";
    genre =
        "/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.widget.TextView[2]";
    description =
        "/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.widget.TextView[3]";
    playMovie =
        "/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup[1]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[3]/android.view.ViewGroup[1]/android.view.ViewGroup";
    yml =
        "/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup[1]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[5]/android.widget.TextView";
    favorite =
        "/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[2]/android.view.ViewGroup";
    element =
        "/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup[1]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[1]/android.widget.TextView";
    public get home() {
        return $("#home");
    }

    public get title() {
        return browser.getTitle();
    }

    public setExtraUrlParams(url: string) {
        // if (extraUrlParams.length > 0) {
        //     const andStr = url.lastIndexOf("redirect_uri") > -1 ? "%26" : "&";

        //     // Use "%3D" in 'redirect_uri'; or replace with "=" in url params
        //     const extraUrlParamsString = url.lastIndexOf("redirect_uri") > -1 ? extraUrlParams.join(andStr) : extraUrlParams.join(andStr).replace(new RegExp("%3D", "gm"), "=");

        //     // tlssso login url has no '?', while testsso and liveid login has '?'
        //     url = url.lastIndexOf("?") > -1 ? (url + andStr + extraUrlParamsString) : (url + "?" + extraUrlParamsString);
        // }

        // if (extraUrlParamsPassedToSTS.length > 0) {
        //     url += (url.lastIndexOf("?") > -1 ? "&" : "?") + extraUrlParamsPassedToSTS.join("&");
        // }
        return url;
    }

    public verifyLogin() {
        // if certificate based login - no additional credentials are required.
        // browser.execute(() => {
        //     return (<any>window).mstv.authentication.accountId;
        // }, [], function (res: any) {
        //     if (res.status === 0 && !!res.value) {
        //         browser.assert.ok(res.value && res.value.length > 0, "User is logged in with account: " + res.value);
        //     }
        //     else {
        //         console.log("User is not authenticated yet.");
        //         this.certificateBasedLogin();
        //     }
        // });

        return this;
    }

    public goToURLTestSSO() {
        const testSsoUrl = url.parse(this.config.test_settings.launch_url);
        const urlParams = querystring.parse(testSsoUrl.query);
        urlParams["oauth"] = "test";
        // forceStubPlayer is required 1. useStubPlayer=true, or, 2. MockMode=true
        // if (config.test_settings.useStubPlayer || process.env.mockMode === MockMode.Mock.toString()) {
        //     urlParams["forceStubPlayer"] = true;
        // }
        testSsoUrl.search = querystring.stringify(urlParams);
        process.env.fullLaunchurl = this.setExtraUrlParams(testSsoUrl.parse("").href);
        browser.url(process.env.fullLaunchurl);
        return this;
    }

    public goToURL(urlParameter: URLParameter) {
        let launchUrl = this.config.test_settings.launch_url + urlParameter;
        launchUrl = this.setExtraUrlParams(launchUrl);
        process.env.fullLaunchurl = launchUrl;
        browser.url(launchUrl);
        return this;
    }

    public LoginWithAccount(userSlelctor: string, passwordSelector: string, loginSelector: string, account: string, password: string) {
        $(userSlelctor).waitForDisplayed();
        $(userSlelctor).setValue(account);
        $(passwordSelector).waitForDisplayed();
        $(passwordSelector).setValue(password);
        $(loginSelector).click();
    }
    public LoginWithLiveAccount(account: string, password: string) {
        $(this.liveIDEmailCss).waitForDisplayed();
        $(this.liveIDEmailCss).setValue(account);
        $(this.liveIDSigninCss).waitForDisplayed();
        $(this.liveIDSigninCss).click();
        $(this.liveIDPasswordCss).waitForDisplayed();
        $(this.liveIDPasswordCss).setValue(password);
        $(this.liveIDSigninCss).click();
    }

    public switchToWebContext() {
        browser.waitUntil(() => {
            return browser.getContexts().some((context: string) => context.indexOf("reactnativeclient") > -1);
        });
        browser.switchContext("WEBVIEW_com.reactnativeclient");
    }

    public loginNoValidation() {
        const loginType = browser.config.test_settings.loginType;
        if (!browser.isAndroid && !browser.isIOS) {
            if (loginType === "TestSSO") {
                const testssologin = userAccountManager.getTestAccount();
                this.goToURLTestSSO().LoginWithAccount(this.testssoUserNameXpath, this.testssoPasswordXpath, this.testssoLoginXpath, testssologin.login, testssologin.password);
            } else {
                this.goToURL(URLParameter.LIVE).LoginWithLiveAccount(this.config.test_settings.testAccountID, this.config.test_settings.testAccountPassword);
            }
        } else {
            this.switchToWebContext();
        }
    }

    public validateLogin() {
        if (browser.isAndroid || browser.isIOS) {
            browser.switchContext("NATIVE_APP");
        }
        MenuBarComponent.verifyMain();
        YourPage2ft.verifyMain();
    }

    public login() {
        this.loginNoValidation();
        this.validateLogin();
    }

    public clickHub(hub: string) {
        $(this.hubPath + "[@text='" + hub + "']").click();
        browser.pause(3000);
    }

    public clickMovie() {
        $(this.movie).click();
        browser.pause(3000);
    }

    public scroll() {
        browser.pause(1000);
        browser.touchAction([
            { action: "press", x: 10, y: 450 },
            { action: "wait", ms: 800 },
            { action: "moveTo", x: 10, y: 10 },
            { action: "release" },
        ]);
    }

    public verifyDetailsPage() {
        browser.pause(3000);
        $(this.playMovie).waitForDisplayed(5000);
        $(this.posterImage).waitForDisplayed(5000);
        // $(this.assetName).waitForDisplayed(5000);
        // $(this.genre).waitForDisplayed(5000);
        // $(this.description).waitForDisplayed(5000);
        // $(this.rottenTomatoRating).waitForDisplayed(5000);
        // $(this.popCornRating).waitForDisplayed(5000);
    }
}

export default new LandingPage();
