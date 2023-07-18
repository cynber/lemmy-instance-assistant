document.addEventListener('DOMContentLoaded', function () {
  const instanceField = document.getElementById('instance-field');
  const saveButton = document.getElementById('save-btn');
  const resetButton = document.getElementById('reset-btn');
  const lemmyRadio = document.getElementById('radio-lemmy');
  const kbinRadio = document.getElementById('radio-kbin');
  const showSidebarCheckbox = document.getElementById('showSidebarButtons');
  const showCommunityNotFoundCheckbox = document.getElementById('showCommunityNotFound');
  const validationMessage = document.querySelector('.validation-message');
  const urlPattern = /^(http|https):\/\/(?:[\w-]+\.)?[\w.-]+\.[a-zA-Z]{2,}$/;

  // Retrieve stored values and set them to fields
  browser.storage.local.get([
    "selectedInstance",
    "selectedType",
    "settingShowSidebar",
    "settingCommunityNotFound"
  ]).then((result) => {
    const selectedInstance = result.selectedInstance;
    const selectedType = result.selectedType;
    const settingShowSidebar = result.settingShowSidebar;
    const settingCommunityNotFound = result.settingCommunityNotFound;

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

  // Save button click event handler
  let saveClicked = false;
  saveButton.addEventListener('click', function () {
    saveClicked = true;
    const instanceValue = instanceField.value.trim();
    const platformValue = lemmyRadio.checked ? "lemmy" : "kbin";
    const toggleShowSidebarButtons = showSidebarCheckbox.checked;
    const toggleShowCommunityNotFound = showCommunityNotFoundCheckbox.checked;

    // Validation check
    if (!urlPattern.test(instanceValue)) {
      showValidationError("Please enter a valid URL:   'https://lemmy.ca'");
      console.error("Please enter a valid URL:   'https://lemmy.ca'");
      return;
    } else {
      hideValidationError();
    }

    // Store values to local storage
    browser.storage.local.set({
      selectedInstance: instanceValue,
      selectedType: platformValue,
      settingShowSidebar: toggleShowSidebarButtons,
      settingCommunityNotFound: toggleShowCommunityNotFound
    }).then(() => {
      console.log("Values saved successfully!");
      console.log("Instance:", instanceValue);
      console.log("Platform:", platformValue);
      console.log("Show sidebar buttons:", toggleShowSidebarButtons);
      console.log("Show community not found:", toggleShowCommunityNotFound);
    }).catch((error) => {
      console.error("Error occurred while saving values:", error);
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
        settingCommunityNotFound: true
      }).then(() => {
        // Update the UI to reflect default values
        lemmyRadio.checked = true;
        kbinRadio.checked = false;
        showSidebarCheckbox.checked = true;
        showCommunityNotFoundCheckbox.checked = true;
        instanceField.value = "";
        console.log("Values reset to default.");
      }).catch((error) => {
        console.error("Error occurred while resetting values:", error);
      });
    } else {
      console.log("Reset cancelled.");
    }
  });
});
