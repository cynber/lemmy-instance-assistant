document.addEventListener('DOMContentLoaded', function () {
  const textFields = document.querySelectorAll('.text-field-input');
  const saveButton = document.querySelector('.save-btn');
  const radioButtons = document.querySelectorAll('input[type="radio"]');

  // Retrieve stored values and set them to fields
  browser.storage.local.get(["selectedInstance", "selectedType"]).then((result) => {
    const selectedInstance = result.selectedInstance;
    const selectedType = result.selectedType;

    textFields[0].value = selectedInstance || "";
    
    if (selectedType === "lemmy") {
      radioButtons[0].checked = true;
      radioButtons[1].checked = false;
    } else if (selectedType === "kbin") {
      radioButtons[0].checked = false;
      radioButtons[1].checked = true;
    }
  });

  // Save button click event handler
  saveButton.addEventListener('click', function () {
    const instanceValue = textFields[0].value.trim();
    const platformValue = document.querySelector('input[name="platform"]:checked').value;

    // Store values to local storage
    browser.storage.local.set({
      selectedInstance: instanceValue,
      selectedType: platformValue
    }).then(() => {
      console.log("Values saved successfully!");
    }).catch((error) => {
      console.error("Error occurred while saving values:", error);
    });
  });
});