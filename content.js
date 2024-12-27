chrome.storage.sync.get(["blockedSites", "password"], ({ blockedSites, password }) => {
  const currentHostname = window.location.hostname.replace("www.", "");
  console.log("Current Hostname: ", currentHostname);

  if (blockedSites[currentHostname]) {
    console.log("This site is blocked.");

    // Create a container to store the original content
    const contentContainer = document.createElement('div');
    contentContainer.innerHTML = document.body.innerHTML;

    // Add the blocking banner
    document.body.innerHTML = `
      <div id="blocker" style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        z-index: 9999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      ">
        <div style="
          background: rgba(255, 255, 255, 0.05);
          padding: 2.5rem 3rem;
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
          text-align: center;
          max-width: 90%;
          width: 500px;
        ">
          <h1 style="
            font-size: 1.8rem;
            margin: 0 0 1.5rem 0;
            font-weight: 600;
            line-height: 1.3;
            color: #ffffff;
          ">You said you'd cut social media.<br>Why go back?</h1>
          
          <p style="
            font-size: 1.1rem;
            margin: 0 0 2rem 0;
            color: #b3b3b3;
            line-height: 1.5;
          ">Wait for 1 minute to access the password input...</p>
          
          <input id="passwordInput" type="password" placeholder="Enter password" style="
            display: none;
            width: 100%;
            padding: 12px 16px;
            margin: 0 0 1rem 0;
            border: 2px solid #333;
            border-radius: 6px;
            background: rgba(255, 255, 255, 0.05);
            color: white;
            font-size: 1rem;
            transition: border-color 0.2s ease;
            outline: none;
          ">
          
          <button id="submitPassword" style="
            display: none;
            background: #2563eb;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 6px;
            font-size: 1rem;
            font-weight: 500;
            cursor: pointer;
            transition: background 0.2s ease;
          ">Submit</button>
        </div>
      </div>
    `;

    // Show password input after 1 minute
    const timer = setTimeout(() => {
      document.getElementById("passwordInput").style.display = "block";
      document.getElementById("submitPassword").style.display = "block";
    }, 60000);

    // Handle password submission
    document.getElementById("submitPassword").addEventListener("click", () => {
      const enteredPassword = document.getElementById("passwordInput").value;
      if (enteredPassword === password) {
        // Restore the original content properly
        document.body.innerHTML = contentContainer.innerHTML;
        // Restore any scripts that were in the original content
        Array.from(contentContainer.getElementsByTagName('script')).forEach(oldScript => {
          const newScript = document.createElement('script');
          Array.from(oldScript.attributes).forEach(attr => {
            newScript.setAttribute(attr.name, attr.value);
          });
          newScript.appendChild(document.createTextNode(oldScript.innerHTML));
          oldScript.parentNode.replaceChild(newScript, oldScript);
        });
        console.log("Access granted.");
      } else {
        alert("Incorrect password. Try again.");
      }
    });

    // Add keyboard shortcuts to skip the timer
    document.addEventListener("keydown", (event) => {
      // Secret key combination 1: Ctrl + Alt + S
      if (event.ctrlKey && event.altKey && event.key === "s") {
        showPasswordInput();
      }
      // Secret key combination 2: Double Escape
      if (event.key === "Escape") {
        const now = Date.now();
        if (now - lastEscPress < 500) { // Double press within 500ms
          showPasswordInput();
        }
        lastEscPress = now;
      }
    });

    let lastEscPress = 0;

    // Function to show password input (used by both shortcuts)
    function showPasswordInput() {
      clearTimeout(timer);
      document.getElementById("passwordInput").style.display = "block";
      document.getElementById("submitPassword").style.display = "block";
      console.log("Timer skipped using secret key.");
    }

    // Add hover effects for the button
    const submitButton = document.getElementById("submitPassword");
    submitButton.addEventListener("mouseenter", () => {
      submitButton.style.background = "#1d4ed8";
    });
    submitButton.addEventListener("mouseleave", () => {
      submitButton.style.background = "#2563eb";
    });

    // Add focus effects for the input
    const passwordInput = document.getElementById("passwordInput");
    passwordInput.addEventListener("focus", () => {
      passwordInput.style.borderColor = "#2563eb";
    });
    passwordInput.addEventListener("blur", () => {
      passwordInput.style.borderColor = "#333";
    });
  } else {
    console.log("This site is not blocked.");
  }
});