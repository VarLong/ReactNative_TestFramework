import LandingPage from "../../lib/pages/LandingPage";

describe("Login Reach Client on Android phone", () => {
    before(() => {});

    after(() => {});

    it("should be able login successfully", () => {
        // can not get the React props and/or state.
        // const myCmp = browser.react$("MFImage");
        // const myCmp = browser.react$("RCTImageView");
        // myCmp.waitForDisplayed();

        // Locator Strategy 'link text' is not supported for this session
        // $("=Continue").waitForDisplayed();

        LandingPage.login();
    });
});
