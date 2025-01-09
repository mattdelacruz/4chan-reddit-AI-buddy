
class ChatGPT4Model extends BaseAIModel {
    constructor() {
        super('CHATGPT_API_KEY', 'https://api.openai.com/v1/chat/completions');
    }

    async generateResponse(message, imageUrl) {
        const openaiApiKey = await this.getApiKey();
        if (!openaiApiKey) {
            return 'Please configure your OpenAI API key in the settings.';
        }

        let messages = [
            { role: 'user', content: message }
        ];

        if (imageUrl) {
            messages.push({
                role: 'system',
                content: imageUrl,
                type: 'image_url'
            });
        }

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${openaiApiKey}`,
            },
            body: JSON.stringify({
                model: 'gpt-4',
                messages: messages,
            }),
        };

        const response = await this.makeAPICall(requestOptions);
        if (response.error) {
            return `Error communicating with OpenAI: ${response.error}`;
        }
        return response.choices[0].message.content;
    }
}