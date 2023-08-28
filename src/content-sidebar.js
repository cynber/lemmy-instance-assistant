// =========================================================================== //
// Injects buttons and links into the sidebar of Lemmy communities and posts.  //
// =========================================================================== //

setTimeout(() => {
  const pageURL = window.location.href;
  
  if (isLemmyCommunity(pageURL) ||
    isLemmyPost(pageURL) ||
    isKbinCommunity(pageURL) ||
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

      let btnToPostLemmy = createButton('Find in my home instance');
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

      // let btnToPostKbin = createButton('Find in my home instance');
      // btnToPostKbin.style.cssText = `
      //       padding: 0.75rem;
      //       margin: 1rem 0rem .5rem 0rem;
      //       width: 100%;
      //       height: 100%;
      //       display: block;
      //       border: var(--kbin-button-secondary-border);
      //       text-align: center;
      //       color: white;
      //       font-size: 0.85rem;
      //       font-weight: 400;
      //       cursor: pointer;
      //   `;
      // btnToPostKbin.style.backgroundColor = '#27175a';
      

      let txtHomeInstance = selectedInstance ? createMessage(`Home Instance: <a href="${selectedInstance}" target="_blank">${selectedInstance}</a>`) : createMessage(`You have not set a home instance yet.`);

      const changeInstanceInstructions = [
        '1) Click on the extension icon in the browser toolbar',
        '2) Press "Change my home instance" and type in your home instance URL',
        '3) Press "Toggle home instance type" to switch between "Lemmy" and "Kbin". (default is "Lemmy")',
      ];

      const txtChangeInstance = createDropdown('How to change home instance', changeInstanceInstructions);











      const canRedirect = await hasSelectedInstance();
      let TARGET_ELEMENT;
      let redirectURL = '';

      // ---------- Set Target Element -------- //
      switch (true) {
        case isKbinCommunity(pageURL) && !isKbinPost(pageURL):
          TARGET_ELEMENT = document.querySelector('.section.intro') || document.querySelector('#sidebar .magazine .row');
          break;

        case isKbinPost(pageURL):
          TARGET_ELEMENT = document.querySelector('.section.intro') || document.querySelector('#sidebar .magazine .row');
          break;

        case isLemmyCommunity(pageURL) && !isLemmyPost(pageURL):
          TARGET_ELEMENT = document.querySelector('.card-body');
          break;

        case isLemmyPost(pageURL):
          TARGET_ELEMENT = document.querySelector('#sidebarMain').children[0];
          break;

        case isLemmyPhoton() && !isLemmyPhotonPost(pageURL):
          TARGET_ELEMENT = document.querySelector('.hidden.xl\\:block aside').children[2];
          break;

        case isLemmyPhotonPost(pageURL):
          TARGET_ELEMENT = document.querySelector('main.p-3');
          break;

        case isLemmyAlexandrite():
          TARGET_ELEMENT = document.querySelector('.sidebar').children[1];
          break;
      }

      


      // ---------- Add Event Listeners -------- //

      // For community redirects
      if (!(isLemmyPost(pageURL) ||
        isLemmyPhotonPost(pageURL) ||
        isLemmyAlexandritePost(pageURL))) {
        redirectURL = await getCommunityRedirectURL(pageURL);
      }
      function redirectToInstance() {
        canRedirect
          ? window.location.href = redirectURL
          : alert('No valid instance has been set.');
      }

      btnRedirectLemmy.addEventListener('click', redirectToInstance);
      btnRedirectKbin.addEventListener('click', redirectToInstance);
      btnRedirectLemmyAlexandrite.addEventListener('click', redirectToInstance);
      btnRedirectLemmyPhoton.addEventListener('click', redirectToInstance);

      // For post redirects
      btnToPostLemmy.addEventListener('click', async () => {
        if (canRedirect) {

          // prepare variables for fetching
          let og_instance = getRealHostname(pageURL)
          let postId = (window.location.pathname).split('/post/')[1];

          // if on a photon instance, further split the url
          if (isLemmyPhotonPost(pageURL)) {
            postId = window.location.pathname.split('/post/')[1].split('/')[1];
          }

          // fetch the filtered post list from home instance
          const og_Post = await fetchPostFromID("https://"+og_instance, postId);
          const matchingPosts = await fetchPostsFromTitle(selectedInstance, og_Post.post.name);
          const filteredPosts = await filterPostsByPost(og_Post, matchingPosts);

          // if only one post is found, redirect to it
          // else ask if user wants to open all matching posts
          if (filteredPosts.length > 0) {
            console.log(filteredPosts[0]);
            const newPostId = filteredPosts[0].post.id;
            const community = filteredPosts[0].community.name;
            openPostFromID(selectedInstance, newPostId, community);
            //window.location.href = selectedInstance + '/post/' + newPostId;
          } else if (filteredPosts.length > 1) {
            const approve = confirm(filteredPosts.length + ' matching posts were found. Do you want to open them all?');
            if (approve) {
              filteredPosts.forEach(post => {
                console.log(post);
                const community = post.community.name;
                openPostFromID(selectedInstance, post.post.id, community);
                //window.open(selectedInstance + '/post/' + post.post.id);

              });
            }
          } else { alert("Post not found in home instance"); }
        } else { alert('No valid instance has been set.') }
      });

      // btnToPostKbin.addEventListener('click', async () => {
      //   if (canRedirect) {
      //     console
      //     let community;
      //     let instance;
      //     let postID;
      //     const pathParts = window.location.pathname.split('/');
      //     if (pageURL.includes('@')) {
      //       community = pathParts[2];
      //       instance = pathParts[3].split('@')[1];
      //       postID = pathParts[5];
      //     } else {
      //       community = pathParts[2];
      //       instance = window.location.hostname;
      //       postID = pathParts[4];
      //     }
      //     openPostFromID(selectedInstance, postID, community);
      //   }
      // });













      // ---------- Append elements ----------- //            
      if (!document.querySelector('#instance-assistant-sidebar') && (await getSetting('runOnCommunitySidebar')) && !(await isHomeInstance(pageURL))) { // Prevent duplicate elements
        if (isLemmyCommunity(pageURL)) {
          TARGET_ELEMENT.appendChild(btnRedirectLemmy);
          TARGET_ELEMENT.appendChild(txtHomeInstance);
          TARGET_ELEMENT.appendChild(txtChangeInstance);
        }
        if (isLemmyPost(pageURL)) {
          TARGET_ELEMENT.appendChild(btnToPostLemmy);
          TARGET_ELEMENT.appendChild(txtHomeInstance);
          TARGET_ELEMENT.appendChild(txtChangeInstance);
        }
        if (isKbinCommunity(pageURL)) {
          TARGET_ELEMENT.appendChild(btnRedirectKbin);
          TARGET_ELEMENT.appendChild(txtHomeInstance);
          TARGET_ELEMENT.appendChild(txtChangeInstance);
        }
        // if (isKbinPost(pageURL)) {
        //   TARGET_ELEMENT.appendChild(btnToPostKbin);
        //   TARGET_ELEMENT.appendChild(txtHomeInstance);
        //   TARGET_ELEMENT.appendChild(txtChangeInstance);
        // }
        if (isLemmyPhoton() && !isLemmyPhotonPost(pageURL)) {
          if (!document.querySelector('#instance-assistant-sidebar')) {
            containerRedirectLemmyPhoton.appendChild(btnRedirectLemmyPhoton);
            containerRedirectLemmyPhoton.appendChild(txtHomeInstance);
            containerRedirectLemmyPhoton.appendChild(txtChangeInstance);
            TARGET_ELEMENT.appendChild(containerRedirectLemmyPhoton);
          }
        }
        if (isLemmyPhotonPost(pageURL)) {
          TARGET_ELEMENT.insertBefore(btnToPostLemmy, TARGET_ELEMENT.firstChild);
        }
        if (isLemmyAlexandrite() && !isLemmyAlexandritePost(pageURL)) {
          if (!document.querySelector('#instance-assistant-sidebar')) {
            containerRedirectLemmyAlexandrite.appendChild(btnRedirectLemmyAlexandrite);
            containerRedirectLemmyAlexandrite.appendChild(txtHomeInstance);
            containerRedirectLemmyAlexandrite.appendChild(txtChangeInstance);
            TARGET_ELEMENT.appendChild(containerRedirectLemmyAlexandrite);
          }
        }
        if (isLemmyAlexandritePost(pageURL)) {
          TARGET_ELEMENT.appendChild(btnToPostLemmy);
          TARGET_ELEMENT.appendChild(txtHomeInstance);
          TARGET_ELEMENT.appendChild(txtChangeInstance);
        }
      }
    }
    loadSelectedInstance();
  }
}, "800");