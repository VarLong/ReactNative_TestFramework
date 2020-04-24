import LandingPage from "../../lib/pages/LandingPage";

describe("Login Reach Client on Chrome browser", () => {
    const Tags = ["CI"];
    before(() => {
        console.log("-------------suite before");
    });

    after(() => {
        console.log("-------------suite after");
    });

    it("should be able login successfully", () => {
        LandingPage.login();
    });

    it("Should verify all hubs are present", () => {
        browser.pause(5000);
        LandingPage.scroll();
        browser.pause(2000);
        LandingPage.clickHub("ON DEMAND");
        browser.pause(3000);
        LandingPage.clickMovie();
        LandingPage.verifyDetailsPage();
    });
});
