try {
    importScripts("../node_modules/webextension-polyfill/dist/browser-polyfill.js", "background.js");
} catch (e) {
    console.log(e);
}