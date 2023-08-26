// =========================================================================== //
// Injects buttons and links into the sidebar of Lemmy communities and posts.  //
// =========================================================================== //

setTimeout(() => {
    if (isLemmyCommunity(window.location.href) ||
        isLemmyPost(window.location.href) ||
        isKbinCommunity(window.location.href) ||
        isLemmyPhoton() ||
        isLemmyAlexandrite()) {

        async function loadSelectedInstance() {

            const selectedInstance = await getSetting('selectedInstance');

            // ====================================== //
            // --------- Set up injectables --------- //
            // ====================================== //

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

            let btnRedirectLemmyAlexandrite = createButton('Open in my home instance');
            btnRedirectLemmyAlexandrite.style.cssText = `
            padding: .375rem .75rem;
            margin: 1rem 0rem .5rem 0rem;
            width: 60%;
            border: none;
            border-radius: 5px;
            font-weight: 400;
            text-align: center;
            color: white;
        `;
            btnRedirectLemmyAlexandrite.style.backgroundColor = '#5f35ae';

            let containerRedirectLemmyAlexandrite = document.createElement('div');
            containerRedirectLemmyAlexandrite.setAttribute('id', 'instance-assistant-sidebar');
            containerRedirectLemmyAlexandrite.style.cssText = `
                background-color: #19101e;
                padding: 0.5rem;
                border-radius: 5px;
                margin: 0.5rem 0rem 0.5rem 0rem;
                text-align: center;
                `;

            let btnRedirectLemmyPhoton = createButton('Open in my home instance');
            btnRedirectLemmyPhoton.style.cssText = `
            padding: .375rem .75rem;
            margin: .5rem 0rem .5rem 0rem;
            width: 100%;
            border: none;
            border-radius: 5px;
            font-weight: 400;
            text-align: center;
            color: white;
        `;
            btnRedirectLemmyPhoton.style.backgroundColor = '#5f35ae';

            let containerRedirectLemmyPhoton = document.createElement('div');
            containerRedirectLemmyPhoton.setAttribute('id', 'instance-assistant-sidebar');
            containerRedirectLemmyPhoton.style.cssText = `
                background-color: #18181b;
                padding: 10px;
                border-radius: 5px;
                border-color: #232326;
                border-width: 1px;
                margin: 0.5rem -1rem 0.5rem 0rem;
                `;

            let btnToPostLemmy = createButton('Open in my home instance');
            btnToPostLemmy.style.cssText = `
            padding: .375rem .75rem;
            margin: 1rem 0rem .5rem 0rem;
            width: 100%;
            border: none;
            border-radius: 5px;
            font-weight: 400;
            text-align: center;
            color: white;
        `;
            btnToPostLemmy.style.backgroundColor = '#27175a';

            let txtHomeInstance = selectedInstance ? createMessage(`Home Instance: <a href="${selectedInstance}" target="_blank">${selectedInstance}</a>`) : createMessage(`You have not set a home instance yet.`);

            const changeInstanceInstructions = [
                '1) Click on the extension icon in the browser toolbar',
                '2) Press "Change my home instance" and type in your home instance URL',
                '3) Press "Toggle home instance type" to switch between "Lemmy" and "Kbin". (default is "Lemmy")',
            ];

            const txtChangeInstance = createDropdown('How to change home instance', changeInstanceInstructions);

            // ---------- Set up functions ---------- //
            if (isKbinCommunity(window.location.href)) {
                TARGET_ELEMENT = document.querySelector('.section.intro') || document.querySelector('#sidebar .magazine .row');
            } else if (isLemmyCommunity(window.location.href)) {
                TARGET_ELEMENT = document.querySelector('.card-body');
            } else if (isLemmyPost(window.location.href)) {
                TARGET_ELEMENT = document.querySelector('#sidebarMain').children[0];
            } else if (isLemmyPhoton()) {
                TARGET_ELEMENT = document.querySelector('.hidden.xl\\:block aside').children[2];
            } else if (isLemmyAlexandrite()) {
                TARGET_ELEMENT = document.querySelector('.sidebar').children[1];
            }

            const canRedirect = await hasSelectedInstance();
            let redirectURL = '';

            if (!isLemmyPost(window.location.href)) {
                const redirectURL = await getCommunityRedirectURL(window.location.href);
            } else {
                const redirectURL = await getPostRedirectURL(window.location.href);
            }

            // --------- Add Event Listeners -------- //
            btnRedirectLemmy.addEventListener('click', () => {
                if (canRedirect) {
                    window.location.href = redirectURL;
                } else { alert('No valid instance has been set.') }
            });

            btnToPostLemmy.addEventListener('click', () => {
                if (canRedirect) {


                    // from the meta, get the title
                    // search this instance with that title, then filter the results withthe post ID, and pass that post object to the next function

                    // next function will run a new search. It will search in the home instance using the title, and then filter the results with the other values from the post object

                    const postId = (window.location.pathname).split('/post/')[1];

                    const searchURLPrefix = 'https://' + (window.location.hostname) + "/api/v3/search?q=" + postId + "&sort=hot";

                    console.log(searchURLPrefix);






                } else { alert('No valid instance has been set.') }
            });

            btnRedirectKbin.addEventListener('click', () => {
                if (canRedirect) {
                    window.location.href = redirectURL;
                } else { alert('No valid instance has been set.') }
            });

          btnRedirectLemmyAlexandrite.addEventListener('click', () => {
            if (canRedirect) {
              window.location.href = redirectURL;
            } else { alert('No valid instance has been set.') }
          });

            btnRedirectLemmyPhoton.addEventListener('click', () => {
                if (canRedirect) {
                    window.location.href = redirectURL;
                } else { alert('No valid instance has been set.') }
            });

            const pageURL = window.location.href;

            // ---------- Append elements ----------- //            
            if (!document.querySelector('#instance-assistant-sidebar') && (await getSetting('runOnCommunitySidebar')) && !(await isHomeInstance(pageURL))) { // Prevent duplicate elements
                if (isLemmyCommunity(pageURL)) {
                    TARGET_ELEMENT.appendChild(btnRedirectLemmy);
                    TARGET_ELEMENT.appendChild(txtHomeInstance);
                    TARGET_ELEMENT.appendChild(txtChangeInstance);
                }
                //if (isLemmyPost(pageURL)) {
                //    TARGET_ELEMENT.appendChild(btnToPostLemmy);
                //    TARGET_ELEMENT.appendChild(txtHomeInstance);
                //    TARGET_ELEMENT.appendChild(txtChangeInstance);
                //}
                if (isKbinCommunity(pageURL)) {
                    TARGET_ELEMENT.appendChild(btnRedirectKbin);
                    TARGET_ELEMENT.appendChild(txtHomeInstance);
                    TARGET_ELEMENT.appendChild(txtChangeInstance);
                }
                if (isLemmyPhoton()) {
                  if (!document.querySelector('#instance-assistant-sidebar')) {
                    containerRedirectLemmyPhoton.appendChild(btnRedirectLemmyPhoton);
                    containerRedirectLemmyPhoton.appendChild(txtHomeInstance);
                    containerRedirectLemmyPhoton.appendChild(txtChangeInstance);
                    TARGET_ELEMENT.appendChild(containerRedirectLemmyPhoton);
                  }
                }
                if (isLemmyAlexandrite()) {
                  if (!document.querySelector('#instance-assistant-sidebar')) {
                    containerRedirectLemmyAlexandrite.appendChild(btnRedirectLemmyAlexandrite);
                    containerRedirectLemmyAlexandrite.appendChild(txtHomeInstance);
                    containerRedirectLemmyAlexandrite.appendChild(txtChangeInstance);
                    TARGET_ELEMENT.appendChild(containerRedirectLemmyAlexandrite);
                  }
                }
            }
        }
        loadSelectedInstance();
    }
}, "800");