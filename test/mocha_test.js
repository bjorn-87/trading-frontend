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
const until = webdriver.until;


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

async function loginToPage() {
    await browser.findElement(By.id("email")).then(function(element) {
        element.sendKeys("test@bjos19.me");
    });

    await browser.findElement(By.id("password")).then(function(element) {
        element.sendKeys("test");
    });

    await browser.findElement(By.id("subBtn")).then(function(element) {
        element.submit().takeScreenshot();
    });
}

// Does not work with WSL!! Use cygwin

// Test suite
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
            .setChromeOptions(new chrome.Options().headless())
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
        browser.getTitle().then(function(title) {
            assert.equal(title, "CandyExchange");
        });

        matchUrl("");

        done();
    });

    test.it("Test go to register", function(done) {

        goToNavLink("Register");

        // get h2 text
        assertElementByCss("h2", "Registrera användare");
        //
        // check that the first label is E-post
        assertElementByCss("label", "E-Post");
        //
        matchUrl("register");

        done();
    });

    test.it("Test go to Login and then back to index", async function(done) {
        // try use nav link
        goToNavLink("Login");

        await loginToPage();
        // await browser.wait(until.elementLocated(By.css('h1')), 30000);
        goToNavLink("CandyExchange");

        goToNavLink("My page");

        assertElementByCss("h1", "My page");

        // await assertElementByCss("h3", "User: test@bjos19.me");
        // await matchUrl("mypage");
        //
        //
        // assertElementByCss("h1", "Candy Stock");
        //
        // matchUrl("");

        done();
    });

    test.it("Test go to Admin and then back to Me", function(done) {
        // try use nav link
        goToNavLink("Login");

        assertElementByCss("h2", "Logga in");

        matchUrl("login");

        goToNavLink("CandyExchange");

        assertElementByCss("h1", "Candy stock");

        matchUrl("");

        done();
    });
});
