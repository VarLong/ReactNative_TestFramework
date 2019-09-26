import chai from 'chai';
const expect = chai.expect;
const InventoryPage = require('../pageobjects/inventory.page');
const inventoryPage = new InventoryPage();

describe('Adding items to cart For Test', function() {
// test fdsa 
   afterEach("reset app state", function(){
      $(".bm-burger-button").click();
      $("#reset_sidebar_link").click();
      $(".bm-cross-button").click();
   });

    it("add one item to cart", function() {
       inventoryPage.open();
       inventoryPage.addItem(); 
       expect(inventoryPage.numberOfItemsInCart()).to.equal("1");
    });

    it("adds two items to cart", function() {
       inventoryPage.open();
       inventoryPage.addItem();
       inventoryPage.addItem(); 
       expect(inventoryPage.numberOfItemsInCart()).to.equal("2");
    });
});