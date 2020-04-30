import LandingPage from "../../lib/pages/LandingPage";
import YourPage2ft from "../../lib/pages/Browser/YourPage2ft";
import MenuBarComponent from "../../lib/pages/Browser/MenuBarComponent";

describe("Login Bilibili on Local Chrome", () => {
    const Tags = ["CI"];
    before(() => { });

    after(() => { });

    it("A", () => {
        LandingPage.login();
    });

    it("B", () => {
        browser.pause(5000);
    });
});
