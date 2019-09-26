"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Gestures_1 = __importDefault(require("../helpers/Gestures"));
const tab_bar_1 = __importDefault(require("../screenobjects/components/tab.bar"));
const forms_screen_1 = __importDefault(require("../screenobjects/forms.screen"));
const login_screen_1 = __importDefault(require("../screenobjects/login.screen"));
describe('WebdriverIO and Appium, interacting with form elements,', () => {
    beforeEach(() => {
        tab_bar_1.default.waitForTabBarShown(true);
        tab_bar_1.default.openForms();
        forms_screen_1.default.waitForIsShown(true);
    });
    it('should be able type in the input and validate the text', () => {
        const text = 'Hello, this is a demo app';
        console.log('start record driver!');
        console.log(driver);
        forms_screen_1.default.input.setValue(text);
        expect(forms_screen_1.default.inputTextResult.getText()).toEqual(text);
        /**
         * IMPORTANT!!
         *  Because the app is not closed and opened between the tests
         *  (and thus is NOT starting with the keyboard hidden)
         *  the keyboard is closed here if it is still visible.
         */
        if (driver.isKeyboardShown()) {
            driver.hideKeyboard();
        }
    });
    it('should be able turn on and off the switch', () => {
        expect(forms_screen_1.default.isSwitchActive()).toEqual(false);
        forms_screen_1.default.switch.click();
        expect(forms_screen_1.default.isSwitchActive()).toEqual(true);
        forms_screen_1.default.switch.click();
        expect(forms_screen_1.default.isSwitchActive()).toEqual(false);
    });
    it('should be able select a value from the select element', () => {
        const valueOne = 'This app is awesome';
        const valueTwo = 'webdriver.io is awesome';
        const valueThree = 'Appium is awesome';
        forms_screen_1.default.dropDown.click();
        forms_screen_1.default.picker.selectValue(valueOne);
        expect(forms_screen_1.default.getDropDownText()).toContain(valueOne);
        forms_screen_1.default.dropDown.click();
        forms_screen_1.default.picker.selectValue(valueTwo);
        expect(forms_screen_1.default.getDropDownText()).toContain(valueTwo);
        forms_screen_1.default.dropDown.click();
        forms_screen_1.default.picker.selectValue(valueThree);
        expect(forms_screen_1.default.getDropDownText()).toContain(valueThree);
    });
    it('should be able to open the alert and close it with all 3 buttons', () => {
        Gestures_1.default.checkIfDisplayedWithScrollDown(forms_screen_1.default.activeButton, 2);
        forms_screen_1.default.activeButton.click();
        forms_screen_1.default.alert.waitForIsShown(true);
        expect(login_screen_1.default.alert.text()).toEqual('This button is\nThis button is active');
        forms_screen_1.default.alert.pressButton('Ask me later');
        forms_screen_1.default.alert.waitForIsShown(false);
        forms_screen_1.default.activeButton.click();
        forms_screen_1.default.alert.waitForIsShown(true);
        forms_screen_1.default.alert.pressButton('Cancel');
        forms_screen_1.default.alert.waitForIsShown(false);
        forms_screen_1.default.activeButton.click();
        forms_screen_1.default.alert.waitForIsShown(true);
        forms_screen_1.default.alert.pressButton('OK');
        forms_screen_1.default.alert.waitForIsShown(false);
    });
    it('should be able to determine that the inactive button is inactive', () => {
        Gestures_1.default.checkIfDisplayedWithScrollDown(forms_screen_1.default.inActiveButton, 2);
        // In this case the button can't be asked if it is active or not with
        // `expect(FormScreen.inActiveButton.isEnabled()).toEqual(false);`
        // So use a click and check if shown, make sure the alert is not there
        forms_screen_1.default.alert.waitForIsShown(false);
        forms_screen_1.default.inActiveButton.click();
        // Just wait 1 second to be sure it didn't appear
        driver.pause(1000);
        // Now validate it isn't there
        forms_screen_1.default.alert.waitForIsShown(false);
    });
});
