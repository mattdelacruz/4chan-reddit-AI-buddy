class Chatbot {
	constructor(systemInstruction = '') {
		this.initializeUI();
		this.models = {
			'gemini': new GeminiModel(systemInstruction),
			'gpt-4.0-turbo': new ChatGPT4Model()
		};
	}

	initializeUI() {
		this.avatar = document.createElement('div');
		this.avatar.id = 'floating-avatar';
		document.body.appendChild(this.avatar);

		this.avatarChat = document.createElement('div');
		this.avatarChat.id = 'avatar-chat';
		this.avatarChat.innerHTML = `
			<div id="chat-box">
			<div class="chat-messages" id="chat-messages"></div>
			</div>
		`;
		document.body.appendChild(this.avatarChat)

		this.avatarChat.style.display = 'none';

		this.avatar.addEventListener('click', () => {
			this.avatarChat.style.display = this.avatarChat.style.display === 'none' ? 'block' : 'none';
		});
	}

	addMessage(message) {
		const messages = document.querySelector('#chat-messages');
		messages.innerHTML = '';
		const messageBubble = document.createElement('div');
		messageBubble.textContent = `${message}`;
		messages.appendChild(messageBubble);
		messages.scrollTop = messages.scrollHeight;
		if (this.avatarChat.style.display === 'none') {
			this.avatarChat.style.display = 'block';
		}
	}

	async getChatbotResponse(message, imageUrl, threadContext = null, isNewThread = true, model = 'gemini') {
		if (this.models.hasOwnProperty(model)) {
			return await this.models[model].generateResponse(message, imageUrl, threadContext, isNewThread);
		} else {
			return `Error: ${model} is not support or configured.`;
		}
	}
}


