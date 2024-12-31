const avatar = document.createElement('div');
avatar.id = 'floating-avatar';
document.body.appendChild(avatar);

const chatBox = document.createElement('div');
chatBox.id = 'chat-box';
chatBox.innerHTML =`
    <div id="chat-header">Chat with me! </div>
    <div id="chat-messages"><div>
    <div id="chat-input-container">
        <input id="chat-input" type="text" placeholder="Type a message">
        <button id="send-button">Send</button>
    </div>`;
document.body.appendChild(chatbox)

avatar.addEventListener('click', () => {
    chatBox.style.display = chatBox.style.display === 'none' ? 'block' : 'none';
});

document.querySelector('#send-button').addEventListener('click', async () => {
    const input = document.querySelector('#chat-input').ariaValueMax.trim();
    if (input) {
        addMessage('You', input);
        const botReply = await getChatbotResponse(input);
        addMessage('Bot', botReply);
        document.querySelector('#chat-input').value = '';
    }
});

function addMessage(sender, message) {
    const messages = document.querySelector('#chat-messages');
    const messageBubble = document.createElement('div');
    messageBubble.textContent = `${sender}: ${message}`;
    messages.appendChild(messageBubble);
    messages.scrollTop = messages.scrollHeight;
}

async function getChatbotResponse(message) {
    const { openaiApiKey } = await browser.storage.local.get('openaiApiKey');
    if (!openaiApiKey) {
        addMessage('Bot', "Please configure your OpenAI API key in the settings.");
        return;
      }
  
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiApiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [{ role: 'user', content: message }]
        })
      });
      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error communicating with OpenAI:', error);
      return 'Error fetching the response. Please try again later.';
    }
  }