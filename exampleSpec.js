'use strict';

describe('Jasmine Reporter Example 1', function() {

    beforeEach( function() {
        // before each contents
    });
    afterEach( function(){
        browser.getCurrentUrl().then(function(actualUrl) {
             global.currentURL = actualUrl;
         });
    });
    
    it('Should Browse To Test URL', function() {
        browser.get(global.baseUrl);
        // fake expectation
        expect('1').toBe('1');
        // fake expectation
        expect('2').toBe('2');
    });

    it('Should wait 5 seconds', function() {
        var headerElement = $("h1");
        headerElement.getText().then(function (content) {
            expect(content).toBe(`Eloquent JavaScript
second edition`);
        });
    });
});         

// it is possible, but not required to add multiple describes to one file.
describe('Jasmine Reporter Example 2', function() {

    beforeEach( function() {
        // before each contents
    });
    afterEach( function(){
        browser.getCurrentUrl().then(function(actualUrl) {
             global.currentURL = actualUrl;
         });
    });
    
    it('Should Browse To Test URL', function() {
        browser.get(global.baseUrl);
        // fake expectation
        expect('1').toBe('1');
        // fake expectation
        expect('2').toBe('1');
    });

});     