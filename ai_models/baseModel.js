class BaseAIModel {
    constructor(apiKeyStorageKey, apiUrl) {
        this.apiKeyStorageKey = apiKeyStorageKey;
        this.apiUrl = apiUrl;
    }

    async getApiKey() {
        const result = await browser.storage.local.get(this.apiKeyStorageKey);
        return result[this.apiKeyStorageKey];
    }

    async makeAPICall(requestOptions) {
        try {
            const response = await fetch(this.apiUrl, requestOptions);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            return { error: error.message };
        }
    }
}