
const contentXpath = `//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.widget.LinearLayout`;
describe("Login BiliBili on Android phone", () => {
    before(() => { });

    after(() => { });

    it("Test Related API 1", () => {
        // select the Android by unique resource-id
        const disagreeButton = $(`//*[@resource-id="tv.danmaku.bili:id/disagree"]`);
        const agreeButton = $(contentXpath + `/*[@resource-id="tv.danmaku.bili:id/agree"]`);
        const contentBox = $(contentXpath);
        console.log(agreeButton);

        const agreeText = agreeButton.getText();
        console.log(agreeText);

        contentBox.waitForDisplayed();
        disagreeButton.waitForDisplayed();
        disagreeButton.click();
        driver.pause(5000);
    });
    it("Test Related API 2", () => {
    });
});
