let ON_CALL = false;
let IS_SUBTITLE_ON = false;

chrome.storage.sync.set({
    ON_CALL: false,
})

chrome.storage.sync.set({
    subtitleWarning: false,
});

const docObserver = new MutationObserver(() => {
    if (document.body.querySelector("div[jscontroller='kAPMuc']")) {
        ON_CALL = true;
        // Remove observer
        docObserver.disconnect();

        chrome.runtime.sendMessage({
            todo: "activate"
        });

        chrome.storage.sync.set({
            ON_CALL: true,
        })

        callStarts();
    }
});

docObserver.observe(document.body, {
    childList: true
});


function whenSubtitleOff() {
    chrome.storage.sync.set({
        subtitleWarning: true,
    });
};


function callStarts() {
    const subtitleDiv = document.querySelector("div[jscontroller='TEjq6e']");

    // To notify the first time
    IS_SUBTITLE_ON = subtitleDiv.style.display === "none" ? false : true;
    if (IS_SUBTITLE_ON) whenSubtitleOn();
    else whenSubtitleOff();

    const subtitleObserver = new MutationObserver(() => {
        IS_SUBTITLE_ON = subtitleDiv.style.display === "none" ? false : true;
        if (IS_SUBTITLE_ON) whenSubtitleOn();
        else whenSubtitleOff();
    });

    subtitleObserver.observe(subtitleDiv, {
        attributes: true,
        attributeOldValue: true,
        attributeFilter: ["style"],
    });
};