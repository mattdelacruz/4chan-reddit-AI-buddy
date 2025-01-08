class Chatbot {
	constructor() {
		this.initializeUI();
	}

	initializeUI() {
		this.avatar = document.createElement('div');
		this.avatar.id = 'floating-avatar';
		document.body.appendChild(this.avatar);

		this.avatarChat = document.createElement('div');
		this.avatarChat.id = 'avatarChat';
		this.avatarChat.innerHTML = `
			<div id="chat-box">
			<div class="chat-messages" id="chatMessages"></div>
			</div>
		`;
		document.body.appendChild(this.avatarChat)

		this.avatarChat.style.display = 'none';

		this.avatar.addEventListener('click', () => {
			this.avatarChat.style.display = this.avatarChat.style.display === 'none' ? 'block' : 'none';
		});
	}

	addMessage(message) {
		const messages = document.getElementById('chatMessages');
		messages.innerHTML = '';
		const messageBubble = document.createElement('div');
		console.log(message)
		messageBubble.textContent = `${message}`;
		messages.appendChild(messageBubble);
		messages.scrollTop = messages.scrollHeight;
	}

	async getChatbotResponse(message) {
		const result = await browser.storage.local.get('OAApiKey');
		const openaiApiKey = result['OAApiKey'];
		if (!openaiApiKey) {
			return 'Please configure your OpenAI API key in the settings.';
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
			return `Error communicating with OpenAI: ${error.message}`;
		}
	}

	async getMessage(message) {
		const botResponse = await this.getChatbotResponse(message);
		this.addMessage(botResponse);
		if (this.avatarChat.style.display === 'none') {
			this.avatarChat.style.display = 'block';
		}
	}
}

