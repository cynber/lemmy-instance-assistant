document.addEventListener("DOMContentLoaded", function () {
  async function createPopup() {

    const instanceList = document.getElementById("instance-list"),
      btnChangeInstance = document.getElementById("btn-change-instance"),
      btnChangeType = document.getElementById("btn-change-type"),
      btnRedirect = document.getElementById("btn-redirect-instance"),
      btnOpenSettings = document.getElementById("btn-open-settings"),
      txtHomeInstance = document.getElementById("homeInstance"),
      txtInstanceType = document.getElementById("instance-type");

    // ---------------------------------------------------------
    // ------------------- Setup Display -----------------------
    // ---------------------------------------------------------

    const selectedInstance = await getSelectedInstance();
    const selectedType = await getSelectedType();

    txtHomeInstance.textContent = selectedInstance ? selectedInstance : "unknown";
    txtInstanceType.textContent = selectedType ? selectedType : "unknown";

    let lemmyInstances = [];

    browser.storage.local.get("instanceList").then((result) => {
      lemmyInstances = result.instanceList;

      if (!lemmyInstances) {
        lemmyInstances = [
          { name: "lemmy.world", url: "https://lemmy.world" },
          { name: "lemmy.ca", url: "https://lemmy.ca" },
          { name: "lemmy.one", url: "https://lemmy.one" },
          { name: "programming.dev", url: "https://programming.dev" },
          { name: "lemmy.ml", url: "https://lemmy.ml" },
          { name: "feddit.de", url: "https://feddit.de" },
          { name: "lemm.ee", url: "https://lemm.ee" },
          { name: "kbin.social", url: "https://kbin.social" },
        ];
        browser.storage.local.set({ instanceList: lemmyInstances });
      }

      lemmyInstances.forEach((instance) => {
        const listItem = document.createElement("li");
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = instance.name;
        button.className = "btn-instance-list";
        listItem.appendChild(button);
        instanceList.appendChild(listItem);
      });
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
    btnChangeInstance.addEventListener("click", () => {
      const inputInstance = prompt("Enter your instance URL: (ex. 'https://lemmy.ca')");
      if (inputInstance === null) { return; } // exit without alerting if user cancels
      if (inputInstance && validInstanceURLPattern.test(inputInstance)) {
        browser.storage.local.set({ selectedInstance: inputInstance.trim() });
        txtHomeInstance.textContent = inputInstance.trim();
      } else { alert("Invalid URL format, please follow this format: \n 'https://lemmy.ca'"); }
    });

    // Toggle home instance type
    btnChangeType.addEventListener("click", () => {
      browser.storage.local.get("selectedType").then((result) => {
        const currentType = result.selectedType;
        const newType = currentType === "lemmy" ? "kbin" : "lemmy";
        browser.storage.local.set({ selectedType: newType });
        txtInstanceType.textContent = newType;
      });
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
    // ---------------- Search Tools --------------- //
    // --------------------------------------------- //

    const btnSearchCommunities = document.getElementById("btn-tool-search-community");
    const searchInputCommunities = document.getElementById("searchInputCommunities");

    async function performSearchCommunities() {
      const searchTerm = searchInputCommunities.value.trim();
      const { settingSearchOpenLemmyverse } = await browser.storage.local.get('settingSearchOpenLemmyverse');

      if (searchTerm !== "") {
        if (settingSearchOpenLemmyverse) {
          const baseUrl = "https://lemmyverse.net/communities";
          const encodedSearchTerm = encodeURIComponent(searchTerm);
          browser.tabs.create({ url: `${baseUrl}?query=${encodedSearchTerm}` });
        } else {
          browser.tabs.create({ url: `../page-search/search.html?query=${encodeURIComponent(searchTerm)}` });
        }
      }
    }

    // Trigger search when "Search" button is clicked
    btnSearchCommunities.addEventListener("click", performSearchCommunities);

    // Trigger search when "Enter" key is pressed in the search input
    searchInputCommunities.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault(); // Prevent default form submission behavior
        performSearchCommunities();
      }
    });

    const btnSearchContent = document.getElementById("btn-tool-search-content");
    const searchInputContent = document.getElementById("searchInputContent");

    function performSearchCommunitiesContent() {
      const searchTerm = searchInputContent.value.trim();
      if (searchTerm !== "") {
        const baseUrl = "https://www.search-lemmy.com/results";
        const encodedSearchTerm = encodeURIComponent(searchTerm);
        const finalUrl = `${baseUrl}?query=${encodedSearchTerm}`;
        browser.tabs.create({ url: finalUrl });
      }
    }

    // Trigger search when "Search" button is clicked
    btnSearchContent.addEventListener("click", performSearchCommunitiesContent);

    // Trigger search when "Enter" key is pressed in the search input
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
