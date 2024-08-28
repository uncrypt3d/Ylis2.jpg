// background.js

function log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    switch (type) {
        case 'info':
            console.log(`%c[INFO - ${timestamp}] ${message}`, 'color: blue');
            break;
        case 'warn':
            console.warn(`%c[WARN - ${timestamp}] ${message}`, 'color: orange');
            break;
        case 'error':
            console.error(`%c[ERROR - ${timestamp}] ${message}`, 'color: red');
            break;
        default:
            console.log(`[LOG - ${timestamp}] ${message}`);
    }
}

chrome.runtime.onInstalled.addListener(() => {
    log('Media Converter Extension installed');
});

chrome.runtime.onStartup.addListener(() => {
    log('Media Converter Extension started');
});

chrome.runtime.onSuspend.addListener(() => {
    log('Media Converter Extension suspended');
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "fetchImage") {
        fetch(request.url)
            .then(response => response.blob())
            .then(blob => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    sendResponse({ dataUrl: reader.result });
                };
                reader.readAsDataURL(blob);
            })
            .catch(error => {
                console.error('Fetch error:', error);
                sendResponse({ error: error.message });
            });
        return true;
    }
});
