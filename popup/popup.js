document.querySelector('#save-key').addEventListener('click', async () => {
    const apiKey = document.querySelector('#api-key').value.trim();
    console.log(apiKey);
    if (apiKey) {
        if (!apiKey.startsWith('sk-')) {
            alert('Invalid API key format.');
            return;
        }
        try {
            await browser.storage.local.set({ openaiApiKey: apiKey });
            console.log("API key saved successfully.");
        } catch (error) {
            console.error("Error saving API key:", error);
            alert("Failed to save API key. See console for details.");
        }
    }
});