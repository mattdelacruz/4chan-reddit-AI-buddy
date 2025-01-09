
class GeminiModel extends BaseAIModel {
    constructor(systemInstruction = '') {
        super('GEMINI_API_KEY', 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent');
        this.systemInstruction = systemInstruction;
    }

    async generateResponse(message, imageUrl, threadContext = null, isNewThread = true) {
        const geminiApiKey = await this.getApiKey();
        if (!geminiApiKey) {
            return 'Please configure your Google Gemini API key in the settings.';
        }

        const baseInstruction = { text: this.systemInstruction };

        let body = {
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
                "parts": [baseInstruction],
            },
        };

        if (isNewThread) {
            body.systemInstruction.parts = [baseInstruction];
        } else if (threadContext) {
            body.systemInstruction.parts.push({ text: `Context: ${threadContext}` });
        }
        // Can only be used for the pro version
        // if (imageUrl) {
        //     const base64Image = await this.getImageBase64(imageUrl);
        //     body.contents[0].parts.push({
        //         "inlineData": {
        //             "mimeType": "image/png",
        //             "data": base64Image
        //         }
        //     });
        // }

        try {
            const response = await fetch(`${this.apiUrl}?key=${geminiApiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.candidates[0].content.parts[0].text;
        } catch (error) {
            return `Error communicating with Google Gemini: ${error.message}`;
        }
    }




}