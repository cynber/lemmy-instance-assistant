// ============================================================= //
// General content manipulation
// ============================================================= //

setTimeout(() => {
  if (isLemmyCommunity(window.location.href) || isKbinCommunity(window.location.href)) {

    async function hideSidebar() {
      const hideSidebarLemmy = await getSetting('hideSidebarLemmy');
      const hideSidebarKbin = await getSetting('hideSidebarKbin');

      if (hideSidebarLemmy && isLemmyCommunity(window.location.href)) {
        const sidebarSubscribed = document.getElementById("sidebarContainer");
        sidebarSubscribed.style.display = "none";
        removeClassByWildcard("site-sideba*");
        const serverInfo = document.getElementById("sidebarInfo");
        serverInfo.style.display = "none";

        const mainElement = document.querySelector('.community.container-lg main.col-12.col-md-8.col-lg-9');
        if (mainElement) {
          // if mainElement exists, remove the classes that make it small
          mainElement.classList.remove('col-12', 'col-md-8', 'col-lg-9');
          mainElement.classList.add('col-12');
        }
      }

      if (hideSidebarKbin && isKbinCommunity(window.location.href)) {
        // TODO: Hide sidebar
      }
    }

    hideSidebar();


  }
}, "500");
