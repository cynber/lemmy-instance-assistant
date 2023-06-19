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

  const instanceList = document.getElementById("instance-list");
  const selectedInstanceElement = document.getElementById("selected-instance");

  browser.storage.local.get("selectedInstance").then((result) => {
    const selectedInstance = result.selectedInstance;
    if (selectedInstance) {
      selectedInstanceElement.textContent = selectedInstance;
    }
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

  const changeInstanceButton = document.getElementById("change-instance");

  // Update instance address when button is clicked
  changeInstanceButton.addEventListener("click", () => {
    const inputInstance = prompt(
      "Enter your instance URL, then click anywhere on the page:"
    );
    if (inputInstance) {
      browser.storage.local.set({
        selectedInstance: inputInstance.trim(),
      });
      selectedInstanceElement.textContent = inputInstance.trim();
    }
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
});
