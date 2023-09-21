function testFunction() {
  console.log("This is a test function.");
}

let validInstanceURLPattern = /^(http|https):\/\/(?:[\w-]+\.)?[\w.-]+\.[a-zA-Z]{2,}$/;

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

function doOpenSettings() {
  const browserAPI = getBrowserAPI();
  browserAPI.tabs.create({ url: '../page-settings/settings.html' });
}









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

function createContextMenu(instance, browserAPI) {
  const menuId = 'redirectTo' + instance.name;

  browserAPI.contextMenus.create({
    id: menuId,
    title: "Redirect to " + instance.name,
    contexts: ["link"],
    targetUrlPatterns: ["http://*/c/*", "https://*/c/*", "http://*/p/*", "https://*/p/*", "http://*/m/*", "https://*/m/*"],
    parentId: "redirectToOthers"
  });

} // if already exists, pass.

// Set all settings
// - accepts 
async function setAllSettings(settingsObj) {
  const storageAPI = getStorageAPI();
  await storageAPI.set({ 'settings': settingsObj });
  
  const browserAPI = getBrowserAPI();
  const instanceList = settingsObj.instanceList;
  console.log(instanceList)

  for (const instance of instanceList) {
    createContextMenu(instance, browserAPI)
  };
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
    { name: "lemmy.world", url: "https://lemmy.world", type: "lemmy" },
    { name: "lemmy.ca", url: "https://lemmy.ca", type: "lemmy"},
    { name: "lemm.ee", url: "https://lemm.ee", type: "lemmy" },
    { name: "kbin.social", url: "https://kbin.social", type: "kbin" },
  ],
  runOnCommunitySidebar: true,
  runOnCommunityNotFound: true,
  hideHelp: false,
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

function isLoggedInLemmy() {
  const loginLink = document.querySelector('a[href="/login"]');
  const signupLink = document.querySelector('a[href="/signup"]');
  return !(loginLink && signupLink);
}

function isLoggedInKbin() {
  const loginLink = document.querySelectorAll('a.login[href="/login"]');
  return !loginLink;
}

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
  return (isLemmySite() && (CURRENT_PATH.includes("/post/")))
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

