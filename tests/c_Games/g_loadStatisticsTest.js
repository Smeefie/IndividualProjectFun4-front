module.exports = {
    'Load Statistics for NightWatchUser': function(browser) {
        browser
        //.url(browser.launchUrl+'movies/')
            .init()
            .waitForElementVisible('body')
            .assert.titleContains('Toephulp')

        //Login
        .setValue('input[name=email]', 'NightWatchUser@mail.com')
            .setValue('input[name=password]', 'secret')
            .click('button[name=login]')
            .assert.urlContains('/Profile')
            .refresh()
            .useXpath()

        //Navigate to Statistics
        .assert.visible('/html/body/div/div/main/div/div[2]/nav/div[1]/div/a[5]')
            .click('/html/body/div/div/main/div/div[2]/nav/div[1]/div/a[5]')

        //Wait for match history
        .assert.visible('/html/body/div/div/main/div/div[3]/div/div/div/div[2]/div[1]')
            .end();
    }
};