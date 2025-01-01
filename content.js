chrome.storage.sync.get(["blockedSites", "password"], ({ blockedSites, password }) => {
  const currentHostname = window.location.hostname.replace("www.", "");
  
  if (blockedSites[currentHostname]) {
    if (localStorage.getItem('blockingDisabled')) {
      return;
    }

    setTimeout(() => {
      const originalHTML = document.documentElement.innerHTML;
      const originalTitle = document.title;
      
      // Store the original head content separately
      const originalHead = document.head.innerHTML;
      
      // Add the blocking banner
      document.body.innerHTML = `
        <div id="blocker" style="opacity: 0; transition: opacity 0.5s ease;
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
            background: rgba(255, 255, 255, 0.08);
            padding: 4rem;
            border-radius: 24px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2),
                        0 0 0 1px rgba(255, 255, 255, 0.05);
            text-align: center;
            max-width: 95%;
            width: 600px;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
          ">
            <div style="
              width: 120px;
              height: 120px;
              background: #2563eb;
              border-radius: 50%;
              margin: 0 auto 2.5rem;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 0 30px rgba(37, 99, 235, 0.3);
            ">
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2a10 10 0 0 1 10 10 10 10 0 0 1-10 10A10 10 0 0 1 2 12"/>
                <path d="M12 8v8"/>
                <path d="M8 12h8"/>
              </svg>
            </div>

            <h1 style="
              font-size: 2.5rem;
              margin: 0 0 1.5rem 0;
              font-weight: 700;
              line-height: 1.3;
              color: #ffffff;
              letter-spacing: -0.5px;
            ">Take a Moment to Pause</h1>
            
            <p style="
              font-size: 1.3rem;
              margin: 0 0 2rem 0;
              color: #b3b3b3;
              line-height: 1.6;
            ">Is this really where you want to spend your time?<br>Your goals are waiting.</p>
            
            <div id="timerDisplay" style="
              font-size: 1.4rem;
              color: #2563eb;
              margin-bottom: 2.5rem;
              font-weight: 500;
            ">Waiting time: 60s</div>
            
            <input id="passwordInput" type="password" placeholder="Enter password to continue" style="
              display: none;
              width: 100%;
              padding: 16px 20px;
              margin: 0 0 1.5rem 0;
              border: 2px solid rgba(255, 255, 255, 0.1);
              border-radius: 12px;
              background: rgba(255, 255, 255, 0.05);
              color: white;
              font-size: 1.2rem;
              transition: all 0.2s ease;
              outline: none;
              box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
            ">
            
            <button id="submitPassword" style="
              display: none;
              background: #2563eb;
              color: white;
              border: none;
              padding: 18px 32px;
              border-radius: 12px;
              font-size: 1.2rem;
              font-weight: 500;
              cursor: pointer;
              transition: all 0.2s ease;
              box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
              width: 100%;
            ">Continue</button>

            <p style="
              font-size: 1rem;
              margin: 1.5rem 0 0 0;
              color: #666;
            ">Press Esc twice or Ctrl+Alt+S to skip timer</p>
          </div>
        </div>
      `;

      // Fade in the blocker
      setTimeout(() => {
        document.getElementById("blocker").style.opacity = "1";
      }, 100);

      // Timer countdown
      let timeLeft = 60;
      const timerDisplay = document.getElementById("timerDisplay");
      const timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `Waiting time: ${timeLeft}s`;
        if (timeLeft <= 0) {
          clearInterval(timerInterval);
          timerDisplay.style.display = 'none';
          showPasswordInput();
        }
      }, 1000);

      // Show password input after 1 minute
      const timer = setTimeout(() => {
        showPasswordInput();
      }, 60000);

      // Handle password submission
      document.getElementById("submitPassword").addEventListener("click", () => {
        const enteredPassword = document.getElementById("passwordInput").value;
        if (enteredPassword === password) {
          localStorage.setItem('blockingDisabled', 'true');
          
          const blocker = document.getElementById("blocker");
          blocker.style.opacity = "0";
          
          setTimeout(() => {
            // Restore HTML in two steps
            document.head.innerHTML = originalHead;
            document.body.innerHTML = originalHTML;
            document.title = originalTitle;
            
            // Reload all scripts
            const scripts = Array.from(document.getElementsByTagName('script'));
            scripts.forEach(script => {
              if (script.src) {
                const newScript = document.createElement('script');
                newScript.src = script.src;
                script.parentNode.replaceChild(newScript, script);
              } else if (script.textContent) {
                // Also handle inline scripts
                const newScript = document.createElement('script');
                newScript.textContent = script.textContent;
                script.parentNode.replaceChild(newScript, script);
              }
            });
            
            // Trigger a DOM content loaded event
            document.dispatchEvent(new Event('DOMContentLoaded'));
          }, 500);
        } else {
          const input = document.getElementById("passwordInput");
          input.style.borderColor = "#ef4444";
          input.style.animation = "shake 0.5s";
          setTimeout(() => {
            input.style.borderColor = "rgba(255, 255, 255, 0.1)";
          }, 1500);
        }
      });

      // Add keyboard shortcuts
      let lastEscPress = 0;
      document.addEventListener("keydown", (event) => {
        if (event.ctrlKey && event.altKey && event.key === "s") {
          showPasswordInput();
        }
        if (event.key === "Escape") {
          const now = Date.now();
          if (now - lastEscPress < 500) {
            showPasswordInput();
          }
          lastEscPress = now;
        }
        if (event.key === "Enter" && document.getElementById("passwordInput").style.display !== "none") {
          document.getElementById("submitPassword").click();
        }
      });

      function showPasswordInput() {
        clearTimeout(timer);
        clearInterval(timerInterval);
        timerDisplay.style.display = 'none';
        document.getElementById("passwordInput").style.display = "block";
        document.getElementById("submitPassword").style.display = "block";
        console.log("Timer skipped.");
      }

      // Add styles for animations
      const style = document.createElement('style');
      style.textContent = `
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }

        #passwordInput:focus {
          border-color: #2563eb !important;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2) !important;
        }

        #submitPassword:hover {
          background: #1d4ed8 !important;
          transform: translateY(-1px);
        }

        #submitPassword:active {
          transform: translateY(0);
        }
      `;
      document.head.appendChild(style);
    }, 1000); // Wait 1 second for page to load before showing block
  } else {
    console.log("This site is not blocked.");
  }
});

// Add a cleanup function to remove the blocking disabled flag when leaving the page
window.addEventListener('beforeunload', () => {
  localStorage.removeItem('blockingDisabled');
});
