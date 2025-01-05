class Chatbot {
	constructor() {
		this.initializeUI();
	}

	initializeUI() {
		this.avatar = document.createElement('div');
		this.avatar.id = 'floating-avatar';
		document.body.appendChild(this.avatar);

		this.avatarChat = document.createElement('div');
		this.avatarChat.id = 'avatar-chat';
		this.avatarChat.innerHTML = `
			<div id="chat-box">
			<div class="chat-messages" id="chatMessages"></div>
			</div>
		`;
		document.body.appendChild(avatarChat)

		this.avatarChat.style.display = 'none';

		avatar.addEventListener('click', () => {
			avatarChat.style.display = avatarChat.style.display === 'none' ? 'block' : 'none';
		});
	}

	addMessage(message) {
		const messages = document.getElementById('avatarChat');
		const messageBubble = document.createElement('div');
		messageBubble.textContent = `${message}`;
		messages.appendChild(messageBubble);
		messages.scrollTop = messages.scrollHeight;
	}

	async getChatbotResponse(message) {
		const result = await browser.storage.local.get(openaiApiKey);
		const openaiApiKey = result[openaiApiKey];
		if (!openaiApiKey) {
			this.addMessage('Bot', 'Please configure your OpenAI API key in the settings.');
			return;
		}

		try {
			const response = await fetch('https://api.openai.com/v1/chat/completions', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${openaiApiKey}`,
				},
				body: JSON.stringify({
					model: 'gpt-4',
					messages: [{ role: 'user', content: message }],
				}),
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();
			return data.choices[0].message.content;
		} catch (error) {
			console.error('Error communicating with OpenAI:', error.message);
			return 'Error fetching the response. Please check the console for details and try again later.';
		}
	}

	async getMessage(message) {
		const botResponse = await this.getChatbotResponse(message);
		this.addMessage(botResponse);
	}
}

