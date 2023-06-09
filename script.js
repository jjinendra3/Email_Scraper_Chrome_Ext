let scraper = document.getElementById("scraper");
let list = document.getElementById("email_list");
//event listener from line chrome.runtime to display the emails
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  //get emails
  let emails = request.emails;
  //display those emails through list on the popup

  //distinctivize those emails
  var outputArray = [];
  var count = 0;
  var start = false;
  for (j = 0; j < emails.length; j++) {
    for (k = 0; k < outputArray.length; k++) {
      if (emails[j] == outputArray[k]) {
        start = true;
      }
    }
    count++;
    if (count == 1 && start == false) {
      outputArray.push(emails[j]);
    }
    start = false;
    count = 0;
  }
  //distinctivize those emails end
  if (outputArray === null || outputArray.length === 0) {
    let li = document.createElement("li");
    li.innerText = "No Emails";
    list.appendChild(li);
  } else {
    outputArray.forEach((email) => {
      if (email != "#") {
        let li = document.createElement("li");
        let anchor = document.createElement("a");
        anchor.href = "mailto:" + email;
        anchor.innerText = email;
        li.appendChild(anchor);
        list.appendChild(li);
      }
    });
  }
});
//debugging to start from here, main thing
scraper.addEventListener("click", async () => {
  //getting current active tab of the window
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  //script to parse emails on the webpage
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: scrape_emails,
  });
});
//defining fucntion scrapeemails
function scrape_emails() {
  //regex to parse the email text
  let emailregex = /[\w-\.]+@([\w-]+\.)+[\w-]{2,3}/gim;
  let emails = document.body.innerHTML.match(emailregex);
  //send message to the extension pop up itself
  chrome.runtime.sendMessage({ emails });
}
