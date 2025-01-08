document.querySelector('#save-key').addEventListener('click', async () => {
    let apiKey = document.querySelector('#api-key').value.trim();
    console.log(apiKey);
    if (apiKey) {
        const prefix = 'sk-';
        if (apiKey.startsWith(prefix)) {
            apiKey = apiKey.substring(prefix.length);
        }
        try {
            await browser.storage.local.set({ OAApiKey: apiKey });
            console.log("API key saved successfully.");
        } catch (error) {
            console.error("Error saving API key:", error);
            alert("Failed to save API key. See console for details.");
        }
    } else {
        console.error("API key is empty.");
        alert("Please enter an API key.");
    }
});