const chatbot = new Chatbot();
console.log("inside 4chan!");
if (window.location.hostname === "boards.4chan.org") {
  document.addEventListener('click', (event) => {
    if (event.target.closest('.post.reply')) {
      const postReply = event.target.closest('.post.reply');
      const postMessage = postReply.querySelector('.postMessage');

      if (postMessage) {
        const quoteLinks = postMessage.querySelectorAll('.quotelink');
        const quoteLinkTexts = Array.from(quoteLinks).map(link => link.textContent);
        const clone = postMessage.cloneNode(true);

        clone.querySelectorAll('.quotelink').forEach(link => link.remove());

        const restText = clone.textContent.trim();

        console.log('quote:', quoteLinkTexts);
        console.log('reply:', restText);
        chatbot.getMessage(restText);
      }
    }
  });
}