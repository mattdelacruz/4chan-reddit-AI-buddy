const chatbot = new Chatbot();

const styles = {
  'Yotsuba New': {
    color: '#800000',
    background: '#F0E0D6',
    border: '1px solid #D9BFB7',
    fontFamily: 'Arial, sans-serif',
    fontSize: '10pt',
  },
  'Yotsuba B New': {
    color: '#000000',
    background: '#D6DAF0',
    border: '1px solid #B7C5D9',
    fontFamily: 'Arial, sans-serif',
    fontSize: '10pt',
  },
  'Futaba New': {
    color: '#800000',
    background: '#F0E0D6',
    border: 'none',
    fontFamily: 'Times New Roman, serif',
    fontSize: '12pt',
  },
  'Burichan New': {
    color: '#000000',
    background: '#D6DAF0',
    border: 'none',
    fontFamily: 'Times New Roman, serif',
    fontSize: '12pt',
  },
  'Tomorrow': {
    color: '#C5C8C6',
    background: '#282A2E',
    border: '1px solid #282a2e',
    fontFamily: 'Arial, sans-serif',
    fontSize: '10pt',
  },
  'Photon': {
    color: '#000000',
    background: '#DDDDDD',
    border: '1px solid #CCC',
    fontFamily: 'Arial, sans-serif',
    fontSize: '10pt',
  },
};

if (window.location.hostname === "boards.4chan.org") {
  const currStyle = document.getElementById('styleSelector').value
  changeStyle(currStyle);

  document.addEventListener('click', (event) => {
    // TODO: Add functionality to handle replies to posts.
    // TODO: Add functionality to grab the post number of the post being replied to.
    // TODO: Add functionality to grab the context of the thread based on OP post.
    // TODO: Add functionality to grab the context of the thread based on reply post.
    // TODO: Grab the picture of the post and determine if it's relevant to the conversation or not from the AI's perspective.
    function processPost(postElement, type) {
      const postMessage = postElement.querySelector('.postMessage');

      if (postMessage) {
        const quoteLinks = postMessage.querySelectorAll('.quotelink');
        const quoteLinkTexts = Array.from(quoteLinks).map(link => link.textContent);
        const clone = postMessage.cloneNode(true);

        clone.querySelectorAll('.quotelink').forEach(link => link.remove());

        const restText = clone.textContent.trim();

        console.log('quote:', quoteLinkTexts);
        console.log(type + ':', restText);
        chatbot.getMessage(restText);
      }
    }

    const opPost = event.target.closest('.post.op');
    const replyPost = event.target.closest('.post.reply');

    if (opPost) {
      processPost(opPost, 'op');
    } else if (replyPost) {
      processPost(replyPost, 'reply');
    }
  });

}

document.getElementById('styleSelector').addEventListener('change', function () {
  var selectedStyle = this.value;
  console.log(selectedStyle)
  changeStyle(selectedStyle);
});

function changeStyle(selectedStyle) {
  const selectedStyles = styles[selectedStyle];

  if (selectedStyles) {
    const chatMessages = document.querySelector('#chat-messages');
    const chatBox = document.querySelector('#chat-box');

    chatMessages.style.color = selectedStyles.color;
    chatMessages.style.background = selectedStyles.background;
    chatMessages.style.fontFamily = selectedStyles.fontFamily;
    chatMessages.style.fontSize = selectedStyles.fontSize;
    chatBox.style.background = selectedStyles.background;
    chatBox.style.border = selectedStyles.border;
  }
}
