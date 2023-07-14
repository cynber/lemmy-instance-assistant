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