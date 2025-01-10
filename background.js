browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
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

const modelEndpoints = {
    'gemini': 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
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

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "makeAPICall") {
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
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                sendResponse({ data });
            })
            .catch(error => {
                sendResponse({ error: error.message });
            });
        return true;
    }
});