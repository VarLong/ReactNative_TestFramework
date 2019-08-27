const expect = require('chai').expect;
const inventoryPage = require('../../lib/page-objects/InventoryPage');


describe('Adding items to cart For Test', function () {
    afterEach("reset app state", function () {
        $(".bm-burger-button").click();
        $("#reset_sidebar_link").click();
        $(".bm-cross-button").click();
    });

    it("add one item to cart", function () {
        inventoryPage.open();
        inventoryPage.addItem();
        expect(inventoryPage.numberOfItemsInCart()).to.equal("1");
    });

    it("adds two items to cart", function () {
        inventoryPage.open();
        inventoryPage.addItem();
        inventoryPage.addItem();
        expect(inventoryPage.numberOfItemsInCart()).to.equal("2");
    });
});