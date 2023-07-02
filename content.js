browser.storage.local.get('selectedInstance').then(({ selectedInstance }) => {
    const CURRENT_HOST = new URL(window.location.href).hostname;
    const CURRENT_PATH = new URL(window.location.href).pathname;

    // Check if on a community page
    if (CURRENT_PATH.includes("/c/") || CURRENT_PATH.includes("/m/") || CURRENT_PATH.includes("/post/")) {

        let homeInstanceButton = document.createElement('button');
        homeInstanceButton.setAttribute('type', 'button');
        homeInstanceButton.textContent = 'Open community in my home instance';

        // Create home instance button
        if (CURRENT_PATH.includes("/m/")) {
            homeInstanceButton.style.cssText = `
            padding: 0.75rem;
            margin: 1rem 0rem .5rem 0rem;
            width: 100%;
            height: 100%;
            display: block;
            border: var(--kbin-button-secondary-border);
            text-align: center;
            color: white;
            font-size: 0.85rem;
            font-weight: 400;
            cursor: pointer;
        `;
        } else {
            homeInstanceButton.style.cssText = `
            padding: .375rem .75rem;
            margin: 1rem 0rem .5rem 0rem;
            width: 100%;
            border: none;
            border-radius: 5px;
            font-weight: 400;
            text-align: center;
            color: white;
        `;
        }
        homeInstanceButton.style.backgroundColor = '#17305a';

        // Create home post button
        let homePostButton = document.createElement('button');
        homePostButton.setAttribute('type', 'button');
        homePostButton.textContent = 'Open post in my home instance';
        homePostButton.style.cssText = `
            padding: .375rem .75rem;
            margin: 1rem 0rem 0rem 0rem;
            width: 100%;
            border: none;
            border-radius: 5px;
            font-weight: 400;
            text-align: center;
            color: white;
        `;
        homePostButton.style.backgroundColor = '#27175a';

        // Create instance message
        let instanceMessage = document.createElement('p');
        instanceMessage.style.cssText = `font-size: 0.8rem; color: #666;`;
        instanceMessage.textContent = 'To change your home instance, click on the extension icon in the top right corner of your browser.';

        // Create post message
        let myPostMessage = document.createElement('p');
        myPostMessage.style.cssText = `font-size: 0.8rem; color: #666;`;
        myPostMessage.innerHTML = `Warning: <a href="https://github.com/cynber/lemmy-instance-assistant/wiki/Why-can't-I-jump-to-the-same-post-on-my-home-instance%3F">You are currently on a post page.</a>`;

        // Set up variables
        let displayInstanceButton = true;   // default true: append home instance button
        let displayInstanceMessage = true;  // default true: append home instance message
        let displayPostButton = false;      // default false: do not append home post button
        let displayPostMessage = false;     // default false: do not append home post message
// 
        let TARGET_ELEMENT = '';
        if (CURRENT_PATH.includes("/m/")) {
            if (document.querySelector('.section.intro')) {
                TARGET_ELEMENT = document.querySelector('.section.intro');
            } else {
                TARGET_ELEMENT = document.querySelector('#sidebar .magazine .row');
            }
        } else {
            TARGET_ELEMENT = document.querySelector('#sidebarMain .card-body');
        }

        const URL_PATTERN = /^(http|https):\/\/(?:[\w-]+\.)?[\w.-]+\.[a-zA-Z]{2,}$/;
        let communityName = '';
        let sourceInstance = '';

        // Get community name and source instance, depending on if on a post or community page
        if (CURRENT_PATH.includes("/post/")) {

            displayPostMessage = true;

            // If post is from a different foreign community
            const COMMUNITY_LINK = TARGET_ELEMENT.querySelector('a.community-link');
            if (COMMUNITY_LINK && COMMUNITY_LINK.getAttribute('title').includes('@')) {
                communityName = COMMUNITY_LINK.substring(3).match(/([^@]+)/)[0]

                // This will grab the community of the current post
                sourceInstance = CURRENT_HOST
                // This will grab the community of the ORIGINAL post, currently not being used
                // sourceInstance = COMMUNITY_LINK.getAttribute('href').substring(3).match(/@([^/]+)/)[1]

            // If post is on the current instance
            } else {
                communityName = COMMUNITY_LINK.getAttribute('href').substring(3)
                sourceInstance = CURRENT_HOST
            }

        // If on a community page (/c/ or /m/)
        } else {
            communityName = CURRENT_PATH.match(/\/[cm]\/([^/@]+)/)[1];
            sourceInstance = CURRENT_PATH.includes("@") ?
                CURRENT_PATH.match(/\/[cm]\/[^/@]+@([^/]+)/)[1] : CURRENT_HOST;
        }

        // Check if selected instance is valid
        if (selectedInstance && URL_PATTERN.test(selectedInstance)) {

            // If selected instance is the same as current instance, don't append button or message
            const HOME_INSTANCE_HOST = selectedInstance ? new URL(selectedInstance).hostname : CURRENT_HOST;
            (HOME_INSTANCE_HOST == CURRENT_HOST) ? displayInstanceButton = false : displayInstanceButton = true;

            homeInstanceButton.addEventListener('click', () => {
                browser.storage.local.get('selectedInstance').then(({ selectedInstance }) => {
                    const redirectURL = selectedInstance + '/c/' + communityName + '@' + sourceInstance;
                    window.location.href = redirectURL;
                });
            });

            
            const FEDI_BUTTON = document.querySelector('a.btn.btn-sm.btn-animate.text-muted.py-0');
            if (FEDI_BUTTON && FEDI_BUTTON.hasAttribute('href')) {
                const HOME_POST_URL = new URL(FEDI_BUTTON.getAttribute('href'));
                if (HOME_POST_URL.hostname == HOME_INSTANCE_HOST) {
                    homePostButton.addEventListener('click', () => {
                        window.location.href = HOME_POST_URL;
                    });
                    displayPostButton = true;
                }
            }

        } else {
            homeInstanceButton.addEventListener('click', () => {
                alert('You have not selected a valid instance. Please select an instance by clicking the extension popup.');
            });
        }

        // Append button and message if selected instance is not the same as current instance
        if (displayPostButton) {
            TARGET_ELEMENT.appendChild(homePostButton);
        }
        if (displayInstanceButton) {
            TARGET_ELEMENT.appendChild(homeInstanceButton);
        }
        if (displayInstanceMessage) {
            TARGET_ELEMENT.appendChild(instanceMessage);
        }
        if (displayPostMessage) {
            TARGET_ELEMENT.appendChild(myPostMessage);
        }
    }
});