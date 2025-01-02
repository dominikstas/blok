document.getElementById("addSite").addEventListener("click", () => {
  const site = document.getElementById("site").value;
  
  if (site) {
    chrome.storage.sync.get(["blockedSites", "password"], (result) => {
      // Check if password exists
      if (!result.password) {
        alert("Please set a password before blocking sites.");
        return;
      }

      // Initialize blockedSites if it doesn't exist
      const blockedSites = result.blockedSites || {};
      blockedSites[site] = true;
      
      chrome.storage.sync.set({ blockedSites }, () => {
        displayBlockedSites();
        document.getElementById("site").value = ""; // Clear input field
      });
    });
  }
});

document.getElementById("setPassword").addEventListener("click", () => {
  const password = document.getElementById("password").value;
  
  if (!password) {
    alert("Please enter a valid password.");
    return;
  }

  chrome.storage.sync.set({ password }, () => {
    alert("Password set successfully!");
    document.getElementById("password").value = ""; // Clear password field
  });
});

function displayBlockedSites() {
  chrome.storage.sync.get("blockedSites", ({ blockedSites = {} }) => {
    const blockedSitesList = document.getElementById("blockedSites");
    blockedSitesList.innerHTML = "";
    
    Object.keys(blockedSites).forEach(site => {
      const listItem = document.createElement("li");
      listItem.textContent = site;
      
      // Add remove button
      const removeButton = document.createElement("button");
      removeButton.textContent = "Remove";
      removeButton.onclick = () => removeSite(site);
      listItem.appendChild(removeButton);
      
      blockedSitesList.appendChild(listItem);
    });
  });
}

function removeSite(site) {
  chrome.storage.sync.get(["blockedSites", "password"], (result) => {
    if (!result.password) {
      alert("Please set a password before modifying blocked sites.");
      return;
    }

    const blockedSites = result.blockedSites || {};
    delete blockedSites[site];
    
    chrome.storage.sync.set({ blockedSites }, () => {
      displayBlockedSites();
    });
  });
}

// Initialize the display
displayBlockedSites();