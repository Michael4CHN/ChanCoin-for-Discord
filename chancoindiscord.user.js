// ==UserScript==
// @name         ChanCoin-for-Discord
// @namespace    https://github.com/Michael4CHN/ChanCoin-for-Discord
// @version      1
// @description A ChanCoin browser extension for Discord
// @author       https://github.com/Michael4CHN
// @match        *discordapp.com/channels/*
// @grant        GM_xmlhttpRequest
// ==/UserScript==

function send4CHN(address) {
    var amount = prompt("How much 4CHN would you like to send to " + address + "?", "0");
    if(amount==="" || /^\s+$/.test(amount)) {
        alert("ERROR! Please enter a number.");
    }
    else if(parseFloat(amount) < 0.00000001) {
        alert("ERROR! Value must be greater than or equal to 0.00000001.");
    }
    else if(amount!==null) {
        GM_xmlhttpRequest({
            method: "POST",
            url: "http://username:password@127.0.0.1:43814",
            data: '{"method": "sendtoaddress", "params":["' + address + '",' + amount + ']}',
            headers: {
                "Content-Type": "application/json-rpc"
            },
            onload: function (response) {
                if(JSON.parse(response.responseText).error !== null) {
                    alert("An error occurred.");
                }
                else {
                    alert("Success! You sent " + amount + " 4CHN to " + address + ".");
                }
            }
        });
    }
}

var mutationObserver = window.MutationObserver;
var myObserver       = new mutationObserver (mutationHandler);
var obsConfig        = {
    childList: true, attributes: true,
    subtree: true,   attributeFilter: ['class']
};

myObserver.observe (document, obsConfig);

function mutationHandler (mutationRecords) {
    mutationRecords.forEach ( function (mutation) {
        if (mutation.type == "childList" && typeof mutation.addedNodes  == "object" && mutation.addedNodes.length) {
            for (var J = 0, L = mutation.addedNodes.length;  J < L;  ++J) {
                checkForCSS_Class (mutation.addedNodes[J], "message-group");
            }
        }
        else if (mutation.type == "attributes") {
            checkForCSS_Class (mutation.target, "message-group");
        }
    } );
}

function checkForCSS_Class (node, className) {
    if (node.nodeType === 1) {
        if (node.classList.contains (className) ) {
            msg = node.children[1].children[0].children[0].children[1].children[1].innerText;
            for(var i = 0; i < msg.split(' ').length; i++) {
                if(msg.split(' ')[i].length == 34) {
                    var address = msg.split(' ')[i];
                    a = node.children[1].children[0].children[0].children[1];
                    var b = document.createElement("img");
                    b.className = "btn-reaction";
                    b.setAttribute("src","https://i.imgur.com/B6QHwcg.png");
                    b.addEventListener("click",(function(){send4CHN(address);}));
                    a.insertBefore(b,a.children[0]);
                }
            }
        }
    }
}
