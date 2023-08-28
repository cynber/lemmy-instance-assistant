// THIS PAGE SHOULD BE IDENTICAL TO popup.js 

document.addEventListener("DOMContentLoaded", function () {
  async function createPage() {

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
    txtInstanceWarn.textContent = selectedInstance ? "" : "WARN - Instance Not Selected: Some features will not work as expected. Please click 'Change my home instance'.";

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
      doOpenSettings();
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
      window.location.reload();
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

    const btn_post_to = document.getElementById("btn-tool-post-to");
    const btnOpenPosts = document.getElementById("btn-tool-open-posts");

    // Post to Community
    btn_post_to.addEventListener("click", async () => {
        doCreatePost();       
    });

    // Open posts from home instance
    btnOpenPosts.addEventListener("click", async () => {
      const queryOptions = { active: true, currentWindow: true };
      const [tab] = await browser.tabs.query(queryOptions);
      const testURL = tab.url;

      doOpenMatchingPostsLemmy(testURL);
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
  createPage();
});
