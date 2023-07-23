document.addEventListener("DOMContentLoaded", function () {
  const instanceList = document.getElementById("instance-list"),
    btnChangeInstance = document.getElementById("btn-change-instance"),
    btnChangeType = document.getElementById("btn-change-type"),
    btnRedirect = document.getElementById("btn-redirect-instance"),
    btnOpenSettings = document.getElementById("btn-open-settings"),
    btnFindCommunity = document.getElementById("btn-tool-find-community"),
    txtToolExplore = document.getElementById("explore-community-type"),
    btnToolSearch = document.getElementById("btn-tool-search"),
    txtHomeInstance = document.getElementById("homeInstance"),
    txtInstanceType = document.getElementById("instance-type");

  const urlPattern = /^(http|https):\/\/(?:[\w-]+\.)?[\w.-]+\.[a-zA-Z]{2,}$/;

  // Display home instance, instance type, and populate instance list on load
  browser.storage.local.get("selectedInstance").then((result) => {
    const selectedInstance = result.selectedInstance;
    txtHomeInstance.textContent = selectedInstance ? selectedInstance : "unknown";
  });

  browser.storage.local.get("selectedType").then((result) => {
    const selectedType = result.selectedType;
    txtInstanceType.textContent = selectedType ? selectedType : "unknown";
    txtToolExplore.textContent = selectedType === "lemmy" ? "Explore Lemmy communities" : "Explore Kbin communities";
  });

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

  

  // ----------------- BUTTONS ----------------- //

  // Update home instance address
  btnChangeInstance.addEventListener("click", () => {
    const inputInstance = prompt("Enter your instance URL: (ex. 'https://lemmy.ca')");

    if (inputInstance === null) { return; } // exit without alerting if user cancels

    if (inputInstance && urlPattern.test(inputInstance)) {
      browser.storage.local.set({ selectedInstance: inputInstance.trim(), });
      txtHomeInstance.textContent = inputInstance.trim();

    } else { alert("Invalid URL format, please follow this format: \n 'https://lemmy.ca'"); }
  });

  // Toggle home instance type
  btnChangeType.addEventListener("click", () => {
    browser.storage.local.get("selectedType").then((result) => {
      const selectedType = result.selectedType;
      const newType = selectedType === "lemmy" ? "kbin" : "lemmy";

      browser.storage.local.set({ selectedType: newType });
      txtInstanceType.textContent = newType;
      txtToolExplore.textContent = newType === "lemmy" ? "Explore all Lemmy communities" : "Explore all Kbin communities";
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

  // Open settings page
  btnOpenSettings.addEventListener("click", (event) => {
    browser.tabs.create({ url: '../page-settings/settings.html' });
  });

  // Tool: search
  btnToolSearch.addEventListener("click", (event) => {
    browser.tabs.create({ url: 'https://www.search-lemmy.com/' });
  });

  // Tool: community list
  btnFindCommunity.addEventListener("click", (event) => {
    browser.storage.local.get("selectedType").then((result) => {
      if (result.selectedType === "lemmy") {
        browser.tabs.create({ url: 'https://lemmyverse.net/communities' });
      } else {
        browser.tabs.create({ url: 'https://lemmyverse.net/kbin/magazines' });
      }
    });
  });



  // Redirect to selected instance
  btnRedirect.addEventListener('click', async () => {

    console.log('Redirecting to selected instance...');

    const queryOptions = { active: true, currentWindow: true };
    const [tab] = await browser.tabs.query(queryOptions);

    const currentHost = new URL(tab.url).hostname;
    const currentPath = new URL(tab.url).pathname;
    const { selectedInstance } = await browser.storage.local.get('selectedInstance');
    const { selectedType } = await browser.storage.local.get('selectedType');
    let communityPrefix = (selectedType) ? (selectedType === "lemmy" ? "/c/" : "/m/") : "/c/";

    if (selectedInstance && urlPattern.test(selectedInstance)) {
      if (currentPath.includes("/c/") || currentPath.includes("/m/")) {

        const selectedInstanceHostname = new URL(selectedInstance).hostname;
        const communityName = currentPath.match(/\/[cm]\/([^/@]+)/)[1];
        const sourceInstance = currentPath.includes("@") ?
          currentPath.match(/\/[cm]\/[^/@]+@([^/]+)/)[1] : currentHost;

        if (selectedInstanceHostname != currentHost) { // run if not on home instance

          const redirectURL = selectedInstance + communityPrefix + communityName + '@' + sourceInstance;
          await browser.tabs.update(tab.id, { url: redirectURL });

        } else { alert('You are already on your home instance.'); }
      } else { alert('You are not on a Lemmy or Kbin community. Please navigate to a community page and try again.\n\nThe extension checks for links that have "/c/" or "/m/" in the URL'); }
    } else { alert('No valid instance has been set. Please select an instance in the popup using "Change my home instance".'); }
  });
});
