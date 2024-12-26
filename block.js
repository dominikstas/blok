// block.js
let timeLeft = 30;
let timerId;

document.addEventListener('DOMContentLoaded', function() {
  chrome.storage.sync.get(['question'], function(result) {
    document.getElementById('question').textContent = result.question;
  });

  timerId = setInterval(function() {
    timeLeft--;
    document.getElementById('timer').textContent = timeLeft;
    
    if (timeLeft <= 0) {
      clearInterval(timerId);
      document.getElementById('unlockForm').style.display = 'block';
      document.getElementById('timer').style.display = 'none';
    }
  }, 1000);
});

document.getElementById('unlock').addEventListener('click', function() {
  const enteredPassword = document.getElementById('passwordInput').value;
  
  chrome.storage.sync.get(['password'], function(result) {
    if (enteredPassword === result.password) {
      window.history.back();
    } else {
      alert('Nieprawidłowe hasło!');
    }
  });
});