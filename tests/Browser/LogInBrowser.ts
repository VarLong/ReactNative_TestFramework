import LandingPage from "../../lib/pages/LandingPage";
import YourPage2ft from "../../lib/pages/Browser/YourPage2ft";
import MenuBarComponent from "../../lib/pages/Browser/MenuBarComponent";

describe("Login Reach Client on Chrome browser_B", () => {
    const Tags = ["CI"];
    before(() => { });

    after(() => { });

    it("should be able login successfully_Browser", () => {
        LandingPage.login();
        MenuBarComponent.verifyMain();
    });

    it("Should verify all hubs are present_Browser", () => {
        YourPage2ft.verifyMain();
        browser.pause(5000);
    });
});
