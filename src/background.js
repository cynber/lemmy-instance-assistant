// --------------------------------------
// Handle redirects within a Lemmy site
// --------------------------------------
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    if (/^https?:\/\/.*\/c\//.test(tab.url)) {
      browser.tabs.executeScript(tabId, { file: "content-sidebar.js" })
    }
  }
});


// --------------------------------------
// Handle context menu clicks
// --------------------------------------
browser.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "lemmy-sidebar" && info.linkUrl) {
    
    let sourceHost = new URL(info.linkUrl).hostname;
    let sourcePath = new URL(info.linkUrl).pathname;

    if (sourcePath.includes("/c/") || sourcePath.includes("/m/")) {
      const communityName = sourcePath.match(/\/[cm]\/([^/@]+)/)[1];
      const sourceInstance = sourcePath.includes("@") ?
        sourcePath.match(/\/[cm]\/[^/@]+@([^/]+)/)[1] : sourceHost;

      async function loadStorage() {
        const { selectedInstance } = await browser.storage.local.get('selectedInstance');

        if (!selectedInstance) {
          browser.tabs.update(tab.id, { url: 'https://github.com/cynber/lemmy-instance-assistant#setup' });
          return false;
        }

        const { selectedType } = await browser.storage.local.get('selectedType');
        communityPrefix = selectedType ? (selectedType === "lemmy" ? "/c/" : "/m/") : "/c/";
        const redirectURL = selectedInstance + communityPrefix + communityName + '@' + sourceInstance;
        browser.tabs.update(tab.id, { url: redirectURL });
      }
      loadStorage();
    } else {
      browser.tabs.update(tab.id, { url: 'https://github.com/cynber/lemmy-instance-assistant/wiki/Sorry-that-didn\'t-work...' });
      // TODO: Add a popup to explain this
    }
  }
});

browser.contextMenus.create({
  id: "lemmy-sidebar",
  title: "Redirect to home instance",
  contexts: ["link"],
  targetUrlPatterns: ["http://*/c/*", "https://*/c/*", "http://*/p/*", "https://*/p/*"],
}, () => void browser.runtime.lastError,
);

// --------------------------------------
// Set default values on install/update
// --------------------------------------

function setDefault(condition, settingName, settingValue) {
  if (condition) {
    browser.storage.local.set({ [settingName]: settingValue });
  }
}

browser.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === 'install' || reason === 'update') {
    browser.storage.local.get().then((result) => {
      // no default set for selectedInstance
      setDefault(!result.selectedType, 'selectedType', 'lemmy');
      setDefault(result.settingShowSidebar === undefined, 'settingShowSidebar', true);
      setDefault(result.settingContextMenu === undefined, 'settingContextMenu', true);
      setDefault(result.settingCommunityNotFound === undefined, 'settingCommunityNotFound', true);
      setDefault(result.instanceList === undefined, 'instanceList', [
        { name: "lemmy.world", url: "https://lemmy.world" },
        { name: "lemmy.ca", url: "https://lemmy.ca" },
        { name: "lemmy.one", url: "https://lemmy.one" },
        { name: "programming.dev", url: "https://programming.dev" },
        { name: "lemmy.ml", url: "https://lemmy.ml" },
        { name: "feddit.de", url: "https://feddit.de" },
        { name: "lemm.ee", url: "https://lemm.ee" },
        { name: "kbin.social", url: "https://kbin.social" },
      ]);
    });
  }
});