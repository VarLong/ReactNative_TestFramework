import AppScreen from "./AppScreen";

class TabBar extends AppScreen {

    constructor() {
        super("");
    }

    openHome() {
        $('~Home').click();
    }

    openWebView() {
        $('~WebView').click();
    }

    openLogin() {
        $('~Login').click();
    }

    openForms() {
        $('~Forms').click();
    }

    openSwipe() {
        $('~Swipe').click();
    }

    waitForTabBarShown() {
        $('~Home').waitForDisplayed(20000);
    }
}

export default new TabBar();
