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

chrome.runtime.onInstalled.addListener(async ({ reason }) => {

  // Set default values on install/update
  // TODO: fix the utils import so we can just use initializeSettingsWithDefaults()
  if (reason === 'install' || reason === 'update') {

    async function backgroundInitializeSettings() {

      const defaultSettings = {
        instanceList: [
          { name: "lemmy.world", url: "https://lemmy.world" },
          { name: "lemmy.ca", url: "https://lemmy.ca" },
          { name: "lemmy.one", url: "https://lemmy.one" },
          { name: "programming.dev", url: "https://programming.dev" },
          { name: "lemmy.ml", url: "https://lemmy.ml" },
          { name: "feddit.de", url: "https://feddit.de" },
          { name: "lemm.ee", url: "https://lemm.ee" },
          { name: "kbin.social", url: "https://kbin.social" },
        ],
        runOnCommunitySidebar: true,
        runOnCommunityNotFound: true,
        selectedInstance: '',           // users are forced to set this
        selectedType: 'lemmy',          // lemmy or kbin
        theme: 'dark',                  // **NOT IMPLEMENTED YET**
        toolSearchCommunity_openInLemmyverse: false,
      };

      let storageAPI = chrome.storage.local;
      let allSettings = await storageAPI.get('settings');

      if (!allSettings || !allSettings.settings) {
        await storageAPI.set({ 'settings': defaultSettings });
      } else {
        for (const settingName of Object.keys(defaultSettings)) {
          if (!allSettings.settings.hasOwnProperty(settingName)) {
            allSettings.settings[settingName] = defaultSettings[settingName];
          }
        }
        await storageAPI.set({ 'settings': allSettings.settings });
      }
    }
    await backgroundInitializeSettings();
  }

  // Open the settings page on install
  if (reason === 'install') {
    chrome.tabs.create({ url: 'page-settings/settings.html' });
  }
});
