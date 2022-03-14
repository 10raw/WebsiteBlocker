
chrome.tabs.onUpdated.addListener(function(tabId,changeInfo,tab){
    // if (tab.url.indexOf("http://translate.google.hu/") > -1 && 
    //     changeInfo.url === undefined){
        chrome.runtime.reload()
      chrome.tabs.executeScript(tabId, {file: "blocksites.js"} );
    // }
  });