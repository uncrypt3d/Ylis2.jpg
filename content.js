const proxies = [
    "https://corsproxy.io/?url=",
    "https://cors-anywhere.herokuapp.com/",
    "https://api.allorigins.win/get?url=",
    "https://thingproxy.freeboard.io/fetch/"
];

let currentProxyIndex = 0;
let observer;

function startObserving() {
    console.log('Starting to observe media changes');
    observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.tagName === 'IMG') {
                    handleImage(node);
                }
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
    console.log('Observer initialized and listening for DOM changes');
}

function stopObserving() {
    if (observer) {
        observer.disconnect();
        console.log('Observer stopped');
    }
}

function handleImage(img) {
    console.log(`New media element detected: IMG`);
    console.log(`Processing media element: IMG`);

    if (!img.src.endsWith('.avif')) {
        console.log(`Image is not an AVIF format: ${img.src}`);
        return;
    }

    img.onload = () => {
        console.log(`Image loaded: ${img.src}`);
        clickAndConvert(img.src);
    };

    img.onerror = () => {
        console.error(`Image load failed: ${img.src}`);
    };

    if (img.complete) {
        img.onload();
    } else {
        img.src = img.src;
    }
}

function clickAndConvert(imageUrl) {
    console.log(`Clicking image to trigger full resolution: ${imageUrl}`);
    tryFetching(imageUrl);
}

function tryFetching(url) {
    if (currentProxyIndex >= proxies.length) {
        console.error('All proxies failed');
        return;
    }

    const proxy = proxies[currentProxyIndex];
    const proxiedUrl = proxy + encodeURIComponent(url);

    fetch(proxiedUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch: ${response.statusText}`);
            }
            return response.blob();
        })
        .then(blob => {
            const img = new Image();
            img.onload = () => {
                console.log('Image loaded for conversion');
                convertAvifToJpeg(img);
            };
            img.onerror = () => {
                console.error('Image load failed. Trying next proxy...');
                currentProxyIndex++;
                tryFetching(url);
            };
            img.src = URL.createObjectURL(blob);
        })
        .catch(error => {
            console.error('Fetching failed:', error);
            currentProxyIndex++;
            tryFetching(url);
        });
}

function convertAvifToJpeg(img) {
    console.log('Converting AVIF image to JPEG...');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    try {
        ctx.drawImage(img, 0, 0);
        const jpegUrl = canvas.toDataURL('image/jpeg');
        console.log('Downloaded JPEG image:', jpegUrl);

        const link = document.createElement('a');
        link.href = jpegUrl;
        link.download = `${generateRandomFilename()}.jpg`;
        link.click();
    } catch (error) {
        console.error('Failed to convert image:', error);
    }
}

function generateRandomFilename(length = 10) {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'startObserving') {
        startObserving();
    } else if (message.action === 'stopObserving') {
        stopObserving();
    }
});
