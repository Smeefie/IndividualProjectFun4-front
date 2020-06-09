module.exports = {
    'Create Game for NightWatchUser': function(browser) {
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

        //Navigate to Create game
        .assert.visible('/html/body/div/div/main/div/div[2]/nav/div[1]/div/a[3]')
            .click('/html/body/div/div/main/div/div[2]/nav/div[1]/div/a[3]')
            .assert.visible('//*[@id="roundLimit"]')

        //Add route limit
        .setValue('//*[@id="roundLimit"]', '10')

        //Click to add players
        .click('/html/body/div/div[1]/main/div/div[3]/div/div/div/form[1]/div[2]/div/div/div[1]/div[1]/div[1]')
            .waitForElementVisible('//*[@id="list-item-110-1"]')
            .click('//*[@id="list-item-110-1"]')
            .waitForElementVisible('//*[@id="list-item-110-1"]')
            .click('//*[@id="list-item-110-4"]')

        //Close menu and start game
        .click('/html/body/div/div[1]/main/div/div[3]/div/div/div/form[1]/div[2]/div/div/div[1]/div[1]/div[2]')
            .assert.visible('/html/body/div/div[1]/main/div/div[3]/div/div/div/form[1]/div[3]/button')
            .click('/html/body/div/div[1]/main/div/div[3]/div/div/div/form[1]/div[3]/button')
            .assert.urlContains('/Game')
            .end();
    }
};