// ============================================================= //
// General content manipulation
// ============================================================= //

setTimeout(async () => {
  if (isLemmyCommunity(window.location.href) ||
    isKbinCommunity(window.location.href) ||
    isLemmyCommunityList(window.location.href)) {

    // --------------------------------------
    // Hide sidebar
    // --------------------------------------
    const hideSidebarLemmy = await getSetting('hideSidebarLemmy');
    const hideSidebarKbin = await getSetting('hideSidebarKbin');

    // Hide on Lemmy
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

    // Hide on Kbin
    if (hideSidebarKbin && isKbinCommunity(window.location.href)) {
      // TODO: Hide sidebar
    }


    // --------------------------------------
    // Subscribe on home instance from community list page
    // --------------------------------------

    if (isLemmyCommunityList(window.location.href) && !(await isHomeInstance(window.location.href)) && !(isLoggedInLemmy())) {

      const subscribeButtons = document.querySelectorAll('#community_table tbody tr td:last-child .btn-link');

      subscribeButtons.forEach(async button => {
        const communityName = button.closest('tr').querySelector('td:first-child a').getAttribute('href').split('/c/')[1];
        const domain = new URL(window.location.href).hostname;
        const inputURL = `https://${domain}/c/${communityName}`;

        const newURL = await getCommunityRedirectURL(inputURL);

        const newButton = document.createElement('a');
        newButton.classList.add('btn', 'btn-link', 'd-inline-block');
        newButton.style = `
          background-color: #054da7;
          color: #e0e0e0;
          border-radius: 5px;
          /* Add any other custom styles here */
        `;
        newButton.textContent = 'Open in Home Instance';
        newButton.href = newURL;
        button.parentNode.replaceChild(newButton, button);
      });

      const lastColumnTitle = document.querySelector('#community_table thead tr th:last-child');
      lastColumnTitle.textContent = 'Open in Home Instance';
    }


  }
}, "500");
