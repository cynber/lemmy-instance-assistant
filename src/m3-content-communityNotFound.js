// ========================================================================================== //
// Injects buttons and links into the community not found page to help users find their way. //
// ========================================================================================== //

setTimeout(() => {
    const CURRENT_HOST = new URL(window.location.href).hostname;
    const CURRENT_PATH = new URL(window.location.href).pathname;
    const hasErrorContainer = document.querySelector('.error-page');

    // Only run on community pages (/c/ or /m/)
    if ((CURRENT_PATH.includes("/c/") && CURRENT_PATH.includes("@") && hasErrorContainer)) {

        async function loadSelectedInstance() {

            // ------ Set up general variables ------ //
            const { selectedInstance } = await chrome.storage.local.get('selectedInstance');
            const { selectedType } = await chrome.storage.local.get('selectedType');
            let isLemmy = CURRENT_PATH.includes("/c/");
            let isKbin = CURRENT_PATH.includes("/m/");
            const targetCommunity = CURRENT_PATH.match(/\/c\/(.+?)@/)[1];
            const targetInstance = CURRENT_PATH.match(/@(.+)/)[1];
            let TARGET_ELEMENT = '';

            if (isKbin) {
                // TODO: Add support for KBin as needed
            } else if (isLemmy) {
                TARGET_ELEMENT = document.querySelector('.error-page');
            }


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

            const container = document.createElement('div');
            container.setAttribute('id', 'instance-assistant-sidebar');
            container.style.cssText = `
                background-color: #1f1f1f;
                padding: 10px;
                border-radius: 5px;
                border: 2px solid #2f2f2f;
                margin-bottom: 10px;
                `;

            const txtErrorPage = createMessage(`Did you arrive here from <b>Instance Assistant</b>?  <p style="text-align:left; padding:2rem">The community ` + targetCommunity + ` does not exist on this instance (yet). This can happen if you are the first person to try and open it in this instance. Someone will need to prompt this instance to fetch the community from the original instance. This task can be trigerred by entering the community URL (ex. <code>` + targetInstance + `/c/` + targetCommunity + `</code>) or identifier (ex. <code>!` + targetCommunity + `@` + targetInstance + `</code>) into the search page (<a href="https://join-lemmy.org/docs/users/01-getting-started.html#following-communities">reference</a>). <br/><br/> You can do this by clicking on the button below, and then coming back after some time. Don't worry about the "No results" message, the fetch process would have started in the background. Alternatively, you can copy one of the codes above and do the search manually at <a href="https://` + CURRENT_HOST + `">https://` + CURRENT_HOST + `/search</a>.\n\n You can also just view the community on the foreign instance.</p>`)

            let btnOpenSearchKbin = createButton('Open Search Page');
            btnOpenSearchKbin.style.cssText = `
                padding: 0.75rem;
                margin: 1rem 0rem .5rem 0rem;
                width: 50%;
                height: 100%;
                display: block;
                border: var(--kbin-button-secondary-border);
                text-align: center;
                color: white;
                font-size: 0.85rem;
                font-weight: 400;
                cursor: pointer;
            `;
            btnOpenSearchKbin.style.backgroundColor = '#175a4c';

            let btnHomeKbin = createButton('Go to my home instance');
            btnHomeKbin.style.cssText = `
                padding: 0.75rem;
                margin: 1rem 0rem .5rem 0rem;
                width: 50%;
                height: 100%;
                display: block;
                border: var(--kbin-button-secondary-border);
                text-align: center;
                color: white;
                font-size: 0.85rem;
                font-weight: 400;
                cursor: pointer;
            `;
            btnHomeKbin.style.backgroundColor = '#17305a';

            let btnOpenSearchLemmy = createButton('Trigger a search');
            btnOpenSearchLemmy.style.cssText = `
                padding: .375rem .75rem;
                margin: 0rem 2rem 2rem 2rem;
                width: 50%;
                border: none;
                border-radius: 5px;
                font-weight: 400;
                text-align: center;
                color: white;
            `;
            btnOpenSearchLemmy.style.backgroundColor = '#175a4c';

            let btnHomeLemmy = createButton('Go to my home instance');
            btnHomeLemmy.style.cssText = `
                padding: .375rem .75rem;
                margin: 1rem 2rem .5rem 2rem;
                width: 50%;
                border: none;
                border-radius: 5px;
                font-weight: 400;
                text-align: center;
                color: white;
            `;
            btnHomeLemmy.style.backgroundColor = '#17305a';

            let btnCommunityLemmy = createButton('Open community on foreign instance');
            btnCommunityLemmy.style.cssText = `
                padding: .375rem .75rem;
                margin: 1rem 2rem .5rem 2rem;
                width: 50%;
                border: none;
                border-radius: 5px;
                font-weight: 400;
                text-align: center;
                color: white;
            `;
            btnCommunityLemmy.style.backgroundColor = '#363636';

            let txtHomeInstance = selectedInstance ? createMessage(`Your home instance is <a href="${selectedInstance}" target="_blank">${selectedInstance}</a>.`) : createMessage(`You have not set a home instance yet.`);

            const changeInstanceInstructions = [
                '1) Click on the extension icon in the browser toolbar',
                '2) Press "Change my home instance" and type in your home instance URL',
                '3) Press "Toggle home instance type" to switch between "Lemmy" and "Kbin". (default is "Lemmy")',
            ];

            const txtChangeInstance = createDropdown('How to change home instance', changeInstanceInstructions);

            // --------- Add Event Listeners -------- //
            btnHomeLemmy.addEventListener('click', () => {
                if (selectedInstance) {
                    window.location.href = selectedInstance;
                } else { alert('No valid instance has been set.') }
            });

            btnHomeKbin.addEventListener('click', () => {
                if (selectedInstance) {
                    window.location.href = selectedInstance;
                } else { alert('No valid instance has been set.') }
            });

            btnOpenSearchLemmy.addEventListener('click', () => {
                window.location.href = 'https://' + CURRENT_HOST + '/search?q=' + targetCommunity + '!' + targetCommunity + '%40' + targetInstance + '&type=All&listingType=All&page=1&sort=TopAll';
            });

            btnOpenSearchKbin.addEventListener('click', () => {
                // TODO: add support for kbin search as needed
            });

            btnCommunityLemmy.addEventListener('click', () => {
                window.location.href = 'https://' + targetInstance + '/c/' + targetCommunity;
            });

            
            // ---------- Append elements ----------- //
            if (!document.querySelector('#instance-assistant-sidebar')) { // prevent duplicate elements
                if (isLemmy) {
                    container.appendChild(txtErrorPage);
                    container.appendChild(btnOpenSearchLemmy)
                    container.appendChild(btnCommunityLemmy);
                    container.appendChild(btnHomeLemmy);
                    container.appendChild(txtHomeInstance);
                    container.appendChild(txtChangeInstance);
                }
                // if (isKbin) {
                //   container.appendChild(btnHomeKbin);
                // }
            }
            TARGET_ELEMENT.insertBefore(container, TARGET_ELEMENT.firstChild);
        }
        loadSelectedInstance();
    }
}, "500");
