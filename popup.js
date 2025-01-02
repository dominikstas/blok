document.addEventListener('DOMContentLoaded', () => {
  const setupContainer = document.getElementById('setupContainer');
  const mainContainer = document.getElementById('mainContainer');
  const errorElement = document.getElementById('error');

  // Initialize view state based on password existence
  function initializeView() {
    chrome.storage.sync.get(['password'], (result) => {
      if (result.password) {
        setupContainer.classList.remove('active');
        mainContainer.classList.add('active');
        displayBlockedSites();
      } else {
        setupContainer.classList.add('active');
        mainContainer.classList.remove('active');
      }
    });
  }

  // Call initialize on load
  initializeView();

  // Set Password
  document.getElementById('setPassword').addEventListener('click', () => {
    const password = document.getElementById('password').value;
    
    if (password.length < 6) {
      showError('Password must be at least 6 characters long');
      return;
    }

    chrome.storage.sync.set({ password }, () => {
      setupContainer.classList.remove('active');
      mainContainer.classList.add('active');
      document.getElementById('password').value = '';
      hideError();
      displayBlockedSites(); // Refresh the sites list after setting password
    });
  });

  // Add Site
  document.getElementById('addSite').addEventListener('click', () => {
    // First check if password exists
    chrome.storage.sync.get(['password'], (result) => {
      if (!result.password) {
        setupContainer.classList.add('active');
        mainContainer.classList.remove('active');
        showError('Please set a password first');
        return;
      }

      const site = document.getElementById('site').value;
      
      if (!site) {
        showError('Please enter a site to block');
        return;
      }

      // Clean the site URL
      const cleanSite = site.toLowerCase()
        .replace(/^(https?:\/\/)?(www\.)?/, '')
        .replace(/\/.*$/, '');

      chrome.storage.sync.get(['blockedSites'], (result) => {
        const blockedSites = result.blockedSites || {};
        
        if (blockedSites[cleanSite]) {
          showError('This site is already blocked');
          return;
        }

        blockedSites[cleanSite] = true;
        
        chrome.storage.sync.set({ blockedSites }, () => {
          displayBlockedSites();
          document.getElementById('site').value = '';
          hideError();
        });
      });
    });
  });

  function displayBlockedSites() {
    chrome.storage.sync.get(['blockedSites', 'password'], ({ blockedSites = {}, password }) => {
      // If no password is set, don't display sites
      if (!password) {
        return;
      }

      const blockedSitesList = document.getElementById('blockedSites');
      blockedSitesList.innerHTML = '';
      
      const sites = Object.keys(blockedSites);
      
      if (sites.length === 0) {
        blockedSitesList.innerHTML = `
          <div class="empty-state">
            No sites blocked yet
          </div>
        `;
        return;
      }

      sites.forEach(site => {
        const siteElement = document.createElement('div');
        siteElement.className = 'site-item';
        siteElement.innerHTML = `
          <span class="site-domain">${site}</span>
          <button class="remove-btn" data-site="${site}">×</button>
        `;
        blockedSitesList.appendChild(siteElement);
      });

      // Add event listeners to remove buttons
      document.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', (e) => {
          const siteToRemove = e.target.dataset.site;
          removeSite(siteToRemove);
        });
      });
    });
  }

  function removeSite(site) {
    chrome.storage.sync.get(['blockedSites', 'password'], ({ blockedSites = {}, password }) => {
      if (!password) {
        setupContainer.classList.add('active');
        mainContainer.classList.remove('active');
        showError('Please set a password first');
        return;
      }

      delete blockedSites[site];
      chrome.storage.sync.set({ blockedSites }, () => {
        displayBlockedSites();
      });
    });
  }

  function showError(message) {
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    errorElement.classList.remove('shake');
    void errorElement.offsetWidth; // Trigger reflow
    errorElement.classList.add('shake');
  }

  function hideError() {
    errorElement.style.display = 'none';
  }

  // Add keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      if (setupContainer.classList.contains('active')) {
        document.getElementById('setPassword').click();
      } else if (mainContainer.classList.contains('active')) {
        document.getElementById('addSite').click();
      }
    }
  });
});