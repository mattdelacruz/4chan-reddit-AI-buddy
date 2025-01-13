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

let currStyle = 'none';

document.getElementById('styleSelector').addEventListener('change', function () {
    let selectedStyle = this.value;
    changeStyle(selectedStyle);
    currStyle = selectedStyle;
});

document.addEventListener('click', () => {
    let style = document.getElementById('styleSelector').value
    console
    if (style !== currStyle) {
        this.changeStyle(style);
        currStyle = style;
    }
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