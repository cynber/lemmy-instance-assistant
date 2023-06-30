document.addEventListener("DOMContentLoaded", function () {
  const lemmyInstances = [
    { name: "lemmy.world", url: "https://lemmy.world" },
    { name: "lemmy.ml", url: "https://lemmy.ml" },
    { name: "beehaw.org", url: "https://beehaw.org" },
    { name: "feddit.de", url: "https://feddit.de" },
    { name: "sh.itjust.works", url: "https://sh.itjust.works" },
    { name: "lemmy.one", url: "https://lemmy.one" },
    { name: "lemmy.ca", url: "https://lemmy.ca" },
    { name: "lemmy.blahaj.zone", url: "https://lemmy.blahaj.zone" },
  ];

  const changeInstanceButton = document.getElementById("change-instance");
  const selectedInstanceElement = document.getElementById("selected-instance");
  const instanceList = document.getElementById("instance-list");
  const redirectInstanceButton = document.getElementById("redirect-instance");

  const urlPattern = /^(http|https):\/\/(?:[\w-]+\.)?[\w.-]+\.[a-zA-Z]{2,}$/;

  // Update home instance address when button is clicked
  changeInstanceButton.addEventListener("click", () => {
    const inputInstance = prompt(
      "Enter your instance URL:"
    );
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

  // Set selected instance in popup
  browser.storage.local.get("selectedInstance").then((result) => {
    const selectedInstance = result.selectedInstance;
    if (selectedInstance) {
      selectedInstanceElement.textContent = selectedInstance;
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
    const { selectedInstance } = await browser.storage.local.get('selectedInstance');
    const queryOptions = { active: true, currentWindow: true };
    const [tab] = await browser.tabs.query(queryOptions);

    const currentUrl = tab.url;
    const currentHost = new URL(currentUrl).hostname;
    const currentPath = new URL(currentUrl).pathname;

    const selectedInstanceHostname = new URL(selectedInstance).hostname;
    const communityName = currentPath.match(/\/[cm]\/([^/@]+)/)[1];
    const sourceInstance = currentPath.includes("@") ?
      currentPath.match(/\/[cm]\/[^/@]+@([^/]+)/)[1] : currentHost;

    if (selectedInstanceHostname != currentHost) { // run if not on home instance
      if (selectedInstance && urlPattern.test(selectedInstance)) {

        const redirectURL = selectedInstance + '/c/' + communityName + '@' + sourceInstance;
        await browser.tabs.update(tab.id, { url: redirectURL });

      } else { alert('You have not selected a valid instance. Please select an instance by clicking the extension popup.'); }
    } else { alert('You are already on your home instance.'); }
  });
});
