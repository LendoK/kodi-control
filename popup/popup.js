
function startaction(action, id) {
    switch (action) {
        case "text":
            var string = document.getElementById("textfield");
            browser.runtime.sendMessage({ "text": string.value });
            break;
        case "Play/Pause":
            browser.runtime.sendMessage({ "selectedId": "playpause" });
            break;
        case "eye":
            browser.runtime.sendMessage({ "selectedId": "eye" });
            break;
        case "Play Media":
            browser.runtime.sendMessage({ "selectedId": "playmedia", "id": id });
            break;
        case "queue Media":
            browser.runtime.sendMessage({ "selectedId": "queue Media", "id": id });
            break;
        case "Stop":
            browser.runtime.sendMessage({ "selectedId": "b_stop" });
            break;
        case "playing":
            browser.runtime.sendMessage({ "selectedId": "playing" });
            break;
        case "mute":
            browser.runtime.sendMessage({ "selectedId": "b_volmute" });
            break;
        case "prev":
            browser.runtime.sendMessage({ "selectedId": "prev" });
            break;
        case "next":
            browser.runtime.sendMessage({ "selectedId": "next" });
            break;
        case "up":
            browser.runtime.sendMessage({ "selectedId": "up" });
            break;
        case "down":
            browser.runtime.sendMessage({ "selectedId": "down" });
            break;
        case "left":
            browser.runtime.sendMessage({ "selectedId": "left" });
            break;
        case "right":
            browser.runtime.sendMessage({ "selectedId": "right" });
            break;
        case "ok":
            browser.runtime.sendMessage({ "selectedId": "ok" });
            break;
        case "back":
            browser.runtime.sendMessage({ "selectedId": "back" });
            break;
        case "context":
            browser.runtime.sendMessage({ "selectedId": "context" });
            break;
        case "info":
            browser.runtime.sendMessage({ "selectedId": "info" });
            break;
        case "text":
            break;
        case "Send local file":
            openMyPage()
            break;
    }
}


function handleResponsePO(message) {
    if ("url" in message) {
        media = message.url;
        getDomainMediaList(message.url);
    }
    if ("volume" in message) {
        document.getElementById("volume").value = message.volume;
    }
    if ("muted" in message) {
        document.getElementById("mute").src = message.muted ? "/icons/mute.svg" : "/icons/audio.svg";
    }
}

function notifyBackgroundPage() {
    var sending = browser.runtime.sendMessage({
        greeting: "Greeting from the popup script", "onload": true
    });
    sending.then(handleResponsePO, handleError);
}

function OnKeyDown(e) {
    var key = e.key;
    switch (key) {
        case "ArrowUp":
            startaction("up", 0)
            break;
        case "ArrowDown":
            startaction("down", 0)
            break;
        case "ArrowLeft":
            startaction("left", 0)
            break;
        case "ArrowRight":
            startaction("right", 0)
            break;
        case "Enter":
            startaction("ok", 0)
            break;
        case "Backspace":
            startaction("back", 0)
            break;
        case "Space":
            startaction("right", 0)
            break;
        case "Control":
            startaction("context", 0)
            break;
    }
}

function OnWheel(e) {
    var delta = e.deltaY;
    if (delta < 0) {
        startaction("up", 0)
    } else {
        startaction("down", 0)
    }
}

function OnLoad() {
    notifyBackgroundPage();
}

function getDomainMediaList(mlist){
    // get current domain
    browser.tabs.query({currentWindow: true, active: true})
    .then((tabs) => {
        var domain = extractRootDomain(tabs[0].url);
        create_media_list(domain, mlist);
    })
}


function create_media_list(domain, mlist) {
    var list = document.getElementById("media_list");
    for (var i = mlist.length -1; i >= 0 ; i--) {
        if(domain == mlist[i]["domain"]){
            var container = document.createElement("div");
            var node = document.createElement("LI");                 // Create a <li> node
            var div = document.createElement("div");
            container.appendChild(div);
            var quere = document.createElement("div");
            quere.id = i;
            quere.className = "list item quere";
            container.appendChild(quere);

            if (mlist[i]["type"] == "youtube") {
                div.className = "list item youtube";
            } else {
                div.className = "list item mp4";
            }
            div.id = i;
            div.title = mlist[i]["name"];
            var textnode = document.createTextNode(mlist[i]["name"]);      // Create a text node
            if (mlist[i]["played"] == true) {
                div.style.color = "purple";
            }
            var domain_text = document.createTextNode(mlist[i]["domain"])
            div.appendChild(textnode);
            div.appendChild(document.createElement("br"));
            div.appendChild(domain_text);
            node.appendChild(container);
            list.appendChild(node);
        }
    }

}

function openMyPage() {
    browser.tabs.create({
        "url": "/local_files/local_files.html"
    });
}

document.addEventListener("click", (e) => {
    var id = 0;
    if (e.target.classList.contains("action")) {
        var action = e.target.id;
    }
    if (e.target.classList.contains("item")) {
        id = e.target.id;
        var action = "Play Media";
    }
    if (e.target.classList.contains("quere")) {
        action = "queue Media";
        id = e.target.id;
    }

    startaction(action, id);
});

window.addEventListener("load", OnLoad, false);
window.addEventListener("wheel", OnWheel, true);
window.addEventListener("keydown", OnKeyDown, true);

document.addEventListener("input", function (e) {
    browser.runtime.sendMessage({ "volume": e.target.value });
});


