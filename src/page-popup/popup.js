document.addEventListener("DOMContentLoaded", function () {
  async function createPopup() {

    const instanceList = document.getElementById("instance-list"),
      btnChangeInstance = document.getElementById("btn-change-instance"),
      btnChangeType = document.getElementById("btn-change-type"),
      btnRedirect = document.getElementById("btn-redirect-instance"),
      btnOpenSettings = document.getElementById("btn-open-settings"),
      txtHomeInstance = document.getElementById("homeInstance"),
      txtInstanceType = document.getElementById("instance-type");
      txtInstanceWarn = document.getElementById("no-instance-warning");

    // ---------------------------------------------------------
    // ------------------- Setup Display -----------------------
    // ---------------------------------------------------------

    const selectedInstance = await getSetting("selectedInstance");
    const selectedType = await getSetting("selectedType");

    txtHomeInstance.textContent = selectedInstance ? selectedInstance : "unknown";
    txtInstanceType.textContent = selectedType ? selectedType : "unknown";
    txtInstanceWarn.textContent = selectedInstance ? "" : "No instance selected. Please select an instance in the popup using 'Change my home instance'.";

    let lemmyInstances = await getSetting("instanceList");

    lemmyInstances.forEach((instance) => {
      const listItem = document.createElement("li");
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = instance.name;
      button.className = "btn-instance-list";
      listItem.appendChild(button);
      instanceList.appendChild(listItem);
    });

    // ---------------------------------------------------------
    // ------------------- Basic Functions ---------------------
    // ---------------------------------------------------------

    // Open settings page
    btnOpenSettings.addEventListener("click", (event) => {
      browser.tabs.create({ url: '../page-settings/settings.html' });
    });

    // ---------------------------------------------------------
    // --------------- Quick Settings Functions ----------------
    // ---------------------------------------------------------

    // Update home instance address
    btnChangeInstance.addEventListener("click", async () => {
      const inputInstance = prompt("Enter your instance URL: (ex. 'https://lemmy.ca')");
      if (inputInstance === null) { return; } // exit without alerting if user cancels
      if (inputInstance && validInstanceURLPattern.test(inputInstance)) {
        await setSetting("selectedInstance", inputInstance.trim());
        txtHomeInstance.textContent = inputInstance.trim();
      } else { alert("Invalid URL format, please follow this format: \n 'https://lemmy.ca'"); }
    });

    // Toggle home instance type
    btnChangeType.addEventListener("click", async () => {
      const currentType = await getSetting("selectedType");
      const newType = currentType === "lemmy" ? "kbin" : "lemmy";
      await setSetting("selectedType", newType);
      txtInstanceType.textContent = newType;
    });

    // Copy URL
    instanceList.addEventListener("click", (event) => {
      const target = event.target;
      if (target.classList.contains("btn-instance-list")) {
        const url = lemmyInstances.find((instance) => instance.name === target.textContent).url;
        navigator.clipboard.writeText(url);
      }
    });

    // --------------------------------------------- //
    // ---------------- Posting Tools -------------- //
    // --------------------------------------------- //

    let txtNumPosts = document.getElementById("btn-tool-num-posts");
    const btn_post_to = document.getElementById("btn-tool-post-to");
    const btnOpenPosts = document.getElementById("btn-tool-open-posts");
    let lemmyPostData = { posts: [] }

    txtNumPosts.textContent = "0";
    
    // Get posts with current URL
    async function getPostsWithURL() {
      const queryOptions = { active: true, currentWindow: true };
      const [tab] = await browser.tabs.query(queryOptions);
      const testURL = tab.url;
      const searchURL = selectedInstance + "/api/v3/search?q=" + testURL;
      const [lemmyPostResponse_URL, lemmyPostResponse_BODY] = await Promise.all([
        fetch(searchURL + "&type_=Url"),
        fetch(searchURL + "&type_=All")
      ]);
      lemmyPostData = {
        posts: [
          ...(await lemmyPostResponse_URL.json()).posts,
          ...(await lemmyPostResponse_BODY.json()).posts
        ]
      };
      return lemmyPostData;
    }

    await getPostsWithURL();

    txtNumPosts.textContent = lemmyPostData.posts.length ? lemmyPostData.posts.length : 0;

    // Post to Community
    
    btn_post_to.addEventListener("click", async () => {
      if (await hasSelectedInstance() && await hasSelectedType()) {
        const type = await getSetting("selectedType");
        const instance = await getSetting("selectedInstance");
        const postData = await p2l_getPostData();

        if (type === "lemmy") {
          const url = instance + "/create_post";
          const createdTab = await browser.tabs.create({ url: url });

          // Listen for tab updates to check for loading completion
          browser.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
            if (tabId === createdTab.id && changeInfo.status === "complete") {
              browser.tabs.onUpdated.removeListener(listener); // Remove the listener

              // Fill in form after the tab is fully loaded
              browser.tabs.executeScript(createdTab.id, {
                code: 'document.querySelector("#post-title").value = "' + postData.title + '";'
              });

              browser.tabs.executeScript(createdTab.id, {
                code: 'document.querySelector("#post-url").value = "' + postData.url + '";'
              });           

              window.close(); // Close the popup
            }
          });

        } else if (type === "kbin") {
          const url = instance + "/new?url=" + postData.url + "&title=" + postData.title;
          const createdTab = await browser.tabs.create({ url: url });
        }

      } else { alert("No valid instance has been set. Please select an instance in the popup using 'Change my home instance'.");}
    });

    // Check if a post has already been submitted to Lemmyverse
    
    btnOpenPosts.addEventListener("click", async () => {
      if (await hasSelectedInstance() && await hasSelectedType()) {
        if (selectedType === "lemmy") {
          if (lemmyPostData.posts.length <= 0) {
            alert("No posts found for this URL.");
          } else {
            lemmyPostData.posts.forEach(post => {
              const post_id = post.counts.post_id;
              console.log("Post ID:", post_id);
              browser.tabs.create({ url: selectedInstance + "/post/" + post_id });
            });
          }
        } else if (selectedType === "kbin") {
          alert("This feature is not yet available for Kbin instances.");
        }
      } else { alert("No valid instance has been set. Please select an instance in the popup using 'Change my home instance'."); }
    });








    // --------------------------------------------- //
    // ---------------- Search Tools --------------- //
    // --------------------------------------------- //

    // Search Lemmyverse
    const btnSearchCommunities = document.getElementById("btn-tool-search-community");
    const searchInputCommunities = document.getElementById("searchInputCommunities");

    async function performSearchCommunities() {
      await toolSearchCommunitiesLemmyverse(searchInputCommunities.value.trim())
    }

    btnSearchCommunities.addEventListener("click", performSearchCommunities);

    searchInputCommunities.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault(); // Prevent default form submission behavior
        performSearchCommunities();
      }
      // close popup
      window.close();
    });

    // Search content with Lemmy-Search
    const btnSearchContent = document.getElementById("btn-tool-search-content");
    const searchInputContent = document.getElementById("searchInputContent");

    function performSearchCommunitiesContent() {
      toolSearchContentLemmysearch(searchInputContent.value.trim());
    }

    btnSearchContent.addEventListener("click", performSearchCommunitiesContent);

    searchInputContent.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault(); // Prevent default form submission behavior
        performSearchCommunitiesContent();
      }
    });

    // --------------------------------------------- //
    // -------------- Redirect Instance ------------ //
    // --------------------------------------------- //

    // Redirect to selected instance
    btnRedirect.addEventListener('click', async () => {
      const queryOptions = { active: true, currentWindow: true };
      const [tab] = await browser.tabs.query(queryOptions);

      tabURL = tab.url;

      if ((await hasSelectedInstance())) {
        if (isLemmyCommunityWEAK(tabURL) || isKbinCommunityWEAK(tabURL)) {
          if (!(await isHomeInstance(tabURL))) {

            const redirectURL = await getCommunityRedirectURL(tabURL);
            await browser.tabs.update(tab.id, { url: redirectURL });

          } else { alert('You are already on your home instance.'); }
        } else { alert('You are not on a Lemmy or Kbin community. Please navigate to a community page and try again.\n\nThe extension checks for links that have "/c/" or "/m/" in the URL'); }
      } else { alert('No valid instance has been set. Please select an instance in the popup using "Change my home instance".'); }
    });
  }
  createPopup();
});
