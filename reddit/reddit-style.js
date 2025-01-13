const styles = {
    'Tomorrow': {
        color: '#C5C8C6',
        background: '#282A2E',
        border: '1px solid #282a2e',
        fontFamily: 'Arial, sans-serif',
        fontSize: '10pt',
    },
};

document.addEventListener('click', () => {
    const chatMessages = document.querySelector('#chat-messages');
    const chatBox = document.querySelector('#chat-box');

    chatMessages.style.color = styles['Tomorrow'].color;
    chatMessages.style.background = styles['Tomorrow'].background;
    chatMessages.style.fontFamily = styles['Tomorrow'].fontFamily;
    chatMessages.style.fontSize = styles['Tomorrow'].fontSize;
    chatBox.style.background = styles['Tomorrow'].background;
    chatBox.style.border = styles['Tomorrow'].border;
});