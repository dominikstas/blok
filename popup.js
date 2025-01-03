document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const passwordSection = document.getElementById('passwordSection');
  const blockerSection = document.getElementById('blockerSection');
  const passwordForm = document.getElementById('passwordForm');
  const blockedSitesList = document.getElementById('blockedSitesList');
  const siteForm = document.getElementById('siteForm');
  const notification = document.getElementById('notification');

  // Initialize the view
  function initializeView() {
    chrome.storage.sync.get(['password'], (result) => {
      if (result.password) {
        passwordSection.classList.add('hidden');
        blockerSection.classList.remove('hidden');
        loadBlockedSites();
      } else {
        passwordSection.classList.remove('hidden');
        blockerSection.classList.add('hidden');
      }
    });
  }

  // Handle password submission
  passwordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const password = document.getElementById('passwordInput').value;
    
    if (password.length < 6) {
      showNotification('Password must be at least 6 characters', 'error');
      return;
    }

    chrome.storage.sync.set({ password }, () => {
      showNotification('Password saved successfully', 'success');
      passwordForm.reset();
      initializeView();
    });
  });

  // Handle website submission
  siteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const siteInput = document.getElementById('siteInput');
    const site = siteInput.value.trim();

    if (!site) {
      showNotification('Please enter a website', 'error');
      return;
    }

    // Clean the URL
    const cleanSite = site.toLowerCase()
      .replace(/^(https?:\/\/)?(www\.)?/, '')
      .replace(/\/.*$/, '');

    chrome.storage.sync.get(['blockedSites'], (result) => {
      const blockedSites = result.blockedSites || {};
      
      if (blockedSites[cleanSite]) {
        showNotification('This website is already blocked', 'error');
        return;
      }

      blockedSites[cleanSite] = true;
      chrome.storage.sync.set({ blockedSites }, () => {
        showNotification('Website blocked successfully', 'success');
        siteForm.reset();
        loadBlockedSites();
      });
    });
  });

  // Load and display blocked sites
  function loadBlockedSites() {
    chrome.storage.sync.get(['blockedSites'], (result) => {
      const blockedSites = result.blockedSites || {};
      blockedSitesList.innerHTML = '';

      if (Object.keys(blockedSites).length === 0) {
        blockedSitesList.innerHTML = `
          <div class="empty-state">
            <p>No websites blocked yet</p>
          </div>
        `;
        return;
      }

      Object.keys(blockedSites).forEach(site => {
        const siteElement = document.createElement('div');
        siteElement.className = 'site-item';
        siteElement.innerHTML = `
          <span>${site}</span>
          <button class="delete-btn" data-site="${site}">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        `;
        blockedSitesList.appendChild(siteElement);
      });

      // Add delete event listeners
      document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const siteToDelete = e.currentTarget.dataset.site;
          delete blockedSites[siteToDelete];
          chrome.storage.sync.set({ blockedSites }, () => {
            showNotification('Website unblocked', 'success');
            loadBlockedSites();
          });
        });
      });
    });
  }

  // Show notification
  function showNotification(message, type) {
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.remove('hidden');
    
    setTimeout(() => {
      notification.classList.add('hidden');
    }, 3000);
  }

  // Change password button
  document.getElementById('changePasswordBtn').addEventListener('click', () => {
    passwordSection.classList.remove('hidden');
    blockerSection.classList.add('hidden');
  });

  // Initialize the popup
  initializeView();
});