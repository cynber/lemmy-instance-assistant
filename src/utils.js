function getRedirectURL(sourceURL) {
    let redirectURL = null;

    async function loadStorage() {
        const { selectedInstance } = await browser.storage.local.get('selectedInstance');
        const { selectedType } = await browser.storage.local.get('selectedType');

        communityPrefix = selectedType ? (selectedType === "lemmy" ? "/c/" : "/m/") : "/c/";

        let sourceHost = new URL(sourceURL).hostname;
        let sourcePath = new URL(sourceURL).pathname;

        const communityName = sourcePath.match(/\/[cm]\/([^/@]+)/)[1];
        const sourceInstance = sourcePath.includes("@") ?
            sourcePath.match(/\/[cm]\/[^/@]+@([^/]+)/)[1] : sourceHost;

        const redirectURL = selectedInstance + communityPrefix + communityName + '@' + sourceInstance;
    }

    loadStorage();

    return redirectURL
}

// TODO: Set up error handling. For now this function assumes that the URL is valid.


function testFunction() {
    console.log("This is a test function.");
}

// ----------------------------------------------
// determine if Lemmy or Kbin site/community/post
// ----------------------------------------------

function isLemmySite() {
    const metaTag = document.querySelector('meta[name="Description"]');
    if (metaTag) {
        return metaTag.content === "Lemmy";
    } else {
        return false;
    }
}

function isLemmyCommunity(sourceURL) {
    const CURRENT_PATH = new URL(sourceURL).pathname;
    return (isLemmySite() && CURRENT_PATH.includes("/c/"))
}

function isLemmyPost(sourceURL) {
    const CURRENT_PATH = new URL(sourceURL).pathname;
    return (isLemmySite() && CURRENT_PATH.includes("/post/"))
}

function isLemmyLoadOtherInstance(sourceURL) {
    const CURRENT_PATH = new URL(sourceURL).pathname;
    return (isLemmyCommunity(sourceURL) && CURRENT_PATH.includes("@"))
}

function isLemmyCommunityNotFound(sourceURL) {
    const CURRENT_PATH = new URL(sourceURL).pathname;
    const hasErrorContainer = document.querySelector('.error-page');
    return (isLemmyLoadOtherInstance(sourceURL) && hasErrorContainer)
}

function isKbinSite() {
    // TODO: Add a check for the meta tag
    return true;
}

function isKbinCommunity(sourceURL) {
    const CURRENT_PATH = new URL(sourceURL).pathname;
    return (isKbinSite() && CURRENT_PATH.includes("/m/"))
}

// ----------------------------------------------
// fetch the selected instance from storage
// ----------------------------------------------

async function getSelectedInstance() {
    const { selectedInstance } = await browser.storage.local.get('selectedInstance');
    return selectedInstance;
}