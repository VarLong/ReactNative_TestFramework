const expect = require('chai').expect;
const inventoryPage = require('../../lib/page-objects/InventoryPage');
const reporter = require('../../lib/custom-reporter/Reporter');
import allureReporter from '@wdio/allure-reporter';


describe('Adding items to cart For', function () {
    afterEach("reset app state", function () {
        $(".bm-burger-button").click();
        $("#reset_sidebar_link").click();
        $(".bm-cross-button").click();
    });

    afterEach("after all test case", function () {
        reporter.outputShieldLog();
    });

    it("add one item to cart", function () {
        inventoryPage.open();
        inventoryPage.addItem();
        allureReporter.addFeature('Feature');
        expect(inventoryPage.numberOfItemsInCart()).to.equal("1");
    });

    it("adds two items to cart", function () {
        inventoryPage.open();
        inventoryPage.addItem();
        inventoryPage.addItem();
        expect(inventoryPage.numberOfItemsInCart()).to.equal("2");
    });
});