document.addEventListener('DOMContentLoaded', function () {
  const textFields = document.querySelectorAll('.text-field-input');
  const saveButton = document.querySelector('.save-btn');
  const radioButtons = document.querySelectorAll('input[type="radio"]');
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');

  // Retrieve stored values and set them to fields
  browser.storage.local.get([
    "selectedInstance",
    "selectedType",
    "settingShowSidebar",
    "settingContextMenu",
    "settingCommunityNotFound"
  ]).then((result) => {
    const selectedInstance = result.selectedInstance;
    const selectedType = result.selectedType;
    const settingShowSidebar = result.settingShowSidebar;
    const settingContextMenu = result.settingContextMenu;
    const settingCommunityNotFound = result.settingCommunityNotFound;

    textFields[0].value = selectedInstance || "";

    if (selectedType === "lemmy") {
      radioButtons[0].checked = true;
      radioButtons[1].checked = false;
    } else if (selectedType === "kbin") {
      radioButtons[0].checked = false;
      radioButtons[1].checked = true;
    }

    checkboxes[0].checked = settingShowSidebar;
    checkboxes[1].checked = settingContextMenu;
    checkboxes[2].checked = settingCommunityNotFound;
  });

  // Save button click event handler
  saveButton.addEventListener('click', function () {
    const instanceValue = textFields[0].value.trim();
    const platformValue = document.querySelector('input[name="platform"]:checked').value;
    const toggleShowSidebarButtons = checkboxes[0].checked;
    const toggleShowContextMenu = checkboxes[1].checked;
    const toggleShowCommunityNotFound = checkboxes[2].checked;

    // Store values to local storage
    browser.storage.local.set({
      selectedInstance: instanceValue,
      selectedType: platformValue,
      settingShowSidebar: toggleShowSidebarButtons,
      settingContextMenu: toggleShowContextMenu,
      settingCommunityNotFound: toggleShowCommunityNotFound
    }).then(() => {
      console.log("Values saved successfully!");
      console.log("Instance:", instanceValue);
      console.log("Platform:", platformValue);
      console.log("Show sidebar buttons:", toggleShowSidebarButtons);
      console.log("Show context menu:", toggleShowContextMenu);
      console.log("Show community not found:", toggleShowCommunityNotFound);
    }).catch((error) => {
      console.error("Error occurred while saving values:", error);
    });
  });
});