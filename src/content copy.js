browser.storage.local.get('selectedInstance').then(({ selectedInstance }) => {

    const CURRENT_HOST = new URL(window.location.href).hostname;
    const CURRENT_PATH = new URL(window.location.href).pathname;

    // Only run on community pages (/c/ or /m/) and post pages (/post/)
    if (CURRENT_PATH.includes("/c/") || CURRENT_PATH.includes("/m/") || CURRENT_PATH.includes("/post/")) {

        // -------------------------------------- //
        // ---------- Set up variables ---------- //
        // -------------------------------------- //

        const HOME_INSTANCE_HOST = selectedInstance ? new URL(selectedInstance).hostname : null;

        let isPost = CURRENT_PATH.includes("/post/");
        let isHomeInstance = HOME_INSTANCE_HOST === CURRENT_HOST;
        let isLemmy = CURRENT_PATH.includes("/c/");
        let isKbin = CURRENT_PATH.includes("/m/");

        let showBtnToLemmy = true;   // default true: append home instance button    // TODO: check defaults
        let showBtnToKbin = true;   // default true: append home instance button    // TODO: check defaults
        let showRedirectMessage = true;  // default true: append home instance message   // TODO: check defaults
        
        let showBtnToLemmyPost = false;      // default false: do not append home post button// TODO: check defaults
        let showBtnToKbinPost = false;      // default false: do not append home post button// TODO: check defaults
        let showPostMessage = false;     // default false: do not append home post message/ TODO: check defaults

        // -------------------------------------- //
        // ---------- Set up constants ---------- //
        // -------------------------------------- //

        const createButton = (text) => {
            const button = document.createElement('button');
            button.setAttribute('type', 'button');
            button.textContent = text;
            return button;
          };

        const btnRedirectLemmy = createButton('Open community in my home instance');
        const btnRedirectKbin = createButton('Open community in my home instance');

        // Create home instance button
        if (CURRENT_PATH.includes("/m/")) {
            btnRedirectLemmy.style.cssText = `
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
            btnRedirectLemmy.style.cssText = `
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
        btnRedirectLemmy.style.backgroundColor = '#17305a';
        btnRedirectKbin.style.backgroundColor = '#17305a';

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
        instanceMessage.innerHTML = 'To change your home instance, click on the extension icon. (<a href="https://github.com/cynber/lemmy-instance-assistant/wiki/Removing-sidebar-button-and-keeping-popup-option-only" target="_blank">This button may be removed in a future update<a/>)';

        // Create post message
        let myPostMessage = document.createElement('p');
        myPostMessage.style.cssText = `font-size: 0.8rem; color: #666;`;
        myPostMessage.innerHTML = `Warning: <a href="https://github.com/cynber/lemmy-instance-assistant/wiki/Why-can't-I-jump-to-the-same-post-on-my-home-instance%3F" target="_blank">You are currently on a post page.</a>`;

        
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

            isPost = true;
            showPostMessage = true;

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
            (HOME_INSTANCE_HOST == CURRENT_HOST) ? showBtnToLemmy = false : showBtnToLemmy = true;

            btnRedirectLemmy.addEventListener('click', () => {
                browser.storage.local.get('selectedInstance').then(({ selectedInstance }) => {
                    const redirectURL = selectedInstance + '/c/' + communityName + '@' + sourceInstance;
                    window.location.href = redirectURL;
                });
            });

            btnRedirectKbin.addEventListener('click', () => {
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
                    showBtnToLemmyPost = true;
                }
            }

        } else {
            btnRedirectLemmy.addEventListener('click', () => {
                alert('You have not selected a valid instance. Please select an instance by clicking the extension popup.');
            });

            btnRedirectKbin.addEventListener('click', () => {
                alert('You have not selected a valid instance. Please select an instance by clicking the extension popup.');
            });
        }

        // Append button and message if selected instance is not the same as current instance
        // if (showBtnToLemmyPost || isPost) {
        //     TARGET_ELEMENT.appendChild(homePostButton);
        // } // temporarily disabled
        if (isLemmy && showBtnToLemmy && !isHomeInstance) {
            TARGET_ELEMENT.appendChild(btnRedirectLemmy);
        }
        if (isKbin && showBtnToKbin && !isHomeInstance) {
            TARGET_ELEMENT.appendChild(btnRedirectKbin);
        }
        if (showRedirectMessage && !isHomeInstance) {
            TARGET_ELEMENT.appendChild(instanceMessage);
        }
        if (showPostMessage || isPost) {
            TARGET_ELEMENT.appendChild(myPostMessage);
        }
    }
});
