// background.js
let blockedSites = [];
let motivationalQuestion = "Postawiłeś sobie cel, czemu chcesz go złamać?";
let password = "";

chrome.storage.sync.get(['sites', 'question', 'password'], function(result) {
  blockedSites = result.sites || [];
  motivationalQuestion = result.question || "Postawiłeś sobie cel, czemu chcesz go złamać?";
  password = result.password || "";
});

chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    const url = new URL(details.url);
    if (blockedSites.some(site => url.hostname.includes(site))) {
      return {
        redirectUrl: chrome.runtime.getURL("block.html")
      };
    }
    return { cancel: false };
  },
  { urls: ["<all_urls>"] },
  ["blocking"]
);
