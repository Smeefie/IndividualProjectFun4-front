module.exports = {
    'Login for NightWatchUser': function(browser) {
        browser
        //.url(browser.launchUrl+'movies/')
            .init()
            .waitForElementVisible('body')
            .assert.titleContains('Toephulp')
            .assert.visible('input[name=email]')
            .setValue('input[name=email]', 'NightWatchUser@mail.com')
            .assert.visible('input[name=password]')
            .setValue('input[name=password]', 'secret')
            .assert.visible('button[name=login]')
            .click('button[name=login]')
            .assert.urlContains('/Profile')
            .end();
    }
};