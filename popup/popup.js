document.querySelector('#save-key').addEventListener('click', async () => {
    const apiKey = document.querySelector('#api-key').value.trim();
    if (apiKey) {
        if (!apiKey.startsWith('sk-')) {
            alert('Invalid API key format.');
            return;
          }
      await browser.storage.local.set({ openaiApiKey: apiKey });
      alert('API key saved!');
    }
  });