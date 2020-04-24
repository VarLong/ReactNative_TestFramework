import LandingPage from "../../lib/pages/LandingPage";
import YourPage2ft from "../../lib/pages/Browser/YourPage2ft";

describe("Login Reach Client on Chrome browser_B", () => {
    const Tags = ["CI"];
    before(() => { });

    after(() => { });

    it("should be able login successfully_Browser", () => {
        console.log(browser.screenshotByElement("Hello", "World!"));
        LandingPage.login();
    });

    it("Should verify all hubs are present_Browser", () => {
        YourPage2ft.verifyMain();
        browser.pause(5000);
    });
});
