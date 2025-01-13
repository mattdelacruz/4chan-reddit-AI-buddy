class BaseAIModel {
    constructor(apiKeyStorageKey) {
        this.apiKeyStorageKey = apiKeyStorageKey;
    }

    async getApiKey() {
        const result = await browser.storage.local.get(this.apiKeyStorageKey);
        return result[this.apiKeyStorageKey];
    }

    async getImageBase64(imageUrl) {
        try {
            const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(imageUrl)}`;
            const response = await fetch(proxyUrl);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const blob = await response.blob();

            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result.split(",")[1]);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        } catch (error) {
            console.error('Error converting image to Base64 with proxy:', error);
            return null;
        }
    }
}