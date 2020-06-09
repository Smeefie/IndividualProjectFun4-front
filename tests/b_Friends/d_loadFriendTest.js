module.exports = {
    'Load Friend for NightWatchUser': function(browser) {
        browser
        //.url(browser.launchUrl+'movies/')
            .init()
            .waitForElementVisible('body')
            .assert.titleContains('Toephulp')
            .setValue('input[name=email]', 'NightWatchUser@mail.com')
            .setValue('input[name=password]', 'secret')
            .click('button[name=login]')
            .assert.urlContains('/Profile')
            .refresh()
            .useXpath()
            .assert.visible('/html/body/div/div/main/div/div[2]/nav/div[1]/div/a[2]')
            .click('/html/body/div/div/main/div/div[2]/nav/div[1]/div/a[2]')
            .waitForElementVisible('/html/body/div/div/main/div/div[3]/div/div')
            .waitForElementVisible('/html/body/div/div[1]/main/div/div[3]/div/div/div[3]/div[2]')
            .end();
    }
};