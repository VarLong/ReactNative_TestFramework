export default class BasePage {
    path: string;
    open() {
        browser.url(this.path);
    }
}
