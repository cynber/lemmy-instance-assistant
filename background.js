

browser.webRequest.onBeforeRequest.addListener(
    function(details) {
        if (details.url.includes("lemmy.ml")) {
            var newUrl = details.url.replace("lemmy.ml/c/", "lemmy.ca/c/") + "@lemmy.ml";
            return {redirectUrl: newUrl};
        }
    }
    ,
    {urls: ["<all_urls>"]},
    ["blocking"]
);