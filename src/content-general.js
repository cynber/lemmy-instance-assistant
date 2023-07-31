
setTimeout(() => {
    
    const CURRENT_HOST = new URL(window.location.href).hostname;
    const CURRENT_PATH = new URL(window.location.href).pathname;

}, "500");

function isLemmySite() {
    return (
        document.querySelector('meta[name="Description"]').content === "Lemmy"
      );
}
