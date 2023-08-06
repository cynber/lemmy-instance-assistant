// =========================================================================== //
// Injects buttons and links into the sidebar of Lemmy communities and posts.                 //
// =========================================================================== //

setTimeout(() => {
    if (isLemmyCommunity(window.location.href) || isKbinCommunity(window.location.href)) {

        async function loadSelectedInstance() {

            const selectedInstance = await getSetting('selectedInstance');

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

            let txtHomeInstance = selectedInstance ? createMessage(`Your home instance is <a href="${selectedInstance}" target="_blank">${selectedInstance}</a>.`) : createMessage(`You have not set a home instance yet.`);

            const changeInstanceInstructions = [
                '1) Click on the extension icon in the browser toolbar',
                '2) Press "Change my home instance" and type in your home instance URL',
                '3) Press "Toggle home instance type" to switch between "Lemmy" and "Kbin". (default is "Lemmy")',
            ];

            const txtChangeInstance = createDropdown('How to change home instance', changeInstanceInstructions);

            // ---------- Set up functions ---------- //
            if (isKbinCommunity(window.location.href)) {
                TARGET_ELEMENT = document.querySelector('.section.intro') || document.querySelector('#sidebar .magazine .row');
            } else if (isLemmyCommunity(window.location.href) || isLemmyPost(window.location.href)) {
                TARGET_ELEMENT = document.querySelector('.card-body');
            }

            const canRedirect = await hasSelectedInstance();
            const redirectURL = await getCommunityRedirectURL(window.location.href);

            // --------- Add Event Listeners -------- //
            btnRedirectLemmy.addEventListener('click', () => {
                if (canRedirect) {
                    window.location.href = redirectURL;
                } else { alert('No valid instance has been set.') }
            });

            btnRedirectKbin.addEventListener('click', () => {
                if (canRedirect) {
                    window.location.href = redirectURL;
                } else { alert('No valid instance has been set.') }
            });

            // ---------- Append elements ----------- //
            if (!document.querySelector('#instance-assistant-sidebar') && (await getSetting('runOnCommunitySidebar'))) { // Prevent duplicate elements
                const pageURL = window.location.href;
                if (isLemmyCommunity(pageURL) && !(await isHomeInstance(pageURL))) {
                    TARGET_ELEMENT.appendChild(btnRedirectLemmy);
                    TARGET_ELEMENT.appendChild(txtHomeInstance);
                    TARGET_ELEMENT.appendChild(txtChangeInstance);
                }
                if (isKbinCommunity(pageURL) && !(await isHomeInstance(pageURL))) {
                    TARGET_ELEMENT.appendChild(btnRedirectKbin);
                    TARGET_ELEMENT.appendChild(txtHomeInstance);
                    TARGET_ELEMENT.appendChild(txtChangeInstance);
                }
            }
        }
        loadSelectedInstance();
    }
}, "500");