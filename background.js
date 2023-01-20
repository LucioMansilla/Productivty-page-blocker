( () => {
  chrome.tabs.onUpdated.addListener((tabId, tab) => {
      chrome.storage.local.get("blockedUrls", function(result) {
        let blockedUrls = result.blockedUrls || [];
      
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          var activeTab = tabs[0];

          
          if (activeTab.url && blockedUrls.some(url => activeTab.url.includes(url))) {
            chrome.tabs.update(tabId, {url: "http://www.google.com"});
          }{

            blockedUrls.forEach(element => {
             const elementwithoutwww = element.replace("www.", "")
              if (activeTab.url && activeTab.url.includes(elementwithoutwww)) {
                chrome.tabs.update(tabId, {url: "http://www.google.com"});
              }
            });
          }
      });

      });
  });
})();