function isKbinPost(sourceURL) {
  const CURRENT_PATH = new URL(sourceURL).pathname;
  return (isKbinSite() && (CURRENT_PATH.includes("/t/")))
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

function isLemmyPhotonPost(sourceURL) {
  const CURRENT_PATH = new URL(sourceURL).pathname;
  return (isLemmyPhoton() && CURRENT_PATH.includes("/post/"))
}

function isLemmyAlexandritePost(sourceURL) {
  const CURRENT_PATH = new URL(sourceURL).pathname;
  return (isLemmyAlexandrite() && CURRENT_PATH.includes("/post/"))
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
  // check if testURLHost contains > 1 dot

  if (testURLHost.split('.').length > 2) {
    const hostParts = testURLHost.split('.');
    return hostParts.slice(1).join('.');
  } else {
    return testURLHost;
  }
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

async function getPostRedirectURL(oldURL) {
  return oldURL;
}

async function toggleInstanceType() {
  const currentType = await getSetting("selectedType");
  const newType = currentType === "lemmy" ? "kbin" : "lemmy";
  await setSetting("selectedType", newType);
}

// INPUT: instance URL (string), post ID (string)
// OUTPUT: post object (JSON)
async function fetchPostFromID(instance, postID) {
  console.log("fetch request:", instance + '/api/v3/post?id=' + postID)
  const options = { method: 'GET', headers: { accept: 'application/json' } };
  try {
    const response = await fetch(instance + '/api/v3/post?id=' + postID, options);
    const apiResponse = await response.json();
    return apiResponse.post_view;
  } catch (err) {
    console.error(err);
  }
}

// INPUT: instance URL (string), post title (string)
// OUTPUT: post search results (JSON)
async function fetchPostsFromTitle(instance, postTitle) {
  console.log("fetch request:", instance + '/api/v3/search?q=' + encodeURIComponent(postTitle) + '&type_=Posts');
  const options = { method: 'GET', headers: { accept: 'application/json' } };
  try {
    console.log("fetch request:", instance + '/api/v3/search?q=' + encodeURIComponent(postTitle) + '&type_=Posts');
    const response = await fetch(instance + '/api/v3/search?q=' + encodeURIComponent(postTitle) + '&type_=Posts', options);
    const apiResponse = await response.json();
    return apiResponse.posts;
  } catch (err) {
    console.error(err);
  }
}

// INPUT: post object (JSON), post search results (JSON)
// OUTPUT: filtered post search results (JSON)
async function filterPostsByPost(testPost, inputPosts) {
  const og_communityName = testPost.community.name;
  const og_creatorName = testPost.creator.name;
  const og_title = testPost.post.name;
  const og_url = testPost.post.url;

  let filteredPosts = inputPosts.filter(post =>
    post.community.name === og_communityName &&
    post.creator.name === og_creatorName &&
    post.post.name === og_title
  );

  return filteredPosts;
}

async function openPostFromID(instance, postID, community) {
  const type = await getSetting("selectedType");

  (type === "lemmy") ?
    window.location.href = instance + '/post/' + postID :
    window.location.href = instance + '/m/' + community + '/t/' + postID;
}












// ----------------------------------------------
// -------------  External Tool  ----------------
// ----------------------------------------------

// External Tool: Search Community through Lemmyverse 
async function toolSearchCommunitiesLemmyverse(searchTerm) {
  const browserAPI = getBrowserAPI();
  if (searchTerm !== "") {
    if (await getSetting('toolSearchCommunity_openInLemmyverse')) {
      const baseUrl = "https://lemmyverse.net/communities";
      const encodedSearchTerm = encodeURIComponent(searchTerm);
      browserAPI.tabs.create({ url: `${baseUrl}?query=${encodedSearchTerm}` });
    } else {
      browserAPI.tabs.create({ url: `../page-search/search.html?query=${encodeURIComponent(searchTerm)}` });
    }
  } else {
    console.log("CommunitySearch: Search term is empty");
  }
}

// External Tool: Search Content through Lemmysearch
function toolSearchContentLemmysearch(searchTerm) {
  const browserAPI = getBrowserAPI();
  if (searchTerm !== "") {
    const baseUrl = "https://www.search-lemmy.com/results";
    const encodedSearchTerm = encodeURIComponent(searchTerm);
    const finalUrl = `${baseUrl}?query=${encodedSearchTerm}`;
    browserAPI.tabs.create({ url: finalUrl });
  }
}










// ----------------------------------------------
// -------------  Posting Tools  ----------------
// ----------------------------------------------

// Helper functions to post a webpage to a community

// Get the post data from the current tab
// - returns { title: "title", url: "url" }
async function p2l_getPostData() {
  const browserAPI = getBrowserAPI();
  const tabs = await browserAPI.tabs.query({ active: true, currentWindow: true });
  const activeTab = tabs[0];
  const postData = {
    title: activeTab.title,
    url: activeTab.url
  };
  return postData;
}

// when on a webpage, open the matching posts in a new tab
async function doOpenMatchingPostsLemmy(testURL) {
  const browserAPI = getBrowserAPI();
  const selectedType = await getSetting('selectedType');

  if (await hasSelectedInstance() && await hasSelectedType()) {
    if (selectedType === "lemmy") {
      const selectedInstance = await getSetting('selectedInstance');

      const searchURL = selectedInstance + "/api/v3/search?q=" + testURL;
      const [lemmyPostResponse_URL, lemmyPostResponse_BODY] = await Promise.all([
        fetch(searchURL + "&type_=Url"),
        fetch(searchURL + "&type_=All")
      ]);
      lemmyPostData = {
        posts: [
          ...(await lemmyPostResponse_URL.json()).posts,
          ...(await lemmyPostResponse_BODY.json()).posts
        ]
      };
      if (lemmyPostData.posts.length <= 0) {
        alert("No posts found for this URL.");
      } else if (lemmyPostData.posts.length === 1) {
        lemmyPostData.posts.forEach(post => {
          const post_id = post.counts.post_id;
          console.log("Post ID:", post_id);
          browserAPI.tabs.create({ url: selectedInstance + "/post/" + post_id });
        });
      } else if (lemmyPostData.posts.length > 1) {
        // tell user how many posts there are and ask if it's ok to open them
        const confirmOpen = confirm("There are " + lemmyPostData.posts.length + " posts for this URL. Open them all?");
        if (confirmOpen) {
          lemmyPostData.posts.forEach(post => {
            const post_id = post.counts.post_id;
            console.log("Post ID:", post_id);
            browserAPI.tabs.create({ url: selectedInstance + "/post/" + post_id });
          });
        }
      }
    } else if (selectedType === "kbin") {
      alert("This feature is not yet available for Kbin instances.");
    }
  } else { alert("No valid instance has been set. Please select an instance in the popup using 'Change my home instance'."); }
}

async function doOpenMatchingPostsKbin(testURL) {
  // TODO: Implement this
  alert("This feature is not yet available for Kbin instances.");
}

// When on a webpage, post it to a community
async function doCreatePost() {
  const browserAPI = getBrowserAPI();
  if (await hasSelectedInstance() && await hasSelectedType()) {
    const postData = await p2l_getPostData();

    const instance = await getSetting("selectedInstance");
    const type = await getSetting("selectedType");

    if (type === "lemmy") {
      const url = instance + "/create_post";      
      const createdTab = await browserAPI.tabs.create({ url: url });
      const listener = (tabId, changeInfo) => {
        if (tabId === createdTab.id && (changeInfo.status === "complete" || changeInfo.status === "loading")) {
          

          browserAPI.tabs.onUpdated.removeListener(listener);

          // Fill in form after the tab is fully loaded
          browserAPI.scripting.executeScript({
            target: { tabId: createdTab.id },
            func: async (postData) => {
              const EVENT_OPTIONS = {bubbles: true, cancelable: false, composed: true};
              const EVENTS = {
                  BLUR: new Event("blur", EVENT_OPTIONS),
                  CHANGE: new Event("change", EVENT_OPTIONS),
                  INPUT: new Event("input", EVENT_OPTIONS),
              };
          
              const postTitleInput = document.querySelector("#post-title");
              const postURLInput = document.querySelector("#post-url");
          
              postTitleInput.select();
              postTitleInput.value = postData.title;
              postTitleInput.dispatchEvent(EVENTS.INPUT);
          
              postURLInput.select();
              postURLInput.value = postData.url;
              postURLInput.dispatchEvent(EVENTS.INPUT);
            },
            args: [postData]
          }).catch(error => {
            console.error("Script execution error:", error);
          });

          window.close(); 
        }
      };

      browserAPI.tabs.onUpdated.addListener(listener);

    } else if (type === "kbin") {
      const url = instance + "/new?url=" + postData.url + "&title=" + postData.title;
      await browserAPI.tabs.create({ url: url });
    }
  } else { alert("No valid instance has been set. Please select an instance in the popup using 'Change my home instance'."); }
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