document.addEventListener('DOMContentLoaded', () => {
    const instanceInput = document.getElementById('instance-input');
    const saveButton = document.getElementById('save-button');
    const changeTypeButton = document.getElementById("change-type");

    const selectedInstanceElement = document.getElementById("selected-instance");
    const selectedInstanceType = document.getElementById("instance-type");

    saveButton.addEventListener('click', () => {
        const newInstance = instanceInput.value.trim();
        const urlPattern = /^(http|https):\/\/(?:[\w-]+\.)?[\w.-]+\.[a-zA-Z]{2,}$/;
        if (!urlPattern.test(newInstance)) {
            alert('Invalid URL format, please enter a valid URL. \n (e.g. https://lemmy.ca)');
            return;
        }

        browser.storage.local.set({
            selectedInstance: newInstance,
        }, () => { alert('Home instance value saved successfully!'); });
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
            selectedInstanceElement.textContent = "unknown";
        }
    });

    // Display home instance type in popup
    browser.storage.local.get("selectedType").then((result) => {
        const selectedType = result.selectedType;
        if (selectedType) {
            selectedInstanceType.textContent = selectedType;
        } else {
            selectedInstanceType.textContent = "unknown";
        }
    });

});