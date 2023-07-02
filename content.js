browser.storage.local.get('selectedInstance').then(({ selectedInstance }) => {
    const CURRENT_HOST = new URL(window.location.href).hostname;
    const CURRENT_PATH = new URL(window.location.href).pathname;

    // Check if on a community page
    if (CURRENT_PATH.includes("/c/") || CURRENT_PATH.includes("/m/") || CURRENT_PATH.includes("/post/")) {

        // Create button
        let goButton = document.createElement('button');
        goButton.setAttribute('type', 'button');
        goButton.textContent = 'Open community in my home instance';
        goButton.style.cssText = `
            padding: .375rem .75rem;
            margin: 1rem 0rem .5rem 0rem;
            width: 100%;
            border: none;
            border-radius: 5px;
            font-weight: 400;
            text-align: center;
            color: white;
        `;
        goButton.style.backgroundColor = '#17305a';

        // Create message
        let message = document.createElement('p');
        message.style.cssText = `font-size: 0.8rem; color: #666;`;
        message.textContent = 'To change your home instance, click on the extension icon in the top right corner of your browser.';

        // Set up variables
        let shouldAppend = true;
        const TARGET_ELEMENT = document.querySelector('.card-body');
        const URL_PATTERN = /^(http|https):\/\/(?:[\w-]+\.)?[\w.-]+\.[a-zA-Z]{2,}$/;
        const SOURCE_INSTANCE = CURRENT_PATH.includes("@") ?
            CURRENT_PATH.match(/\/[cm]\/[^/@]+@([^/]+)/)[1] : CURRENT_HOST;
        const COMMUNITY_NAME = CURRENT_PATH.includes("/post/")
            ? TARGET_ELEMENT.querySelector('a.community-link').getAttribute('href').substring(3)
            : CURRENT_PATH.match(/\/[cm]\/([^/@]+)/)[1];

        // Check if selected instance is valid
        if (selectedInstance && URL_PATTERN.test(selectedInstance)) {

            goButton.addEventListener('click', () => {
                browser.storage.local.get('selectedInstance').then(({ selectedInstance }) => {
                    const redirectURL = selectedInstance + '/c/' + COMMUNITY_NAME + '@' + SOURCE_INSTANCE;
                    window.location.href = redirectURL;
                });
            });

            // If selected instance is the same as current instance, don't append button or message
            const HOME_INSTANCE_HOST = selectedInstance ? new URL(selectedInstance).hostname : CURRENT_HOST;
            (HOME_INSTANCE_HOST == CURRENT_HOST) ? shouldAppend = false : shouldAppend = true;

        } else {
            goButton.addEventListener('click', () => {
                alert('You have not selected a valid instance. Please select an instance by clicking the extension popup.');
            });
        }

        // Append button and message if selected instance is not the same as current instance
        if (shouldAppend) {
            TARGET_ELEMENT.appendChild(goButton);
            TARGET_ELEMENT.appendChild(message);
        }
    }
});