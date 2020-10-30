/**
 * Test for getting started with Selenium.
 */
"use strict";

const assert = require("assert");
const test = require("selenium-webdriver/testing");
const webdriver = require("selenium-webdriver");
const firefox = require('selenium-webdriver/firefox');
const chrome = require('selenium-webdriver/chrome');
const By = webdriver.By;

let browser;

function goToNavLink(target) {
    browser.findElement(By.linkText(target)).then(function(element) {
        element.click();
    });
}

function matchUrl(target) {
    browser.getCurrentUrl().then(function(url) {
        assert.ok(url.endsWith("/" + target));
    });
}

function assertElementByCss(elemnt, target) {
    browser.findElement(By.css(elemnt)).then(function(element) {
        element.getText().then(function(text) {
            assert.equal(text, target);
        });
    });
}

function loginToPage() {
    browser.findElement(By.id("email")).then(function(element) {
        element.sendKeys("test@bjos19.me");
    });

    browser.findElement(By.id("password")).then(function(element) {
        element.sendKeys("test");
    });

    browser.findElement(By.id("subBtn")).then(function(element) {
        element.submit();
    });
}

// Does not work with WSL!! Use cygwin

// Test suite firefox (doesnt work for me)
// test.describe("CandyExchange page", function() {
//     test.beforeEach(function(done) {
//         this.timeout(20000);
//         browser = new webdriver.Builder()
//             .withCapabilities(webdriver.Capabilities.firefox())
//             .setChromeOptions(new firefox.Options().headless())
//             .forBrowser('firefox')
//             .build();
//
//         browser.get("http://localhost:3000/");
//         done();
//     });

// Test suite chrome
test.describe("CandyExchange page", function() {
    test.beforeEach(function(done) {
        this.timeout(20000);
        browser = new webdriver.Builder()
            .withCapabilities(webdriver.Capabilities.chrome())
            .setChromeOptions(new chrome.Options().addArguments('log-level=3').headless())
            .forBrowser('chrome')
            .build();

        browser.get("http://localhost:3000/");
        done();
    });

    test.afterEach(function(done) {
        browser.quit();
        done();
    });

    // Test case
    test.it("Test index", function(done) {
        // get the title of the website
        browser.getTitle().then(function(title) {
            assert.equal(title, "CandyExchange");
        });

        // match the url
        matchUrl("");

        done();
    });

    test.it("Test go to register", function(done) {
        // use navlink login
        goToNavLink("Register");

        // get h2 text
        assertElementByCss("h2", "Registrera användare");
        //
        // check that the first label is E-post
        assertElementByCss("label", "E-Post");
        // match the url
        matchUrl("register");

        done();
    });

    test.it("Test go to login and then back to index", function(done) {
        // use navlink login
        goToNavLink("Login");

        // find h2
        assertElementByCss("h2", "Logga in");

        matchUrl("login");

        // use navlink CandyExchange (logo)
        goToNavLink("CandyExchange");

        // find h1
        assertElementByCss("h1", "Candy stock");

        // match the Url
        matchUrl("");

        done();
    });

    test.it("Test to login and see the mypage", function(done) {
        // use navlink login
        goToNavLink("Login");

        // Login to the page
        loginToPage();

        // browser wait for pagereload
        browser.sleep(1000);

        // find h1
        assertElementByCss("h1", "My page");

        // find h3
        assertElementByCss("h3", "User: test@bjos19.me");

        // match the Url
        matchUrl("mypage");

        done();
    });

    test.it("Test login, go to stocks and see buy button", function(done) {
        // use navlink login
        goToNavLink("Login");

        // Login to the page
        loginToPage();

        // browser wait for pagereload
        browser.sleep(1000);

        // use navlink stocks
        goToNavLink("Stocks");

        // browser wait for pagereload
        browser.sleep(3000);

        // find button
        assertElementByCss("button", "Buy");

        //match the Url
        matchUrl("");

        done();
    });
});
