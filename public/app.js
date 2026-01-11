// public/app.js
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('chat-form');
    const userInput = document.getElementById('user-input');
    const chatLog = document.getElementById('chat-log');
  
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const message = userInput.value.trim();
      if (message === '') return;
  
      // Kullanıcı mesajını ekranda göster
      appendMessage('user', message);
      userInput.value = '';
  
      try {
        const response = await fetch('/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ input: message })
        });
        const data = await response.json();
        if (data.error) {
          appendMessage('bot', `Hata: ${data.error}`);
        } else {
          appendMessage('bot', data.response);
        }
      } catch (error) {
        appendMessage('bot', `Hata: ${error.message}`);
      }
    });
  
    function appendMessage(sender, text) {
      const messageDiv = document.createElement('div');
      messageDiv.classList.add('message', sender);
      messageDiv.textContent = text;
      chatLog.appendChild(messageDiv);
      chatLog.scrollTop = chatLog.scrollHeight;
    }
  });
  