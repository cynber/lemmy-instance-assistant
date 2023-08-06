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

const validInstanceURLPattern = /^(http|https):\/\/(?:[\w-]+\.)?[\w.-]+\.[a-zA-Z]{2,}$/;

// ----------------------------------------------
// SETTINGS FUNCTIONS
// ----------------------------------------------

// Get all settings
// - returns { settings: { ... } }
async function getAllSettings() {
    const storageAPI = getStorageAPI();
    return await storageAPI.get('settings');
}

// Get a single setting
// - returns 
async function getSetting(settingName) {
    const allSettings = await getAllSettings();
    return allSettings.settings[settingName];
}

// Set all settings
// - accepts 
async function setAllSettings(settingsObj) {
    const storageAPI = getStorageAPI();
    await storageAPI.set({ 'settings': settingsObj });
}

// Set a single setting
// - accepts
async function setSetting(settingName, settingValue) {
    const allSettings = await getAllSettings();
    allSettings.settings[settingName] = settingValue;
    await setAllSettings(allSettings.settings);
}

// Update multiple settings
// - Usage:
    // const settingsToUpdate = {
    //     theme: 'dark',
    //     runOnCommunitySidebar: false,
    //     toolSearchCommunity_openInLemmyverse: false,
    // };
    // await updateSettings(settingsToUpdate);
async function updateSettings(settingsToUpdate) {
    const allSettings = await getAllSettings();
    const updatedSettings = { ...allSettings.settings, ...settingsToUpdate };
    await setAllSettings(updatedSettings);
}

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
    toolSearchCommunity_openInLemmyverse: true,
};

// Reset all settings to the default values
async function resetAllSettingsToDefault() {
    await setAllSettings(defaultSettings);
}

// Reset a single setting to the default value
// - Usage:
    // await resetSettingToDefault('theme');
async function resetSettingToDefault(settingName) {
    const allSettings = await getAllSettings();
    if (defaultSettings.hasOwnProperty(settingName)) {
        allSettings.settings[settingName] = defaultSettings[settingName];
        await setAllSettings(allSettings.settings);
    } else {
        throw new Error(`Setting "${settingName}" does not exist in the default settings.`);
    }
}

// Initialize settings with default values
// - This is called when the extension is first installed or updated
// - It checks for missing settings and adds them
async function initializeSettingsWithDefaults() {
    const allSettings = await getAllSettings();
    if (!allSettings.hasOwnProperty('settings')) {
        await setAllSettings(defaultSettings);
    } else {
        // Check for missing settings and update them
        for (const settingName of Object.keys(defaultSettings)) {
            if (!allSettings.settings.hasOwnProperty(settingName)) {
                allSettings.settings[settingName] = defaultSettings[settingName];
            }
        }
        await setAllSettings(allSettings.settings);
    }
}




// ----------------------------------------------
// DETERMINE IF LEMMY OR KBIN SITE/COMMUNITY/POST
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

function isLemmyCommunityWEAK(sourceURL) {
    // For when you can't check the meta tag, like when only the URL is available
    const CURRENT_PATH = new URL(sourceURL).pathname;
    return (CURRENT_PATH.includes("/c/"))
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

function isKbinCommunityWEAK(sourceURL) {
    // For when you can't check the meta tag, like when only the URL is available
    const CURRENT_PATH = new URL(sourceURL).pathname;
    return (CURRENT_PATH.includes("/m/"))
}

// ----------------------------------------------
// SELECTED INSTANCE FUNCTIONS
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