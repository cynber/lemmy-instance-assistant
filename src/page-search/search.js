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
  function displayResults(results) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';

    if (results.length === 0) {
      resultsContainer.innerHTML = '<p>No matching communities found.</p>';
    } else {
      results.forEach((community) => {
        const communityCard = document.createElement('div');
        communityCard.classList.add('community-card');

        // Create the HTML content for each community card
        const communityHTML = `
          <img src="${community.icon}" alt="Community Icon" class="community-icon">
          <h3>${community.name}@${community.baseurl}</h3>
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
});
