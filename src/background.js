function injectContentScript(tabId) {
    const contentScript = "sidebar.js";
    browser.tabs.executeScript(tabId, { file: contentScript })
}

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete") {
        const pathname = new URL(tab.url).pathname;
        if (pathname.includes("/c/") || pathname.includes("/m/") || pathname.includes("/post/")) {
            injectContentScript(tabId);
        }
    }
});
