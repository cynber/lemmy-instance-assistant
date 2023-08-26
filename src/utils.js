function testFunction() {
  console.log("This is a test function.");
}

// Utility function to get the appropriate storage API based on the browser
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

function isLoggedInLemmy() {
  // TODO: NOT TESTED
  const loginLink = document.querySelector('a[href="/login"]');
  const signupLink = document.querySelector('a[href="/signup"]');
  
  // If both login and signup links exist, user is not logged in
  return !(loginLink && signupLink);
}

function isLoggedInKbin() {
  const loginLink = document.querySelectorAll('a.login[href="/login"]');

  // If login link exists, user is not logged in
  return !loginLink;
}


const validInstanceURLPattern = /^(http|https):\/\/(?:[\w-]+\.)?[\w.-]+\.[a-zA-Z]{2,}$/;

// ----------------------------------------------
// SETTINGS FUNCTIONS
// ----------------------------------------------

// Get all settings
// - returns { settings: { ... } }
async function getAllSettings() {
  const storageAPI = getStorageAPI();
  const allSettings = await storageAPI.get('settings');
  if (!allSettings || !allSettings.settings) {
    await setAllSettings(defaultSettings);
    return defaultSettings;
  }
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
  hideSidebarLemmy: false,
  hideSidebarKbin: false,
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
// Determine type of page
// ----------------------------------------------

function isLemmySite() {
  const metaTag = document.querySelector('meta[name="Description"]');
  if (metaTag) {
    return metaTag.content === "Lemmy";
  } else {
    return false;
  }
}

function isLemmyCommunityList(sourceURL) {
  const CURRENT_PATH = new URL(sourceURL).pathname;
  return (isLemmySite() && CURRENT_PATH === "/communities")
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

// -------------- Other Frontends ---------------

function isLemmyPhoton() {
  // look for meta tag name="description", and see if it contains "Photon"
  const metaTag = document.querySelector('meta[name="description"]');
  if (metaTag) {
    return metaTag.content.includes("Photon: An alternative lemmy client with a sleek design.");
  } else {
    return false;
  }
}

function isLemmyAlexandrite() {
  return !!document.querySelector('div.sx-stack.f-row.gap-1.align-items-center.mx-4.sx-badge-gray.sx-font-size-2 a[href="https://github.com/sheodox/alexandrite"]');
}

function mayBeFrontend(testURL) {
  let testURLHost = testURL;

  // Check if the input is a valid URL
  try {
    const urlObj = new URL(testURL);
    testURLHost = urlObj.hostname;
  } catch (error) {
    // Input is not a valid URL, use it as is
  }

  const hostParts = testURLHost.split('.');
  return hostParts.length > 2; // tests for number of parts in the hostname
}

function getRealHostname(testURL) {
  let testURLHost = testURL;

  // Check if the input is a valid URL
  try {
    const urlObj = new URL(testURL);
    testURLHost = urlObj.hostname;
  } catch (error) {
    // Input is not a valid URL, use it as is
  }

  const hostParts = testURLHost.split('.');
  return hostParts.slice(1).join('.');
}



// ----------------------------------------------
// SELECTED INSTANCE FUNCTIONS
// ----------------------------------------------

async function hasSelectedInstance() {
  const selectedInstance = await getSetting('selectedInstance');
  return selectedInstance !== undefined && selectedInstance !== "";
}

async function hasSelectedType() {
  const selectedType = await getSetting('selectedType');
  return selectedType !== undefined && selectedType !== "";
}

async function isHomeInstance(testURL) {
  if (!(await hasSelectedInstance())) {
    console.log("No selected instance");
    return false;
  } else {
    console.log("Has selected instance");
    const selectedInstance = await getSetting('selectedInstance');
    const testURLHost = new URL(testURL).hostname;
    const selectedInstanceHost = new URL(selectedInstance).hostname;
    return testURLHost.endsWith(selectedInstanceHost);
  }
}

async function getCommunityRedirectURL(oldURL) {
  const selectedInstance = await getSetting('selectedInstance');
  const selectedType = await getSetting('selectedType');

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
// -------------  External Tool  ----------------
// ----------------------------------------------

// External Tool: Search Community through Lemmyverse 
async function toolSearchCommunitiesLemmyverse(searchTerm) {
  if (searchTerm !== "") {
    if (await getSetting('toolSearchCommunity_openInLemmyverse')) {
      const baseUrl = "https://lemmyverse.net/communities";
      const encodedSearchTerm = encodeURIComponent(searchTerm);
      browser.tabs.create({ url: `${baseUrl}?query=${encodedSearchTerm}` });
    } else {
      browser.tabs.create({ url: `../page-search/search.html?query=${encodeURIComponent(searchTerm)}` });
    }
  } else {
    console.log("CommunitySearch: Search term is empty");
  }
}

// External Tool: Search Content through Lemmysearch
function toolSearchContentLemmysearch(searchTerm) {
  if (searchTerm !== "") {
    const baseUrl = "https://www.search-lemmy.com/results";
    const encodedSearchTerm = encodeURIComponent(searchTerm);
    const finalUrl = `${baseUrl}?query=${encodedSearchTerm}`;
    browser.tabs.create({ url: finalUrl });
  }
}

// ----------------------------------------------
// -------------  Posting Tools  ----------------
// ----------------------------------------------

// Helper functions to post a webpage to a community

// Get the post data from the current tab
// - returns { title: "title", url: "url" }
async function p2l_getPostData() {
  const storageAPI = getBrowserAPI();
  return new Promise((resolve, reject) => {
    storageAPI.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      const activeTab = tabs[0];
      const postData = {
        title: activeTab.title,
        url: activeTab.url
      };
      resolve(postData);
    });
  });
}

// ----------------------------------------------
// ---------- General DOM Manipulation ----------
// ----------------------------------------------

//Used for offset removal
function removeClassByWildcard(divClass) {
  // If the class ends with a "*", then it matches all classes that start with the given class name.
  if (divClass.endsWith("*")) {
    divClass = divClass.replace("*", "");
    // Get all elements with the given class name.
    const elements = document.getElementsByTagName("div");
    const re = new RegExp("(^|s)" + divClass + "(s|$)");
    const result = [];
    let className = "";

    for (let i = 0; i < elements.length; i++) {
      if (re.test(elements[i].className)) {
        console.log("Match: " + elements[i]);
        result.push(elements[i]);
        for (let y = 0; y < elements[i].classList.length; y++) {
          if (elements[i].classList[y].indexOf(divClass) !== -1) {
            className = elements[i].classList[y];
            console.log(className);
          }
        }
      }
    }
    // Remove the class from all elements.
    for (let i = 0; i < result.length; i++) {
      result[i].classList.remove(className);
    }
  } else {
    // Otherwise, the class must match exactly.
    const elements = document.querySelectorAll("[class=" + divClass + "]");

    // Remove the class from all elements.
    for (let i = 0; i < elements.length; i++) {
      elements[i].classList.remove(divClass);
    }
  }
}