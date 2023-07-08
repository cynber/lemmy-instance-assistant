
setTimeout(() => {

    const CURRENT_HOST = new URL(window.location.href).hostname;
    const CURRENT_PATH = new URL(window.location.href).pathname;
    let HOME_INSTANCE_HOST = null;

    // Only run on community pages (/c/ or /m/) and post pages (/post/)
    if (CURRENT_PATH.includes("/c/") || CURRENT_PATH.includes("/m/") || CURRENT_PATH.includes("/post/")) {

        // -------------------------------------- //
        // ------ Set up general variables ------ //
        // -------------------------------------- //
        browser.storage.local.get('selectedInstance').then(({ selectedInstance }) => {

            HOME_INSTANCE_HOST = selectedInstance ? new URL(selectedInstance).hostname : null;
        });

        let isHomeInstance = HOME_INSTANCE_HOST === CURRENT_HOST;
        let isLemmy = CURRENT_PATH.includes("/c/");
        let isLemmyPost = CURRENT_PATH.includes("/post/");
        let isKbin = CURRENT_PATH.includes("/m/");

        let showBtnToLemmy = true;   // default true: append home instance button
        let showBtnToKbin = true;   // default true: append home instance button
        let showRedirectMessage = true;  // default true: append home instance message

        let showBtnToPostLemmy = false;      // default false: do not append home post button
        let showBtnToPostKbin = false;      // default false: do not append home post button
        let showPostMessage = false;     // default false: do not append home post message



        // -------------------------------------- //
        // --------- Set up injectables --------- //
        // -------------------------------------- //

        let createButton = (text) => {
            const button = document.createElement('button');
            button.setAttribute('type', 'button');
            button.textContent = text;
            button.setAttribute('id', 'instance-assistant-sidebar');
            return button;
        };

        const createMessage = (text) => {
            const paragraph = document.createElement('p');
            paragraph.style.cssText = `font-size: 0.8rem; color: #666;`;
            paragraph.innerHTML = text;
            paragraph.setAttribute('id', 'instance-assistant-sidebar');
            return paragraph;
        };

        let btnRedirectKbin = createButton('Open community in my home instance');
        btnRedirectKbin.style.cssText = `
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
        btnRedirectKbin.style.backgroundColor = '#17305a';

        let btnRedirectLemmy = createButton('Open community in my home instance');
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
        btnRedirectLemmy.style.backgroundColor = '#17305a';

        let btnToPostLemmy = createButton('Open post in my home instance');
        btnToPostLemmy.style.cssText = `
            padding: .375rem .75rem;
            margin: 1rem 0rem 0rem 0rem;
            width: 100%;
            border: none;
            border-radius: 5px;
            font-weight: 400;
            text-align: center;
            color: white;
        `;
        btnToPostLemmy.style.backgroundColor = '#27175a';

        const txtChangeInstance = createMessage('To change your home instance, click on the extension icon.');

        const myPostMessage = createMessage(`Warning: <a href="https://github.com/cynber/lemmy-instance-assistant/wiki/Why-can't-I-jump-to-the-same-post-on-my-home-instance%3F" target="_blank">You are currently on a post page.</a>`)



        // -------------------------------------- //
        // ---------- Set up functions ---------- //
        // -------------------------------------- //

        const URL_PATTERN = /^(http|https):\/\/(?:[\w-]+\.)?[\w.-]+\.[a-zA-Z]{2,}$/;
        let hasSelectedInstance = false;
        browser.storage.local.get('selectedInstance').then(({ selectedInstance }) => {
            hasSelectedInstance = (selectedInstance && URL_PATTERN.test(selectedInstance));
        });
        let TARGET_ELEMENT = '';
        let communityName = '';
        let sourceInstance = '';
        let isRepost = false;

        if (isKbin) {
            TARGET_ELEMENT = document.querySelector('.section.intro') || document.querySelector('#sidebar .magazine .row');
        } else if (isLemmy || isLemmyPost) {
            TARGET_ELEMENT = document.querySelector('.card-body');
        }




        // Get community name and source instance, depending on if on a post or community page
        //    - If on a post page, get community name & source instance from the sidebar
        //    - If on a community page
        //          - get community name from the URL

        //    - If on a community page, get source instance from the URL

        if (isLemmyPost) {

            // If post is not on the current instance
            const COMMUNITY_LINK = TARGET_ELEMENT.querySelector('a.community-link');
            if (COMMUNITY_LINK && COMMUNITY_LINK.getAttribute('title').includes('@')) {
                communityName = COMMUNITY_LINK.substring(3).match(/([^@]+)/)[0]
                sourceInstance = CURRENT_HOST

                // TODO: Look into grabbing community name & source instance of original post
                // sourceInstance = COMMUNITY_LINK.getAttribute('href').substring(3).match(/@([^/]+)/)[1]

                // If post is on the current instance
            } else {
                communityName = COMMUNITY_LINK.getAttribute('href').substring(3)
                sourceInstance = CURRENT_HOST
            }
        } else if (isLemmy || isKbin) {
            communityName = CURRENT_PATH.match(/\/[cm]\/([^/@]+)/)[1];
            sourceInstance = CURRENT_PATH.includes("@") ?
                CURRENT_PATH.match(/\/[cm]\/[^/@]+@([^/]+)/)[1] : CURRENT_HOST;
        }



        // -------------------------------------- //
        // --------- Add Event Listeners -------- //
        // -------------------------------------- //

        btnRedirectLemmy.addEventListener('click', () => {
            if (hasSelectedInstance) {
                browser.storage.local.get('selectedInstance').then(({ selectedInstance }) => {
                    const redirectURL = selectedInstance + '/c/' + communityName + '@' + sourceInstance;
                    window.location.href = redirectURL;
                });
            } else { alert('You have not selected a valid instance. Please select an instance by clicking the extension popup.') }
        });

        btnRedirectKbin.addEventListener('click', () => {
            if (hasSelectedInstance) {

                browser.storage.local.get('selectedInstance').then(({ selectedInstance }) => {
                    const redirectURL = selectedInstance + '/c/' + communityName + '@' + sourceInstance;
                    window.location.href = redirectURL;
                });
            } else { alert('You have not selected a valid instance. Please select an instance by clicking the extension popup.') }
        });

        // -------------------------------------- //
        // ---------- Append elements ----------- //
        // -------------------------------------- //


        if (!document.querySelector('#instance-assistant-sidebar')) {
            if ((isLemmy || isLemmyPost) && !isHomeInstance) {
                TARGET_ELEMENT.appendChild(btnRedirectLemmy);
            }
            if (isKbin && !isHomeInstance) {
                TARGET_ELEMENT.appendChild(btnRedirectKbin);
            }
            if ((isLemmy || isLemmyPost || isKbin) && !isHomeInstance) {
                TARGET_ELEMENT.appendChild(txtChangeInstance);
            }
            if (showPostMessage || isLemmyPost) {
                TARGET_ELEMENT.appendChild(myPostMessage);
            }
        }
    }

}, "500");
