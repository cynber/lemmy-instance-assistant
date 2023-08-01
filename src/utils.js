function testFunction() {
    console.log("This is a test function.");
}

// Utility function to get the appropriate storage API based on the browser
function getStorageAPI() {
    if (typeof browser !== 'undefined' && browser.storage && browser.storage.local) {
        storageAPI = browser.storage.local;
    } else if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        storageAPI = chrome.storage.local;
    } else {
        throw new Error('Storage API is not supported in this browser.');
    }

    return storageAPI;
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

async function hasSelectedInstance() {
    const storageAPI = getStorageAPI();
    const { selectedInstance } = await storageAPI.get('selectedInstance');
    return selectedInstance !== undefined;
}

async function hasSelectedType() {
    const storageAPI = getStorageAPI();
    const { selectedType } = await storageAPI.get('selectedType');
    return (selectedType !== undefined);
}

async function getSelectedInstance() {
    const storageAPI = getStorageAPI();
    const { selectedInstance } = await storageAPI.get('selectedInstance');
    return selectedInstance;
}

async function getSelectedType() {
    const storageAPI = getStorageAPI();
    const { selectedType } = await storageAPI.get('selectedType');
    return selectedType;
}

async function isHomeInstance(testURL) {
    const selectedInstance = await getSelectedInstance()
    const testURLHost = new URL(testURL).hostname;
    const selectedInstanceHost = new URL(selectedInstance).hostname;
    return (testURLHost === selectedInstanceHost);
}

async function getCommunityRedirectURL(oldURL) {
    const selectedInstance = await getSelectedInstance();
    const selectedType = await getSelectedType();

    const communityPrefix = selectedType ? (selectedType === "lemmy" ? "/c/" : "/m/") : "/c/";

    const oldHost = new URL(oldURL).hostname;
    const oldPath = new URL(oldURL).pathname;

    const communityName = oldPath.match(/\/[cm]\/([^/@]+)/)[1];
    const oldInstance = oldPath.includes("@") ?
        oldPath.match(/\/[cm]\/[^/@]+@([^/]+)/)[1] : oldHost;

    const newURL = selectedInstance + communityPrefix + communityName + '@' + oldInstance;

    return newURL;
}

// TODO: set up error handling to check the URL

// ----------------------------------------------
// get settings from storage
// ----------------------------------------------

async function getSetting(settingName) {
    const storageAPI = getStorageAPI();
    const settings = await storageAPI.get(settingName);
    return settings[settingName];
  }