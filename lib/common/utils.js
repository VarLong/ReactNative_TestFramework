const JSON5 = require('json5');
const fs = require("fs-extra");

const SELECTORS = {
    ANDROID: {
        TEXT: '*//android.widget.TextView',
        TEXT_FIELD: '*//android.widget.EditText',
    },
    IOS: {
        GENERIC_TEXT: null,
        XPATH_TEXT: '*//XCUIElementTypeStaticText',
        TEXT_FIELD: '*//XCUIElementTypeTextField',
    },
};

const DEFAULT_TIMEOUT = 110000;

class Utils {
    constructor() {
        this.super();
    }

    /**
    * Create a folder by path
    * 
    * @param {string} path 
    */
    static createDir(path) {
        fs.mkdirsSync(path, function (err) {
            if (err) {
                console.error(err);
            }
        });
    }
    /**
    * Get the json5 content
    * 
    * @param {string} pathname 
    */
    static getJSON5ConfigByPath(pathname) {
        try {
            return JSON5.parse(fs.readFileSync(pathname).toString());
        } catch (err) {
            console.error(`Error loading config ${pathname} ${err}`);
            process.exit(9);
        }
    }
    /**
    * Get the text of an element (including all child elements)
    *
    * @param {element} element
    * @param {boolean} isXpath
    *
    * @return {string}
    */
    static getTextOfElement(element, isXpath = false) {
        let visualText;

        try {
            if (driver.isAndroid) {
                visualText = element.$$(SELECTORS.ANDROID.TEXT).reduce((currentValue, el) => `${currentValue} ${el.getText()}`, '');
            } else {
                const iosElement = isXpath ? element.$$(SELECTORS.IOS.XPATH_TEXT) : element;

                if (isXpath) {
                    visualText = element.$$(SELECTORS.IOS.XPATH_TEXT).reduce((currentValue, el) => `${currentValue} ${el.getText()}`, '');
                } else {
                    visualText = iosElement.getText();
                }
            }
        } catch (e) {
            visualText = element.getText();
        }

        return visualText.trim();
    }

    /**
     * Get the time difference in seconds
     *
     * @param {number} start    the time in milliseconds
     * @param {number} end      the time in milliseconds
     */
    static timeDifference(start, end) {
        const elapsed = (end - start) / 1000;
        console.log('elapsed = ', elapsed, ' seconds');
    }
}

module.exports = Utils;