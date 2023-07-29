document.addEventListener('DOMContentLoaded', () => {

  // Function to fetch and search the 'community' JSON file
  async function searchCommunities(query) {
    try {
      const response = await fetch('https://data.lemmyverse.net/data/community.full.json');
      const data = await response.json();

      // Perform the search
      const searchTerm = query.toLowerCase();
      const searchResults = data.filter((community) =>
        community.name.toLowerCase().includes(searchTerm)
      );

      // Sort the results by most monthly active users
      searchResults.sort((a, b) => b.counts.users_active_month - a.counts.users_active_month);

      return searchResults;

    } catch (error) {
      console.error('Error fetching or processing data:', error);
      return [];
    }
  }

  // Function to display search results on the page
  async function displayResults(results) {

    // get home instance & type
    const { selectedInstance } = await browser.storage.local.get('selectedInstance');
    const { selectedType } = await browser.storage.local.get('selectedType');

    let newURL = '';
    let hasHomeInstance = false;

    if (!selectedInstance || !selectedType) {
      // no instance or type selected
    } else {
      hasHomeInstance = true;
      newURL = (selectedType == 'lemmy') ? selectedInstance + '/c/' : selectedInstance + '/m/';
    }

    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';

    if (results.length === 0) {
      resultsContainer.innerHTML = '<p>No matching communities found.</p>';
    } else {
      results.forEach((community) => {
        const communityCard = document.createElement('div');
        communityCard.classList.add('community-card');

        // If no home instance is selected, use the community's baseurl
        if (hasHomeInstance == false) {
          newURL = 'https://' + community.baseurl + '/c/';
        }

        // Use placeholder icon if none is provided
        if (!community.icon) {
          community.icon = '../img/icon-lemm-noIcon.png';
        }

        // Use placeholder icon if tagged 'nsfw'
        if(community.nsfw == true) {
          community.icon = '../img/icon-lemm-nsf.png';
        }

        // Create the HTML content for each community card
        const communityHTML = `
          <img src="${community.icon}" alt="Community Icon" class="community-icon">
          <h3><a href="${newURL}${community.name}@${community.baseurl}" target="_blank">${community.name}@${community.baseurl}</a></h3>
          <p><strong>Title:</strong> ${community.title}</p>
          <p><strong>Description:</strong> ${community.desc}</p>
          <p><strong>Subscribers:</strong> ${community.counts.subscribers}</p>
          <p><strong>Posts:</strong> ${community.counts.posts}</p>
          <p><strong>Comments:</strong> ${community.counts.comments}</p>
        `;

        communityCard.innerHTML = communityHTML;
        resultsContainer.appendChild(communityCard);
      });
    }
  }

  // Event listener for the search form submission
  document.getElementById('searchForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const searchQuery = document.getElementById('searchQuery').value;
    const searchResults = await searchCommunities(searchQuery);
    displayResults(searchResults);
  });

  // Open lemmyverse.net
  document.getElementById('open-lemmyverse').addEventListener('click', () => {
    window.open('https://lemmyverse.net/', '_blank');
  });

  // ---------------------------------------------------------
  // ---------- Handle Searches from URL Parameters ----------
  // ---------------------------------------------------------

  // Function to extract the search query from URL parameters
  function getSearchQueryFromURL() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get('query') || ''; // Return the query parameter or an empty string if not found
  }

  // Perform a search on page load using the search query from URL parameters
  const searchQueryFromURL = getSearchQueryFromURL();
  if (searchQueryFromURL) {
    document.getElementById('searchQuery').value = searchQueryFromURL;
    searchCommunities(searchQueryFromURL)
      .then((searchResults) => displayResults(searchResults))
      .catch((error) => console.error('Error during initial search:', error));
  }
});
