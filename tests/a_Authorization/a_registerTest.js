module.exports = {
    'Register for NightWatchUser': function(browser) {
        browser
        //.url(browser.launchUrl+'movies/')
            .init()
            .waitForElementVisible('body')
            .assert.titleContains('Toephulp')
            .assert.visible('button[name=register]')
            .click('button[name=register]')
            .assert.visible('input[name=registerUsername]')
            .setValue('input[name=registerUsername]', 'NightWatchUser')
            .assert.visible('input[name=registerEmail]')
            .setValue('input[name=registerEmail]', 'NightWatchUser@mail.com')
            .assert.visible('input[name=registerPassword]')
            .setValue('input[name=registerPassword]', 'secret')
            .assert.visible('input[name=registerPassword_confirmation]')
            .setValue('input[name=registerPassword_confirmation]', 'secret')
            .assert.visible('button[name=submitRegister]')
            .click('button[name=submitRegister]')
            .assert.urlContains('/Profile')
            .end();
    }
};