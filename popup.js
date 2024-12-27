document.getElementById("addSite").addEventListener("click", () => {
  const site = document.getElementById("site").value;
  if (site) {
    chrome.storage.sync.get("blockedSites", ({ blockedSites }) => {
      blockedSites[site] = true;
      chrome.storage.sync.set({ blockedSites });
      displayBlockedSites();
    });
  }
});

document.getElementById("setPassword").addEventListener("click", () => {
  const password = document.getElementById("password").value;
  chrome.storage.sync.set({ password });
  alert("Password set successfully!");
});

function displayBlockedSites() {
  chrome.storage.sync.get("blockedSites", ({ blockedSites }) => {
    const blockedSitesList = document.getElementById("blockedSites");
    blockedSitesList.innerHTML = "";
    for (const site in blockedSites) {
      const listItem = document.createElement("li");
      listItem.textContent = site;
      blockedSitesList.appendChild(listItem);
    }
  });
}

displayBlockedSites();
