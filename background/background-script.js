const modelEndpoints = {
    'gemini': 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
    'gpt-4.0-turbo': 'https://api.openai.com/v1/chat/completions'
};

const modelHeaders = {
    'gemini': () => ({
        'Content-Type': 'application/json',
    }),
    'gpt-4.0-turbo': (apiKey) => ({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
    })
};

// Function to log response to the server
async function logToServer(responseData) {
    try {
        const response = await fetch('http://localhost:3000/log', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                response: responseData,
                timestamp: new Date().toISOString()
            })
        });

        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }

        console.log('Log sent successfully:', await response.json());
    } catch (error) {
        console.error('Error sending log to server:', error);
    }
}

browser.runtime.onMessage.addListener((request, _sender, sendResponse) => {
    if (request.action === "makeAPICall") {
        console.log("Received API call request:", request);
        const { model, apiKey, body } = request;
        if (!modelEndpoints[model] || !modelHeaders[model]) {
            sendResponse({ error: `Unsupported model: ${model}` });
            return false;
        }

        const apiUrl = modelEndpoints[model];
        const fetchOptions = {
            method: 'POST',
            headers: modelHeaders[model](apiKey),
            body: JSON.stringify(body)
        };

        fetch(`${apiUrl}${model === 'gemini' ? `?key=${apiKey}` : ''}`, fetchOptions)
            .then(async response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();

                // Extract and log actual AI output and in the input
                const inputText = body.contents?.[0]?.parts?.[0]?.text || "[Missing input]";
                const textOutput =
                    data?.candidates?.[0]?.content?.parts?.[0]?.text ||
                    "[No response text found]";
                // Extract system instruction and thread context separately
                const systemParts = body.systemInstruction?.parts || [];
                const system_instruction = systemParts[0]?.text || "[None]";
                const thread_context = systemParts.length > 1
                    ? systemParts.slice(1).map(p => p.text).join("\n")
                    : null;

                await logToServer({
                    system_instruction: system_instruction,
                    thread_context: thread_context,
                    input: inputText,
                    output: textOutput,
                    model: model
                });

                sendResponse({ data });
            })
            .catch(error => {
                console.error("Fetch error:", error);
                sendResponse({ error: error.message });
            });
        return true; // Keep the message channel open for async response
    }

    if (request.action === "getModel") {
        browser.storage.local.get("AI_MODEL").then((result) => {
            sendResponse({ model: result.AI_MODEL || null });
        });
        return true;
    }

    if (request.action === "saveModel") {
        browser.storage.local.set({ AI_MODEL: request.model }).then(() => {
            sendResponse({ success: true });
        });
        return true;
    }
});