document.addEventListener('DOMContentLoaded', function() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const displaySidebarButtonsToggle = document.getElementById('displaySidebarButtonsToggle');
    const allowOnAllSitesCheckbox = document.getElementById('allowOnAllSitesCheckbox');
  
    // Load settings from storage and update UI
    chrome.storage.sync.get(['darkMode', 'displaySidebarButtons', 'allowOnAllSites'], function(result) {
      darkModeToggle.checked = result.darkMode || false;
      displaySidebarButtonsToggle.checked = result.displaySidebarButtons || false;
      allowOnAllSitesCheckbox.checked = result.allowOnAllSites || false;
    });
  
    // Save settings when toggles/checkboxes change
    darkModeToggle.addEventListener('change', function() {
      chrome.storage.sync.set({ darkMode: darkModeToggle.checked });
    });
  
    displaySidebarButtonsToggle.addEventListener('change', function() {
      chrome.storage.sync.set({ displaySidebarButtons: displaySidebarButtonsToggle.checked });
    });
  
    allowOnAllSitesCheckbox.addEventListener('change', function() {
      chrome.storage.sync.set({ allowOnAllSites: allowOnAllSitesCheckbox.checked });
    });
  });
  