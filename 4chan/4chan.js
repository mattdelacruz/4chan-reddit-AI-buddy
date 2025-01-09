const systemInstruction = `You are a 4chan user, you must respond like a 4chan user and limit your responses to 150 characters or less.`;

const chatbot = new Chatbot(systemInstruction);

let threadContext = null;
let currThread = null;
let isNewThread = false;

function processPostMessage(postMessage) {
  if (!postMessage) {
    console.error('Error: postMessage is null or undefined');
    return { quoteLinkTexts: [], cleanedText: '' };
  }

  const quoteLinks = postMessage.querySelectorAll('.quotelink');
  const quoteLinkTexts = Array.from(quoteLinks).map(link => link.textContent);

  const clone = postMessage.cloneNode(true);

  clone.querySelectorAll('.quotelink').forEach(link => link.remove());

  const restText = clone.textContent.trim();

  return {
    quoteLinkTexts: quoteLinkTexts,
    cleanedText: restText
  };
}

async function processPost(postElement, type) {
  const getModel = await browser.storage.local.get('AI_MODEL');
  const currModel = getModel['AI_MODEL'];

  if (!currModel) {
    chatbot.addMessage('Please select an AI model in the settings.');
    return;
  }

  if (type === 'reply') {
    threadContext = document.querySelector('.thread .post.op .postMessage').textContent;
    if (threadContext != currThread) {
      currThread = threadContext;
      isNewThread = true;
    } else {
      isNewThread = false;
    }
  }

  let postPictureUrl = null;
  const postMessage = postElement.querySelector('.postMessage');
  const postNumber = postElement.querySelector('.postInfo .postNum a').href.split('#p')[1];

  if (postElement.querySelector('.fileThumb')) {
    postPictureUrl = postElement.querySelector('.fileThumb').href;
  }

  if (postMessage) {
    const result = processPostMessage(postMessage);
    botResponse = await chatbot.getChatbotResponse(result.cleanedText, postPictureUrl, threadContext, isNewThread, currModel);
    chatbot.addMessage(`>>${postNumber}\n` + botResponse);
  }
}

if (window.location.hostname === "boards.4chan.org") {
  document.addEventListener('click', (event) => {
    const postElement = event.target.closest('.post');
    if (!postElement) return;

    const opPost = event.target.closest('.post.op');
    const replyPost = event.target.closest('.post.reply');

    if (opPost) {
      processPost(opPost, 'op');
    } else if (replyPost) {
      processPost(replyPost, 'reply');
    }
  });
}
