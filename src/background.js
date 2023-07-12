
// --------------------------------------
// Handle redirects within a Lemmy site
// --------------------------------------

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete") {
        browser.tabs.executeScript(tabId, { file: "content-sidebar.js" })
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
    title: "Instance Assistant",
    contexts: ["link"],
    targetUrlPatterns: ["http://*/c/*", "https://*/c/*", "http://*/p/*", "https://*/p/*"],
}, () => void browser.runtime.lastError,
);