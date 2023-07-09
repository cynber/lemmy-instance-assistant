document.addEventListener("DOMContentLoaded", function () {
  const lemmyInstances = [
    { name: "lemmy.world", url: "https://lemmy.world" },
    { name: "lemmy.ca", url: "https://lemmy.ca" },
    { name: "feddit.de", url: "https://feddit.de" },
    { name: "beehaw.org", url: "https://beehaw.org" },
    { name: "lemmy.one", url: "https://lemmy.one" },
    { name: "lemmy.ml", url: "https://lemmy.ml" },
    { name: "sh.itjust.works", url: "https://sh.itjust.works" },
    { name: "lemm.ee", url: "https://lemm.ee" },
    { name: "lemmy.blahaj.zone", url: "https://lemmy.blahaj.zone" },
    { name: "kbin.social", url: "https://kbin.social" },
  ];

  const instanceList = document.getElementById("instance-list"),
    btnChangeInstance = document.getElementById("change-instance"),
    btnChangeType = document.getElementById("change-type"),
    btnRedirect = document.getElementById("redirect-instance"),
    btnOpenSettings = document.getElementById("open-settings"),
    txtHomeInstance = document.getElementById("selected-instance"),
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
  });

  lemmyInstances.forEach((instance) => {
    const listItem = document.createElement("li");
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = instance.name;
    button.className = "instance-button";
    listItem.appendChild(button);
    instanceList.appendChild(listItem);
  });

  // ----------------- BUTTONS ----------------- //

  // Update home instance address
  btnChangeInstance.addEventListener("click", () => {
    const inputInstance = prompt("Enter your instance URL: (ex. 'https://lemmy.ca')");

    if (inputInstance === null) { return; } // exit without alerting if user cancels
    
    if (inputInstance && urlPattern.test(inputInstance)) {
      browser.storage.local.set({ selectedInstance: inputInstance.trim(), });
      txtHomeInstance.textContent = inputInstance.trim();

    } else { alert( "Invalid URL format, please follow this format: \n 'https://lemmy.ca'"); }
  });

  // Toggle home instance type
  btnChangeType.addEventListener("click", () => {
    browser.storage.local.get("selectedType").then((result) => {
      const selectedType = result.selectedType;
      const newType = selectedType === "lemmy" ? "kbin" : "lemmy";
      
      browser.storage.local.set({ selectedType: newType });
      txtInstanceType.textContent = newType;
    });
  });

  // Copy URL
  instanceList.addEventListener("click", (event) => {
    const target = event.target;
    if (target.classList.contains("instance-button")) {
      const url = lemmyInstances.find((instance) => instance.name === target.textContent).url;
      navigator.clipboard.writeText(url);
    }
  });

  // Open settings page
  btnOpenSettings.addEventListener("click", (event) => {
    browser.tabs.create({ url: '../settings/settings.html' });
  });

  // Redirect to selected instance
  btnRedirect.addEventListener('click', async () => {

    const queryOptions = { active: true, currentWindow: true };
    const [tab] = await browser.tabs.query(queryOptions);
    
    const currentHost = new URL(tab.url).hostname;
    const currentPath = new URL(tab.url).pathname;
    const { selectedInstance } = await browser.storage.local.get('selectedInstance');
    let communityPrefix = "/c/";
    
    browser.storage.local.get("selectedType").then((result) => {
      const selectedType = result.selectedType;
      // Default to lemmy communities if no type is selected
      communityPrefix = selectedType ? (selectedType === "lemmy" ? "/c/" : "/m/") : "/c/";
    });

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
