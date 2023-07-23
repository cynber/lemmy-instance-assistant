// --------------------------------------
// Handle redirects within a Lemmy site
// --------------------------------------
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.url?.startsWith("chrome://") || tab.url?.startsWith("chrome-extension://")) {
    return undefined;
  }
  if (changeInfo.status === "complete") {
    if (/^https?:\/\/.*\/c\//.test(tab.url)) {
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ["content-sidebar.js"]
      });
    }
  }
});


// --------------------------------------
// Handle context menu clicks
// --------------------------------------
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "lemmy-sidebar" && info.linkUrl) {

    let sourceHost = new URL(info.linkUrl).hostname;
    let sourcePath = new URL(info.linkUrl).pathname;

    if (sourcePath.includes("/c/") || sourcePath.includes("/m/")) {
      const communityName = sourcePath.match(/\/[cm]\/([^/@]+)/)[1];
      const sourceInstance = sourcePath.includes("@") ?
        sourcePath.match(/\/[cm]\/[^/@]+@([^/]+)/)[1] : sourceHost;
      const { selectedInstance } = await chrome.storage.local.get('selectedInstance');

      if (!selectedInstance) {
        chrome.tabs.update(tab.id, { url: 'https://github.com/cynber/lemmy-instance-assistant#setup' });
        return false;
      }

      const { selectedType } = await chrome.storage.local.get('selectedType');
      const communityPrefix = selectedType ? (selectedType === "lemmy" ? "/c/" : "/m/") : "/c/";
      const redirectURL = selectedInstance + communityPrefix + communityName + '@' + sourceInstance;

      chrome.tabs.update(tab.id, { url: redirectURL });
      
    } else {
      chrome.tabs.update(tab.id, { url: 'https://github.com/cynber/lemmy-instance-assistant/wiki/Sorry-that-didn\'t-work...' });
      // TODO: Add a popup to explain this
    }
  }
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "lemmy-sidebar",
    title: "Redirect to home instance",
    contexts: ["link"],
    targetUrlPatterns: ["http://*/c/*", "https://*/c/*", "http://*/p/*", "https://*/p/*"],
  });
});

// --------------------------------------
// Set default values on install/update
// --------------------------------------

function setDefault(condition, settingName, settingValue) {
  if (condition) {
    chrome.storage.local.set({ [settingName]: settingValue });
  }
}

chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === 'install' || reason === 'update') {
    chrome.storage.local.get((result) => {
      // no default set for selectedInstance
      setDefault(!result.selectedType, 'selectedType', 'lemmy');
      setDefault(result.settingShowSidebar === undefined, 'settingShowSidebar', true);
      setDefault(result.settingContextMenu === undefined, 'settingContextMenu', true);
      setDefault(result.settingCommunityNotFound === undefined, 'settingCommunityNotFound', true);
    });
  }
});
