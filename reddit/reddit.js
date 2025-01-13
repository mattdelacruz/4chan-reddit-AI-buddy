const systemInstruction = `You are a Redditor, you must respond like a Redditor and limit your responses to 150 characters or less.`;

const chatbot = new Chatbot(systemInstruction);

document.addEventListener('click', async (event) => {
    const commentContainer = event.target.closest('div[id*="-comment-rtjson-content"]');
    let commentText = null;

    if (commentContainer) {
        commentText = processCommentContainer(commentContainer);
        if (commentText) {
            const shredditTitleElement = document.querySelector('shreddit-title')
            const title = shredditTitleElement.getAttribute('title')
            await processComment(commentText, title);
        }
    }
});

async function processComment(comment, title) {
    try {
        const getModel = await browser.storage.local.get('AI_MODEL');
        const currModel = getModel['AI_MODEL'];
        if (!currModel) {
            chatbot.addMessage('Please select an AI model in the settings.');
            return;
        }
        const botResponse = await chatbot.getChatbotResponse(comment, null, title, false, model = currModel);

        chatbot.addMessage(botResponse);
    } catch (error) {
        console.error('Error processing comment:', error);
        chatbot.addMessage(`Error: ${error.message}`);
    }
}

function processCommentContainer(container) {
    const commentText = container.querySelector('p')?.textContent.trim() || 'No content';
    return commentText;
}