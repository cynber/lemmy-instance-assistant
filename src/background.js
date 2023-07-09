
// --------------------------------------
// Handle redirects within a Lemmy site
// --------------------------------------

function injectContentScript(tabId) {
    const contentScript = "sidebar.js";
    browser.tabs.executeScript(tabId, { file: contentScript })
}

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete") {
        injectContentScript(tabId);
    }
});


// --------------------------------------
// Handle context menu clicks
// --------------------------------------

browser.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === "lemmy-sidebar" && info.linkUrl) {
        async function loadSelectedInstance() {
            const { selectedInstance } = await browser.storage.local.get('selectedInstance');
            const { selectedType } = await browser.storage.local.get('selectedType');

            communityPrefix = selectedType ? (selectedType === "lemmy" ? "/c/" : "/m/") : "/c/";

            let sourceHost = new URL(info.linkUrl).hostname;
            let sourcePath = new URL(info.linkUrl).pathname;
            const communityName = sourcePath.match(/\/[cm]\/([^/@]+)/)[1];
            const sourceInstance = sourcePath.includes("@") ?
                sourcePath.match(/\/[cm]\/[^/@]+@([^/]+)/)[1] : sourceHost;

            if (sourcePath.includes("/c/") || sourcePath.includes("/m/")) {
                const redirectURL = selectedInstance + communityPrefix + communityName + '@' + sourceInstance;
                browser.tabs.update(tab.id, { url: redirectURL });
            } else { alert('This is not a valid Lemmy or Kbin link. Please click on a link to a Lemmy or Kbin community.\n\n Lemmy post links can not be redirected because of how Lemmy works. See project GitHub for more information.'); }
        }
        loadSelectedInstance();
    }
});

browser.contextMenus.create({
    id: "lemmy-sidebar",
    title: "Instance Assistant",
    contexts: ["link"],
}, () => void browser.runtime.lastError,
);