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

	async getChatbotResponse(message, imageUrl = null, threadContext = null, isNewThread = true, model) {
		let loadingTimeout;
		try {
			loadingTimeout = setTimeout(() => {
				this.addMessage('Chotto matte kudasai...');
			}, 5000);

			if (this.models.hasOwnProperty(model)) {
				const response = await this.models[model].generateResponse(message, imageUrl, threadContext, isNewThread);
				clearTimeout(loadingTimeout);

				this.addMessage(response);
				return response;
			} else {
				clearTimeout(loadingTimeout);

				const error = `Error: ${model} is not supported or configured.`;
				this.addMessage(error);
				return error;
			}
		} catch (error) {
			clearTimeout(loadingTimeout);

			const errorMessage = `Error: ${error.message}`;
			this.addMessage(errorMessage);
			return errorMessage;
		}
	}
}


