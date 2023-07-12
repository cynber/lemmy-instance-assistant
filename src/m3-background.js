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
    title: "Instance Assistant",
    contexts: ["link"],
  });
});
