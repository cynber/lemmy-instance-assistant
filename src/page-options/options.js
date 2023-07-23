document.addEventListener('DOMContentLoaded', () => {
    const settingsButton = document.getElementById('settings-button');

    settingsButton.addEventListener('click', () => {
        browser.tabs.create({ url: '../page-settings/settings.html' });
    });
});