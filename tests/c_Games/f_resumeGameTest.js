module.exports = {
    'Resume Game for NightWatchUser': function(browser) {
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

        //Navigate to Match history
        .assert.visible('/html/body/div/div/main/div/div[2]/nav/div[1]/div/a[4]')
            .click('/html/body/div/div/main/div/div[2]/nav/div[1]/div/a[4]')

        //Wait for match history
        .waitForElementVisible('/html/body/div/div/main/div/div[3]/div/div/div/div[2]/div[1]/table/tbody')

        //Resume game
        .assert.visible('/html/body/div/div/main/div/div[3]/div/div/div/div[2]/div[1]/table/tbody/tr/td[5]/button[1]')
            .click('/html/body/div/div/main/div/div[3]/div/div/div/div[2]/div[1]/table/tbody/tr/td[5]/button[1]')
            .assert.urlContains('/Game')
            .end();
    }
};