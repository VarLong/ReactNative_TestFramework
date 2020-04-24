const utils = require("../../common/utils");
const util = require("util");
import BasePage from "./BasePage";

class YourPage2ft extends BasePage {
    hubXpath = "//div[contains(@class, 'label') and text() = '%s']/..";
    public verifyMain() {
        console.log(util.format(this.hubXpath, "Demond"));
        $(util.format(this.hubXpath, "Demond")).waitForDisplayed(20000);
    }
}

export default new YourPage2ft();