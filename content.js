chrome.storage.sync.get(["blockedSites", "password"], ({ blockedSites, password }) => {
  const currentHostname = window.location.hostname.replace("www.", "");
  console.log("Current Hostname: ", currentHostname);

  if (blockedSites[currentHostname]) {
    console.log("This site is blocked.");

    // Add the blocking banner
    document.body.innerHTML = `
      <div id="blocker" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: black; color: white; display: flex; align-items: center; justify-content: center; flex-direction: column; z-index: 9999;">
        <h1>You said you’d cut social media. Why go back?</h1>
        <p>Wait for 1 minute to access the password input...</p>
        <input id="passwordInput" type="password" placeholder="Enter password" style="display: none; margin-top: 20px;">
        <button id="submitPassword" style="display: none; margin-top: 10px;">Submit</button>
      </div>
    `;

    // Show password input after 1 minute
    setTimeout(() => {
      document.getElementById("passwordInput").style.display = "block";
      document.getElementById("submitPassword").style.display = "block";
    }, 60000);

    // Handle password submission
    document.getElementById("submitPassword").addEventListener("click", () => {
      const enteredPassword = document.getElementById("passwordInput").value;
      if (enteredPassword === password) {
        document.getElementById("blocker").remove();
      } else {
        alert("Incorrect password. Try again.");
      }
    });
  } else {
    console.log("This site is not blocked.");
  }
});
