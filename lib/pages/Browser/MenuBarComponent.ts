import BasePage from "./BasePage";
class MenuBarComponent extends BasePage {
    mediaroomIconXpath = "//div[@id='mediaroomIcon']";
    public verifyMain() {
        $(this.mediaroomIconXpath).waitForDisplayed(20000);
    }
}

export default new MenuBarComponent();