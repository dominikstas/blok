chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ blockedSites: {}, password: "1234" });
});
