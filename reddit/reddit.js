const systemInstruction = `You are a Redditor, you must respond like a Redditor and limit your responses to 150 characters or less.`;

const chatbot = new Chatbot(systemInstruction);

document.addEventListener('click', async (event) => {
    const commentContainer = event.target.closest('div[id*="-comment-rtjson-content"]');
    let commentText = null;

    if (commentContainer) {
        commentText = processCommentContainer(commentContainer);
        if (commentText) {
            await processComment(commentText);
        }
    }
});

async function processComment(comment) {
    try {
        const getModel = await browser.storage.local.get('AI_MODEL');
        const currModel = getModel['AI_MODEL'];
        if (!currModel) {
            chatbot.addMessage('Please select an AI model in the settings.');
            return;
        }
        const botResponse = await chatbot.getChatbotResponse(comment, null, null, false, model = currModel);

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