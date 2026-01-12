document.addEventListener('DOMContentLoaded', () => {
  const chatBox = document.querySelector('.chat-window .chat');
  const inputEl = document.getElementById('input');
  const sendBtn = document.querySelector('.input-area button');
  const chatBtn = document.querySelector('.chat-button');
  const chatWindow = document.querySelector('.chat-window');
  const closeBtn = document.querySelector('.chat-window .close');

  // Open chat window
  if (chatBtn && chatWindow) {
    chatBtn.addEventListener('click', () => {
      chatWindow.style.display = 'flex';
    });
  }

  // Close chat window
  if (closeBtn && chatWindow) {
    closeBtn.addEventListener('click', () => {
      chatWindow.style.display = 'none';
    });
  }

  async function handleSend() {
    const msg = inputEl.value.trim(); // Remove leading/trailing whitespace
    if (!msg) return;

    // Log chat history
    if (typeof logChat === 'function') {
      logChat('user', msg);
    } else {
      console.error('logChat function is not defined');
    }

    // Add user message to chat
    chatBox.insertAdjacentHTML('beforeend', `<div class="user"><p>${msg}</p></div>`);
    chatBox.scrollTop = chatBox.scrollHeight; // Scroll to bottom
    logChat('user', msg);

    inputEl.value = ''; // Clear input
    sendBtn.disabled = true; // Disable send button

    let reply;
    try {
      reply = await getAIReply(msg); // Get AI reply from backend
    } catch {
      reply = '(Lỗi AI)';
    }

    // Add AI response to chat
    chatBox.insertAdjacentHTML('beforeend', `<div class="model"><p>${reply}</p></div>`);
    logChat('assistant', reply);

    sendBtn.disabled = false; // Enable send button
    inputEl.focus(); // Focus back on input
    chatBox.scrollTop = chatBox.scrollHeight; // Scroll to bottom

    syncChatLogs(); // Save chat history
  }

  // Set up send message mechanism
  sendBtn.addEventListener('click', handleSend);
  inputEl.addEventListener('keydown', e => {
    if (e.key === 'Enter') {  
      e.preventDefault();
      handleSend();
    }
  });

  // Sync chat logs
  function syncChatLogs() {
    const history = JSON.parse(localStorage.getItem('chatHistory') || '[]');
    // Example: Add new chat message to history (you can modify this as per your needs)
    localStorage.setItem('chatHistory', JSON.stringify(history));
  }
});

// Function to interact with backend (get AI reply)
async function getAIReply(userMessage) {
  const response = await fetch('http://127.0.0.1:3000/api/chat', {  // Make sure your backend is running on the correct endpoint
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ message: userMessage })
  });

  const data = await response.json();
  return data.reply;  // Return the reply received from the backend (which is AI's response)
}

