class ChatGPT4Model extends BaseAIModel {
    constructor() {
        super('CHATGPT_API_KEY');
    }

    async generateResponse(message, imageUrl = null) {
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
                content: [
                    {
                        type: "image_url",
                        image_url: { url: imageUrl }
                    }
                ],
            });
        }

        const body = {
            model: 'gpt-4',
            messages: messages,
        };

        try {
            const response = await browser.runtime.sendMessage({
                action: "makeAPICall",
                model: "gpt-4.0-turbo",
                apiKey: openaiApiKey,
                body: body
            });

            if (response.error) {
                throw new Error(response.error);
            }
            return response.data.choices[0].message.content;
        } catch (error) {
            return `Error communicating with OpenAI: ${error.message}`;
        }
    }
}