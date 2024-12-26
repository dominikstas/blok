 // options.js
 document.getElementById('save').addEventListener('click', function() {
    const sites = document.getElementById('sites').value.split('\n').map(s => s.trim()).filter(s => s);
    const question = document.getElementById('question').value;
    const password = document.getElementById('password').value;
  
    chrome.storage.sync.set({
      sites: sites,
      question: question,
      password: password
    }, function() {
      alert('Ustawienia zostały zapisane!');
    });
  });
  
  document.addEventListener('DOMContentLoaded', function() {
    chrome.storage.sync.get(['sites', 'question', 'password'], function(result) {
      document.getElementById('sites').value = (result.sites || []).join('\n');
      document.getElementById('question').value = result.question || "Postawiłeś sobie cel, czemu chcesz go złamać?";
      document.getElementById('password').value = result.password || "";
    });
  });