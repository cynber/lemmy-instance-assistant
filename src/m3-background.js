// --------------------------------------
// COPIED FROM utils.js
function getStorageAPI() {
  let storageAPI;
  if (typeof browser !== 'undefined' && browser.storage && browser.storage.local) {
    storageAPI = browser.storage.local;
  } else if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    storageAPI = chrome.storage.local;
  } else {
    throw new Error('Storage API is not supported in this browser.');
  }

  return storageAPI;
}
function getBrowserAPI() {
  let browserAPI;
  if (typeof browser !== 'undefined' && browser.storage && browser.storage.local) {
    browserAPI = browser;
  } else if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    browserAPI = chrome;
  } else {
    throw new Error('Browser API is not supported in this browser.');
  }
  return browserAPI;
}
async function getAllSettings() {
  const storageAPI = getStorageAPI();
  const allSettings = await storageAPI.get('settings');
  if (!allSettings || !allSettings.settings) {
    await setAllSettings(defaultSettings);
    return defaultSettings;
  }
  return await storageAPI.get('settings');
}
async function getSetting(settingName) {
  const allSettings = await getAllSettings();
  return allSettings.settings[settingName];
}
async function hasSelectedInstance() {
  const selectedInstance = await getSetting('selectedInstance');
  return selectedInstance !== undefined && selectedInstance !== "";
}
async function hasSelectedType() {
  const selectedType = await getSetting('selectedType');
  return selectedType !== undefined && selectedType !== "";
}
async function loadStorage(key) {
  const { value } = await browser.storage.local.get(key);
  return value;
}
async function p2l_getPostData() {
  const storageAPI = getBrowserAPI();
  return new Promise((resolve, reject) => {
    storageAPI.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const activeTab = tabs[0];
      const postData = {
        title: activeTab.title,
        url: activeTab.url
      };
      resolve(postData);
    });
  });
}
// --------------------------------------

// --------------------------------------
// Handle redirects within a Lemmy site
//  - Sometimes when navigating within a Lemmy site, the content scripts won't run despite the URL matching the pattern. This is a workaround for that. 
// --------------------------------------
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.url?.startsWith("chrome://") || tab.url?.startsWith("chrome-extension://")) {
    return undefined;
  }
  if (changeInfo.status === "complete") {
    if (
      /^https?:\/\/.*\/c\//.test(tab.url) ||
      /^https?:\/\/.*\/communities\//.test(tab.url) ||
      /^https?:\/\/.*\/post\//.test(tab.url)
    ) {
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ["utils.js", "content-sidebar.js", "content-general.js"]
      });
    }
  }
});


// --------------------------------------
// Handle context menu clicks
// --------------------------------------
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "redirect" && info.linkUrl) {

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
  } else if (info.menuItemId === "post-image" && info.srcUrl) {

    if (await hasSelectedInstance() && await hasSelectedType()) {

      const type = await getSetting("selectedType");
      const instance = await getSetting("selectedInstance");
      const postData = await p2l_getPostData();

      if (type === "lemmy") {
        const url = instance + "/create_post";
        console.log(url, postData, info, tab, type, instance)
        const createdTab = await chrome.tabs.create({ url: url });
        

        // Listen for tab updates to check for loading completion
        chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
          console.log(changeInfo.status)
          if (tabId === createdTab.id) {
            chrome.tabs.onUpdated.removeListener(listener); // Remove the listener
            console.log(postData.title);
            console.log(postData.url);

            // Fill in form after the tab is fully loaded
            chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
              if (tabId === createdTab.id && changeInfo.status === "complete") {
                chrome.tabs.onUpdated.removeListener(listener); // Remove the listener
            
                // Fill in form after the tab is fully loaded
                chrome.scripting.executeScript({
                  target: { tabId: createdTab.id },
                  function: fillFormScript,
                  args: [{
                    postDataTitle: postData.title,
                    infoSrcUrl: info.srcUrl,
                    postDataUrl: postData.url
                  }]
                });
              }
            });
            
            function fillFormScript(args) {
              const EVENT_OPTIONS = { bubbles: true, cancelable: false, composed: true };
              const EVENTS = {
                BLUR: new Event("blur", EVENT_OPTIONS),
                CHANGE: new Event("change", EVENT_OPTIONS),
                INPUT: new Event("input", EVENT_OPTIONS),
              };
            
              const postTitleInput = document.querySelector("#post-title");
              const postURLInput = document.querySelector("#post-url");
              const postBodyInput = document.querySelector("textarea[id^='markdown-textarea-']");
            
              postTitleInput.select();
              postTitleInput.value = args.postDataTitle;
              postTitleInput.dispatchEvent(EVENTS.INPUT);
            
              postURLInput.select();
              postURLInput.value = args.infoSrcUrl;
              postURLInput.dispatchEvent(EVENTS.INPUT);
            
              postBodyInput.select();
              postBodyInput.value = "Source: " + args.postDataUrl;
              postBodyInput.dispatchEvent(EVENTS.INPUT);
            }
          }
        });

      } else if (type === "kbin") {
        const url = instance + "/new?url=" + info.srcUrl + "&title=" + postData.title + "&body=Source: " + postData.url;
        await chrome.tabs.create({ url: url });
      }

    } else { alert("No valid instance has been set. Please select an instance in the popup using 'Change my home instance'."); }
  }
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "redirect",
    title: "Redirect to home instance",
    contexts: ["link"],
    targetUrlPatterns: ["http://*/c/*", "https://*/c/*", "http://*/p/*", "https://*/p/*", "http://*/m/*", "https://*/m/*"],
  });
  chrome.contextMenus.create({
    id: "post-image",
    title: "Post this image",
    contexts: ["image"],
    targetUrlPatterns: ["http://*/*", "https://*/*"]
  }, () => void chrome.runtime.lastError,
  );
});



// --------------------------------------
// Set default values on install/update
// --------------------------------------

chrome.runtime.onInstalled.addListener(async ({ reason }) => {

  // Set default values on install/update
  // TODO: fix the utils import so we can just use initializeSettingsWithDefaults()
  if (reason === 'install' || reason === 'update') {

    async function backgroundInitializeSettings() {

      const defaultSettings = {
        hideSidebarLemmy: false,
        hideSidebarKbin: false,
        instanceList: [
          { name: "lemmy.world", url: "https://lemmy.world" },
          { name: "lemmy.ca", url: "https://lemmy.ca" },
          { name: "lemm.ee", url: "https://lemm.ee" },
          { name: "kbin.social", url: "https://kbin.social" },
        ],
        runOnCommunitySidebar: true,
        runOnCommunityNotFound: true,
        hideHelp: false,
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

  // Open settings page when extension is first installed
  if (reason === 'install') {
    chrome.tabs.create({ url: 'page-settings/settings.html' });
  }
});
