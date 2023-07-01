document.addEventListener('DOMContentLoaded', () => {
    const instanceInput = document.getElementById('instance-input');
    const saveButton = document.getElementById('save-button');

    saveButton.addEventListener('click', () => {
        const newInstance = instanceInput.value.trim();
        const urlPattern = /^(http|https):\/\/(?:[\w-]+\.)?[\w.-]+\.[a-zA-Z]{2,}$/;
        if (!urlPattern.test(newInstance)) {
            alert('Invalid URL format, please enter a valid URL. \n (e.g. https://lemmy.ca)');
            return;
        }

        browser.storage.local.set({
            selectedInstance: newInstance,
        }, () => { alert('Home instance value saved successfully!'); });
    });
});