
class GeminiModel extends BaseAIModel {
    constructor(systemInstruction = '') {
        super('GEMINI_API_KEY');
        this.systemInstruction = systemInstruction;
    }

    async generateResponse(message, imageUrl = null, threadContext = null, isNewThread = true) {
        const geminiApiKey = await this.getApiKey();
        if (!geminiApiKey) {
            return 'Please configure your Google Gemini API key in the settings.';
        }

        const body = {
            "contents": [
                {
                    "parts": [
                        { "text": message }
                    ]
                }
            ],
            "generationConfig": {
                "maxOutputTokens": 75,
                "temperature": 0.1
            },
            "systemInstruction": {
                "parts": [{ "text": this.systemInstruction }],
            },
        };

        if (!isNewThread && threadContext) {
            body.systemInstruction.parts.push({ "text": `Context: ${threadContext}` });
        }

        try {
            const response = await browser.runtime.sendMessage({
                action: "makeAPICall",
                model: "gemini",
                apiKey: geminiApiKey,
                body: body
            });

            if (response.error) {
                throw new Error(response.error);
            }
            return response.data.candidates[0].content.parts[0].text;
        } catch (error) {
            return `Error communicating with Google Gemini: ${error.message}`;
        }
    }



}