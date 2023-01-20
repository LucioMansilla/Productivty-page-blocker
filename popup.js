document.getElementById("add").addEventListener("click", function () {
  // Get the URL from the input field
  let url = document.getElementById("url").value;
  // Clear the input field
  document.getElementById("url").value = "";

  // Add "https://" to the URL if it's not already there
  if (!/^https?:\/\//i.test(url)) {
    //check if it start with 'www'
    if (!/^www\./i.test(url)) {
      url = "www." + url;
    }
    url = "https://" + url;
  }

  // Get the current list of blocked URLs from storage
  chrome.storage.local.get("blockedUrls", function (result) {
    // If the list doesn't exist, create an empty one
    let blockedUrls = result.blockedUrls || [];
    blockedUrls.push(url);
    // Save the updated list to storage
    chrome.storage.local.set({ blockedUrls: blockedUrls }, function () {
      showBlockedUrls();
    });
  });
});

createListButton();
createClearButton();


function createBlockedUrlsHTML(blockedUrls) {
    let blockedUrlsHTML = "";
    blockedUrls.forEach(function(url, index) {
      blockedUrlsHTML += `${url} <img class="delete" data-index="${index}" src="assets/p-delete.png" style="width:15px; height:12px;"> <br>`;
    });
    return blockedUrlsHTML;
  }
  
  function addDeleteButtonListeners(blockedUrls) {
    const deleteButtons = document.getElementsByClassName("delete");
    for (let i = 0; i < deleteButtons.length; i++) {
      deleteButtons[i].addEventListener("click", function() {
        const index = this.getAttribute("data-index");
        blockedUrls.splice(index, 1);
        chrome.storage.local.set({ blockedUrls: blockedUrls }, function () {
          showBlockedUrls();
        });
      });
    }
  }
  
  function showBlockedUrls() {
    chrome.storage.local.get("blockedUrls", function (result) {
      let blockedUrls = result.blockedUrls || [];
      if (blockedUrls.length == 0) {
        document.getElementsByClassName("list-sites")[0].style.fontSize = "13px"
        document.getElementsByClassName("list-sites")[0].innerHTML = "There are no blocked URLs, improve your productivity!";
        setTimeout(function() {
            document.getElementsByClassName("list-sites")[0].innerHTML = "";
            createListButton();
            createClearButton();
        }, 2000);
      } else {
        document.getElementsByClassName("list-sites")[0].innerHTML = createBlockedUrlsHTML(blockedUrls);
        document.getElementsByClassName("list-sites")[0].style.fontSize = "15px";
        document.getElementsByClassName("list-sites")[0].innerHTML += "<hr>";
        addDeleteButtonListeners(blockedUrls);  
      
        const hideButton = document.createElement("button");
        hideButton.id = "hide";
        hideButton.innerHTML = "Hide";
        document.getElementsByClassName("list-sites")[0].appendChild(hideButton);
        createClearButton();

        hideButton.addEventListener("click", function () {
            document.getElementsByClassName("list-sites")[0].innerHTML = "";
            createListButton();
            createClearButton();
            chrome.windows.getCurrent(function (currentWindow) {
                chrome.windows.update(currentWindow.id, { height: 200 });
                }
            );
        }
        );
      }
      
    });
  }
  
function createListButton() {
  const listButton = document.createElement("button");
  listButton.id = "list";
  listButton.innerHTML = "See Blocked sites";
  document.getElementsByClassName("list-sites")[0].appendChild(listButton);
  listButton.addEventListener("click", showBlockedUrls);
}

function createClearButton() {
  const clearButton = document.createElement("button");
  clearButton.id = "clear";
  clearButton.innerHTML = "Clear Blocked sites list";
  clearButton.style.marginLeft = "2px";
  document.getElementsByClassName("list-sites")[0].appendChild(clearButton);
  clearButton.addEventListener("click", function () {
    chrome.storage.local.set({ blockedUrls: [] }, function () {
      showBlockedUrls();
    });
  });
}
