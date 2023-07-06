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

  const changeInstanceButton = document.getElementById("change-instance");
  const changeTypeButton = document.getElementById("change-type");
  const selectedInstanceElement = document.getElementById("selected-instance");
  const selectedInstanceType = document.getElementById("instance-type");
  const instanceList = document.getElementById("instance-list");
  const redirectInstanceButton = document.getElementById("redirect-instance");

  const urlPattern = /^(http|https):\/\/(?:[\w-]+\.)?[\w.-]+\.[a-zA-Z]{2,}$/;

  // Update home instance address when button is clicked
  changeInstanceButton.addEventListener("click", () => {
    const inputInstance = prompt(
      "Enter your instance URL:"
    );

    if (inputInstance === null) {
      return; // Exit the function without further execution
    }

    if (inputInstance && urlPattern.test(inputInstance)) {
      browser.storage.local.set({
        selectedInstance: inputInstance.trim(),
      });
      selectedInstanceElement.textContent = inputInstance.trim();
    } else {
      alert(
        "Invalid URL format, please enter a valid URL. \n (e.g. https://lemmy.ca)"
      );
    }
  });

  // Toggle home instance type when button is clicked
  changeTypeButton.addEventListener("click", () => {
    browser.storage.local.get("selectedType").then((result) => {
      const selectedType = result.selectedType;
      if (selectedType) {
        if (selectedType === "lemmy") {
          browser.storage.local.set({ selectedType: "kbin", });
          selectedInstanceType.textContent = "kbin";
        } else {
          browser.storage.local.set({ selectedType: "lemmy", });
          selectedInstanceType.textContent = "lemmy";
        }
      } else {
        browser.storage.local.set({ selectedType: "lemmy", });
      }
    });
  });

  // Display home instance in popup
  browser.storage.local.get("selectedInstance").then((result) => {
    const selectedInstance = result.selectedInstance;
    if (selectedInstance) {
      selectedInstanceElement.textContent = selectedInstance;
    } else {
      selectedInstanceElement.textContent = "Not set";
    }
  });

  // Display home instance in popup
  browser.storage.local.get("selectedType").then((result) => {
    const selectedType = result.selectedType;
    if (selectedType) {
      selectedInstanceType.textContent = selectedType;
    } else {
      selectedInstanceType.textContent = "Not set";
    }
  });

  // Populate instance list
  lemmyInstances.forEach((instance) => {
    const listItem = document.createElement("li");
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = instance.name;
    button.className = "instance-button";
    listItem.appendChild(button);
    instanceList.appendChild(listItem);
  });

  // Copy URL when instance button is clicked
  instanceList.addEventListener("click", (event) => {
    const target = event.target;
    if (target.classList.contains("instance-button")) {
      const url = lemmyInstances.find((instance) =>
        instance.name === target.textContent
      ).url;
      navigator.clipboard.writeText(url);
    }
  });

  // Alternative redirect button for when the redirect button doesn't show up
  redirectInstanceButton.addEventListener('click', async () => {

    // Default to lemmy communities
    browser.storage.local.get("selectedType").then((result) => {
      const selectedType = result.selectedType;
      if (selectedType) {
        communityPrefix = selectedType === "lemmy" ? "/c/" : "/m/";
      } else {
        communityPrefix = "/c/";
      }
    });

    const { selectedInstance } = await browser.storage.local.get('selectedInstance');
    const queryOptions = { active: true, currentWindow: true };
    const [tab] = await browser.tabs.query(queryOptions);

    const currentUrl = tab.url;
    const currentHost = new URL(currentUrl).hostname;
    const currentPath = new URL(currentUrl).pathname;

    if (currentPath.includes("/c/") || currentPath.includes("/m/")) {
      if (selectedInstance && urlPattern.test(selectedInstance)) {
        const selectedInstanceHostname = new URL(selectedInstance).hostname;
        const communityName = currentPath.match(/\/[cm]\/([^/@]+)/)[1];
        const sourceInstance = currentPath.includes("@") ?
          currentPath.match(/\/[cm]\/[^/@]+@([^/]+)/)[1] : currentHost;

        if (selectedInstanceHostname != currentHost) { // run if not on home instance

          const redirectURL = selectedInstance + communityPrefix + communityName + '@' + sourceInstance;
          await browser.tabs.update(tab.id, { url: redirectURL });

        } else { alert('You are already on your home instance.'); }
      } else { alert('You have not selected a valid instance. Please select an instance by clicking the extension popup.'); }
    } else { alert('You are not on a Lemmy or Kbin community. Please navigate to a community page and try again.\n\nThe extension checks for links that have "/c/" or "/m/" in the URL'); }
  });
});
