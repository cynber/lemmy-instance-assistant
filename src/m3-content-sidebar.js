// ========================================================================================== //
// Injects buttons and links into the sidebar of Lemmy communities and posts.                 //
// ========================================================================================== //

setTimeout(() => {

    const CURRENT_HOST = new URL(window.location.href).hostname;
    const CURRENT_PATH = new URL(window.location.href).pathname;
    let HOME_INSTANCE_HOST = null;
    let myHomeInstance = null;

    // Only run on community pages (/c/ or /m/) and post pages (/post/)
    if (CURRENT_PATH.includes("/c/") || CURRENT_PATH.includes("/m/")
        //|| CURRENT_PATH.includes("/post/")
    ) {

        async function loadSelectedInstance() {

            // ------ Set up general variables ------ //
            const { selectedInstance } = await chrome.storage.local.get('selectedInstance');
            const { selectedType } = await chrome.storage.local.get('selectedType');
            const { settingShowSidebar } = await browser.storage.local.get('settingShowSidebar');
            let communityPrefix = (selectedType) ? (selectedType === "lemmy" ? "/c/" : "/m/") : "/c/";
            HOME_INSTANCE_HOST = selectedInstance ? new URL(selectedInstance).hostname : null;
            myHomeInstance = selectedInstance;

            let isHomeInstance = HOME_INSTANCE_HOST === CURRENT_HOST;
            let isLemmy = CURRENT_PATH.includes("/c/");
            let isLemmyPost = CURRENT_PATH.includes("/post/");
            let isKbin = CURRENT_PATH.includes("/m/");

            // --------- Set up injectables --------- //
            let createButton = (text) => {
                const button = document.createElement('button');
                button.setAttribute('type', 'button');
                button.textContent = text;
                button.setAttribute('id', 'instance-assistant-sidebar');
                return button;
            };

            const createMessage = (text) => {
                const paragraph = document.createElement('p');
                paragraph.style.cssText = `font-size: 0.8rem; color: #939496;`;
                paragraph.innerHTML = text;
                paragraph.setAttribute('id', 'instance-assistant-sidebar');
                return paragraph;
            };

            const createDropdown = (text, options) => {
                const container = document.createElement('div');
                const dropdownText = document.createElement('p');
                const dropdownList = document.createElement('ul');
                dropdownText.innerHTML = "▼ " + text + " ▼";
                dropdownText.style.cssText = `cursor: pointer; font-size: 0.8rem; color: #939496;; text-decoration: underline;`;
                dropdownList.style.cssText = `list-style: none; padding: 0; margin: 0; font-size: 0.8rem; color: #939496;`;

                dropdownList.style.display = 'none';
                dropdownText.addEventListener('click', () => {
                    dropdownList.style.display = dropdownList.style.display === 'none' ? 'block' : 'none';
                    dropdownText.innerHTML = dropdownList.style.display === 'none' ? "▼ " + text + " ▼" : "▲ " + text + " ▲";
                });

                options.forEach((option) => {
                    const listItem = document.createElement('li');
                    listItem.innerHTML = option;
                    listItem.style.cssText = `padding: 0.5rem 0rem;`;
                    dropdownList.appendChild(listItem);
                });

                container.appendChild(dropdownText);
                container.appendChild(dropdownList);
                return container;
            };

            let btnRedirectKbin = createButton('Open in my home instance');
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
            btnRedirectKbin.style.backgroundColor = '#5f35ae';

            let btnRedirectLemmy = createButton('Open in my home instance');
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
            btnRedirectLemmy.style.backgroundColor = '#5f35ae';

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

            let txtHomeInstance = myHomeInstance ? createMessage(`Your home instance is <a href="${myHomeInstance}" target="_blank">${myHomeInstance}</a>.`) : createMessage(`You have not set a home instance yet.`);

            const changeInstanceInstructions = [
                '1) Click on the extension icon in the browser toolbar',
                '2) Press "Change my home instance" and type in your home instance URL',
                '3) Press "Toggle home instance type" to switch between "Lemmy" and "Kbin". (default is "Lemmy")',
            ];

            const txtChangeInstance = createDropdown('How to change home instance', changeInstanceInstructions);

            const myPostMessage = createMessage(`Warning: You are on a post page and will be redirected to the main community. (<a href="https://github.com/cynber/lemmy-instance-assistant/wiki/Why-can't-I-jump-to-the-same-post-on-my-home-instance%3F" target="_blank">more information</a>)`)


            // ---------- Set up functions ---------- //
            const URL_PATTERN = /^(http|https):\/\/(?:[\w-]+\.)?[\w.-]+\.[a-zA-Z]{2,}$/;
            let hasSelectedInstance = false;
            chrome.storage.local.get('selectedInstance').then(({ selectedInstance }) => {
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

            // Get community name and source instance
            //    - If on a post page, get from the sidebar
            //    - If on a community page, get from the URL
            if (isLemmyPost) {
                // // If post is not on the current instance
                // const COMMUNITY_LINK = TARGET_ELEMENT.querySelector('a.community-link');
                // if (COMMUNITY_LINK && COMMUNITY_LINK.getAttribute('title').includes('@')) {
                //     communityName = COMMUNITY_LINK.match(/([^@]+)/)[0]
                //     sourceInstance = CURRENT_HOST

                //     // TODO: Look into grabbing community name & source instance of original post
                //     // sourceInstance = COMMUNITY_LINK.getAttribute('href').substring(3).match(/@([^/]+)/)[1]

                //     // If post is on the current instance
                // } else {
                //     communityName = COMMUNITY_LINK.getAttribute('href').substring(3)
                //     sourceInstance = CURRENT_HOST
                // }
            } else if (isLemmy || isKbin) {
                communityName = CURRENT_PATH.match(/\/[cm]\/([^/@]+)/)[1];
                sourceInstance = CURRENT_PATH.includes("@") ?
                    CURRENT_PATH.match(/\/[cm]\/[^/@]+@([^/]+)/)[1] : CURRENT_HOST;
            }


            // --------- Add Event Listeners -------- //
            btnRedirectLemmy.addEventListener('click', () => {
                if (hasSelectedInstance) {
                    chrome.storage.local.get('selectedInstance').then(({ selectedInstance }) => {
                        const redirectURL = selectedInstance + communityPrefix + communityName + '@' + sourceInstance;
                        window.location.href = redirectURL;
                    });
                } else { alert('No valid instance has been set.') }
            });

            btnRedirectKbin.addEventListener('click', () => {
                if (hasSelectedInstance) {
                    chrome.storage.local.get('selectedInstance').then(({ selectedInstance }) => {
                        const redirectURL = selectedInstance + communityPrefix + communityName + '@' + sourceInstance;
                        window.location.href = redirectURL;
                    });
                } else { alert('No valid instance has been set.') }
            });


            // ---------- Append elements ----------- //
            if (!document.querySelector('#instance-assistant-sidebar') && settingShowSidebar) { // Prevent duplicate elements
                if ((isLemmy) && !isHomeInstance) {
                    TARGET_ELEMENT.appendChild(btnRedirectLemmy);
                    TARGET_ELEMENT.appendChild(txtHomeInstance);
                    TARGET_ELEMENT.appendChild(txtChangeInstance);
                }
                if (isKbin && !isHomeInstance) {
                    TARGET_ELEMENT.appendChild(btnRedirectKbin);
                    TARGET_ELEMENT.appendChild(txtHomeInstance);
                    TARGET_ELEMENT.appendChild(txtChangeInstance);
                }
                // if (isLemmyPost) {
                //     TARGET_ELEMENT.appendChild(myPostMessage);
                // }
            }
        }
        loadSelectedInstance();
    }
}, "500");
