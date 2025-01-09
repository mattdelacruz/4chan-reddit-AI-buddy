const saveApiKey = async (keyId, storageKey, prefix = '') => {
    const inputElement = document.querySelector(keyId);
    let apiKey = inputElement?.value.trim();

    console.log(apiKey);

    if (apiKey) {
        if (prefix && apiKey.startsWith(prefix)) {
            apiKey = apiKey.substring(prefix.length);
        }
        try {
            await browser.storage.local.set({ [storageKey]: apiKey });
            console.log(`${storageKey} saved successfully.`);
        } catch (error) {
            console.error(`Error saving ${storageKey}:`, error);
            alert(`Failed to save ${storageKey}. See console for details.`);
        }
    } else {
        console.error(`${storageKey} is empty.`);
        alert(`Please enter a valid ${storageKey}.`);
    }
};

document.querySelector('#chatgpt-save-key').addEventListener('click', () => {
    saveApiKey('#chatgpt-api-key', 'CHATGPT_API_KEY', 'sk-');
});

document.querySelector('#gemini-save-key').addEventListener('click', () => {
    saveApiKey('#gemini-api-key', 'GEMINI_API_KEY');
});

document.querySelector('#save-model').addEventListener('click', () => {
    const selectedModel = document.querySelector('.ai-model-selection').value;
    browser.storage.local.set({ 'AI_MODEL': selectedModel })
        .then(() => {
            console.log('Model saved successfully');
        })
        .catch((error) => {
            console.error('Error saving model:', error);
        });
});