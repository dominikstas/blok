chrome.storage.sync.get(["blockedSites", "password"], ({ blockedSites, password }) => {
  const currentHostname = window.location.hostname.replace("www.", "");
  
  if (blockedSites[currentHostname]) {
    // Check if blocking is temporarily disabled and still valid
    const blockingDisabled = localStorage.getItem('blockingDisabled');
    const disabledTimestamp = localStorage.getItem('blockingDisabledTimestamp');
    
    if (blockingDisabled && disabledTimestamp) {
      const now = Date.now();
      if (now - parseInt(disabledTimestamp) < 600000) { // 10 minutes in milliseconds
        return;
      } else {
        // Clear expired temporary access
        localStorage.removeItem('blockingDisabled');
        localStorage.removeItem('blockingDisabledTimestamp');
      }
    }

    setTimeout(() => {
      const originalHTML = document.documentElement.innerHTML;
      const originalTitle = document.title;
      const originalHead = document.head.innerHTML;
      
      // Add the blocking banner
      document.body.innerHTML = `
        <div id="blocker" style="
          opacity: 0;
          transition: opacity 0.5s ease;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #f6d365 0%, #fda085 100%);
          color: #333;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        ">
          <div style="
            background: rgba(255, 255, 255, 0.9);
            padding: 3rem;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            text-align: center;
            max-width: 90%;
            width: 800px;
          ">
            <h1 id="mainTitle" style="
              font-size: 3.5rem;
              margin: 0 0 2rem 0;
              color: #ff6b6b;
              opacity: 0;
              transform: translateY(-20px);
              transition: opacity 0.5s ease, transform 0.5s ease;
            ">Time for a Break</h1>
            
            <div id="contentBox" style="
              background: #fff;
              border-radius: 15px;
              padding: 2rem;
              margin-bottom: 2rem;
              box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
            ">
              <p id="reflectionQuestion" style="
                font-size: 1.8rem;
                margin: 0;
                color: #4a4a4a;
                line-height: 1.6;
                opacity: 0;
                transform: translateY(20px);
                transition: opacity 0.5s ease, transform 0.5s ease;
              ">Is this really where you want to spend your time?</p>
            </div>
            
            <div id="timerDisplay" style="
              font-size: 2.5rem;
              color: #ff6b6b;
              margin-bottom: 2rem;
              font-weight: 700;
            ">10:00</div>
            
            <div id="passwordContainer" style="display: none;">
              <input id="passwordInput" type="password" placeholder="Enter password to continue" style="
                width: 100%;
                padding: 1rem;
                margin-bottom: 1rem;
                border: 2px solid #ff6b6b;
                border-radius: 10px;
                font-size: 1.2rem;
                outline: none;
                transition: all 0.3s ease;
              ">
              
              <button id="submitPassword" style="
                background: #ff6b6b;
                color: white;
                border: none;
                padding: 1rem 2rem;
                border-radius: 10px;
                font-size: 1.2rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                width: 100%;
              ">Continue</button>
            </div>

          </div>
        </div>
      `;

      // Fade in the blocker
      setTimeout(() => {
        document.getElementById("blocker").style.opacity = "1";
        document.getElementById("mainTitle").style.opacity = "1";
        document.getElementById("mainTitle").style.transform = "translateY(0)";
        document.getElementById("reflectionQuestion").style.opacity = "1";
        document.getElementById("reflectionQuestion").style.transform = "translateY(0)";
      }, 100);

      // Reflection questions
      const questions = [
        "Is this really where you want to spend your time?",
        "What's your main goal for today?",
        "How will this site help you achieve that goal?",
        "Is there a more productive activity you could be doing right now?",
        "What would your future self thank you for doing instead?"
      ];
      let currentQuestion = 0;

      // Rotate questions
      setInterval(() => {
        currentQuestion = (currentQuestion + 1) % questions.length;
        const questionElement = document.getElementById("reflectionQuestion");
        questionElement.style.opacity = "0";
        questionElement.style.transform = "translateY(20px)";
        setTimeout(() => {
          questionElement.textContent = questions[currentQuestion];
          questionElement.style.opacity = "1";
          questionElement.style.transform = "translateY(0)";
        }, 500);
      }, 10000);

      // Timer countdown
      let timeLeft = 600; // 10 minutes
      const timerDisplay = document.getElementById("timerDisplay");
      const timerInterval = setInterval(() => {
        timeLeft--;
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        if (timeLeft <= 0) {
          clearInterval(timerInterval);
          showPasswordInput();
        }
      }, 1000);

      // Show password input after 10 minutes
      const timer = setTimeout(() => {
        showPasswordInput();
      }, 600000);

      // Handle password submission
      document.getElementById("submitPassword").addEventListener("click", handlePasswordSubmit);

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
          handlePasswordSubmit();
        }
      });

      function showPasswordInput() {
        clearTimeout(timer);
        clearInterval(timerInterval);
        timerDisplay.style.display = 'none';
        document.getElementById("passwordContainer").style.display = "block";
        document.getElementById("contentBox").style.display = "none";
      }

      function handlePasswordSubmit() {
        const enteredPassword = document.getElementById("passwordInput").value;
        if (enteredPassword === password) {
          // Set temporary access with timestamp
          localStorage.setItem('blockingDisabled', 'true');
          localStorage.setItem('blockingDisabledTimestamp', Date.now().toString());
          
          const blocker = document.getElementById("blocker");
          blocker.innerHTML = `
            <div style="
              background: rgba(255, 255, 255, 0.9);
              padding: 3rem;
              border-radius: 20px;
              box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
              text-align: center;
              max-width: 90%;
              width: 800px;
            ">
              <h1 style="
                font-size: 3.5rem;
                margin: 0 0 2rem 0;
                color: #4a4a4a;
              ">Access Granted</h1>
              <div style="
                background: #fff;
                border-radius: 15px;
                padding: 2rem;
                margin-bottom: 2rem;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
              ">
                <p style="
                  font-size: 1.8rem;
                  margin: 0;
                  color: #4a4a4a;
                  line-height: 1.6;
                ">You have 10 minutes. Use them wisely!</p>
              </div>
              <p style="
                font-size: 1.2rem;
                color: #666;
              ">Refresh your page.</p>
            </div>
          `;
          
          setTimeout(() => {
            blocker.style.opacity = "0";
            setTimeout(() => {
              document.head.innerHTML = originalHead;
              document.body.innerHTML = originalHTML;
              document.title = originalTitle;
              
              // Reload scripts
              const scripts = Array.from(document.getElementsByTagName('script'));
              scripts.forEach(script => {
                if (script.src) {
                  const newScript = document.createElement('script');
                  newScript.src = script.src;
                  script.parentNode.replaceChild(newScript, script);
                } else if (script.textContent) {
                  const newScript = document.createElement('script');
                  newScript.textContent = script.textContent;
                  script.parentNode.replaceChild(newScript, script);
                }
              });
              
              document.dispatchEvent(new Event('DOMContentLoaded'));
            }, 500);
          }, 600000); // 10 minutes
        } else {
          const input = document.getElementById("passwordInput");
          input.style.borderColor = "#ff4757";
          input.style.animation = "shake 0.5s";
          setTimeout(() => {
            input.style.borderColor = "#ff6b6b";
          }, 1500);
        }
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
          border-color: #ff6b6b;
          box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.2);
        }

        #submitPassword:hover {
          background: #ff4757;
          transform: translateY(-2px);
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