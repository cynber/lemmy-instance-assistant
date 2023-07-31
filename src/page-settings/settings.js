document.addEventListener('DOMContentLoaded', function () {
  const instanceField = document.getElementById('instance-field');
  const saveButton = document.getElementById('save-btn');
  const resetButton = document.getElementById('reset-btn');
  const lemmyRadio = document.getElementById('radio-lemmy');
  const kbinRadio = document.getElementById('radio-kbin');
  const showSidebarCheckbox = document.getElementById('showSidebarButtons');
  const showCommunityNotFoundCheckbox = document.getElementById('showCommunityNotFound');
  const searchOpenLemmyverseCheckbox = document.getElementById('searchOpenLemmyverse');
  const validationMessage = document.querySelector('.validation-message');
  const instanceListTextArea = document.getElementById('instance-list');
  const urlPattern = /^(http|https):\/\/(?:[\w-]+\.)?[\w.-]+\.[a-zA-Z]{2,}$/;

  // Retrieve stored values and set them to fields
  browser.storage.local.get([
    "selectedInstance",
    "selectedType",
    "settingShowSidebar",
    "settingCommunityNotFound",
    "settingSearchOpenLemmyverse",
    "instanceList"
  ]).then((result) => {
    const selectedInstance = result.selectedInstance;
    const selectedType = result.selectedType;
    const settingShowSidebar = result.settingShowSidebar;
    const settingCommunityNotFound = result.settingCommunityNotFound;
    const settingSearchOpenLemmyverse = result.settingSearchOpenLemmyverse;
    const instanceList = result.instanceList;

    instanceField.value = selectedInstance || "";

    if (selectedType === "lemmy") {
      lemmyRadio.checked = true;
      kbinRadio.checked = false;
    } else if (selectedType === "kbin") {
      lemmyRadio.checked = false;
      kbinRadio.checked = true;
    }

    showSidebarCheckbox.checked = settingShowSidebar;
    showCommunityNotFoundCheckbox.checked = settingCommunityNotFound;
    searchOpenLemmyverseCheckbox.checked = settingSearchOpenLemmyverse;

    if (Array.isArray(instanceList)) {
      instanceListTextArea.value = instanceList.map(item => `${item.name}, ${item.url}`).join('\n');
    }

    hideValidationError();
  });

  // Function to show validation error message
  const showValidationError = (message) => {
    validationMessage.textContent = message;
    validationMessage.style.display = 'block';
    instanceField.classList.add('validation-error');
  };

  // Function to hide validation error message
  const hideValidationError = () => {
    validationMessage.style.display = 'none';
    instanceField.classList.remove('validation-error');
  };

  // Event handler for input event on selectedInstance text field
  instanceField.addEventListener('input', function () {
    if (saveClicked) {
      const instanceValue = this.value.trim();
      if (!urlPattern.test(instanceValue)) {
        showValidationError("Please enter a valid URL:   'https://lemmy.ca'");
      } else {
        hideValidationError();
      }
    }
  });

  function showSaveConfirmation(text) {
    const toastMessage = document.getElementById('toast-message');
    toastMessage.innerText = text;
    toastMessage.classList.add('show');
  
    setTimeout(() => {
      toastMessage.classList.remove('show');
    }, 3000);
  }

  // Save button click event handler
  let saveClicked = false;
  saveButton.addEventListener('click', function () {
    saveClicked = true;
    const instanceValue = instanceField.value.trim();
    const platformValue = lemmyRadio.checked ? "lemmy" : "kbin";
    const toggleShowSidebarButtons = showSidebarCheckbox.checked;
    const toggleShowCommunityNotFound = showCommunityNotFoundCheckbox.checked;
    const toggleSearchOpenLemmyverse = searchOpenLemmyverseCheckbox.checked;

    // Validation check
    if (!urlPattern.test(instanceValue)) {
      showValidationError("Please enter a valid URL:   'https://lemmy.ca'");
      console.log("Please enter a valid URL:   'https://lemmy.ca'");
      showSaveConfirmation("Settings could not be saved, see errors for details.");
      return;
    } else {
      hideValidationError();
    }

    const websiteListTextArea = document.getElementById('instance-list');
    const websiteListText = websiteListTextArea.value.trim();
    const websitesArray = websiteListText.split('\n').map(line => {
      const [name, url] = line.split(',').map(item => item.trim());
      console.log(name, url);
      return { name, url };
    });


    // Store values to local storage
    browser.storage.local.set({
      selectedInstance: instanceValue,
      selectedType: platformValue,
      settingShowSidebar: toggleShowSidebarButtons,
      settingCommunityNotFound: toggleShowCommunityNotFound,
      settingSearchOpenLemmyverse: toggleSearchOpenLemmyverse,
      instanceList: websitesArray
    }).then(() => {
      console.log("Values saved successfully!");
      console.log("Instance:", instanceValue);
      console.log("Platform:", platformValue);
      console.log("Show sidebar buttons:", toggleShowSidebarButtons);
      console.log("Show community not found:", toggleShowCommunityNotFound);
      console.log("Search open lemmyverse:", toggleSearchOpenLemmyverse);
      console.log("Instance List:", websitesArray);
      showSaveConfirmation("Settings saved!");
    }).catch((error) => {
      console.log("Error occurred while saving values:", error);
      showSaveConfirmation("Settings could not be saved, see errors for details.");
    });
  });

  resetButton.addEventListener('click', function () {
    const confirmReset = confirm("Are you sure you want to reset to default? This will revert all settings to their default values.");

    // TODO: 

    if (confirmReset) {
      // Restore default values
      browser.storage.local.set({
        selectedType: 'lemmy',
        settingShowSidebar: true,
        settingCommunityNotFound: true,
        settingSearchOpenLemmyverse: false,
        instanceList: [
          { name: "lemmy.world", url: "https://lemmy.world" },
          { name: "lemmy.ca", url: "https://lemmy.ca" },
          { name: "lemmy.one", url: "https://lemmy.one" },
          { name: "programming.dev", url: "https://programming.dev" },
          { name: "lemmy.ml", url: "https://lemmy.ml" },
          { name: "feddit.de", url: "https://feddit.de" },
          { name: "lemm.ee", url: "https://lemm.ee" },
          { name: "kbin.social", url: "https://kbin.social" },
        ]
      }).then(() => {
        // Update the UI to reflect default values
        lemmyRadio.checked = true;
        kbinRadio.checked = false;
        showSidebarCheckbox.checked = true;
        showCommunityNotFoundCheckbox.checked = true;
        searchOpenLemmyverseCheckbox.checked = false;
        instanceField.value = "";
        instanceListTextArea.value = "lemmy.world, https://lemmy.world\nlemmy.ca, https://lemmy.ca\nlemmy.one, https://lemmy.one\nprogramming.dev, https://programming.dev\nlemmy.ml, https://lemmy.ml\nfeddit.de, https://feddit.de\nlemm.ee, https://lemm.ee\nkbin.social, https://kbin.social";
        console.log("Values reset to default.");
      }).catch((error) => {
        console.log("Error occurred while resetting values:", error);
      });
    } else {
      console.log("Reset cancelled.");
    }
  });
});
