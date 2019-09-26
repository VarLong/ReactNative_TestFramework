class Page {
    constructor() { }

    get title() { return browser.getTitle(); }

    open(path) {
        console.log(`start open ${path}`);
        browser.url(`/${path}`);
    }

}

module.exports = Page;
