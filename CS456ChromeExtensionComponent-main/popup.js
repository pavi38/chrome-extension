//import {API_Key} from  "./utils.js";
//import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

// Access your API key (see "Set up your API key" above)
//const genAI = new GoogleGenerativeAI(API_Key);

let siteOrder = 1;

/*
document.addEventListener('DOMContentLoaded', function () {
  // (Inside the click listener)
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.executeScript(tabs[0].id, { file: "content.js" }, function (data) {
          // Data is an array of values, in case it was executed in multiple tabs/frames
          //download(data[0], "download.html", "text/html");
          document.getElementById("links").textContent = data[0];
      });
  });
});
*/

//Function for turning text into bullet points
const textToBulletPoints = async (input) => {
  // For text-only input, use the gemini-pro model
  const model = genAI.getGenerativeModel({ model: "gemini-pro"});

  const prompt = "Summarize the text into a list of bullet points and use '--' as the bullet point symbol: " + input;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  console.log(text);

  var output = document.getElementById('response');

  //Put all bullets in a list and append them to the list.
  const bullets = text.split('--');
  for(var i = 0; i < bullets.length; i++){
    let listItem = document.createElement('li');
    listItem.textContent = bullets[i];
    output.appendChild(listItem);
  }

  //Remove the first list element since its blank
  output.querySelector('li').remove();


}




//Function for changing the content between the list of links and the path of travel
const changeContent = ( tabSection)=> {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  console.log("Here in change content");
  document.getElementById(tabSection).style.display = "block";

  //If we are on the path of travel tab, then update the path of travel.
  if(tabSection == 'PathOfTravel'){
    console.log("About to get Url");
    getUrlOfWebsite(siteOrder);
    siteOrder++;

    var path = document.getElementById('path');
    path.innerHTML = "";
    chrome.storage.sync.get(all => {
      for (const [key, val] of Object.entries(all).sort((a, b) => b[1] - a[1])) {
        //console.log(key + " 2222222222");
        let link = document.createElement("h3");
        let downArrow = document.createElement("h2");
        link.textContent = key;
        downArrow.textContent = "↓";
        path.appendChild(link);
        path.appendChild(downArrow);
        
      }
    });
  }


  //evt.currentTarget.className += " active";

};

//Function for clearing the path of travel
const clearPath = () =>{
  chrome.storage.sync.clear();
  let path = document.getElementById('path');
  path.innerHTML = "";
  siteOrder = 1;

}


//Function that will get the url of the website
const getUrlOfWebsite = async (evt) => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.executeScript(tabs[0].id, { file: "content.js" }, function (data) {
      console.log("Test 3");
      console.log(evt);

      chrome.tabs.sendMessage(tabs[0].id, evt);
        // Data is an array of values, in case it was executed in multiple tabs/frames
        //download(data[0], "download.html", "text/html");
        //document.getElementById("links").textContent = data[0];
        //document.getElementById("links").style.border = "2px solid red";
    });
});

};




/*
  Function which will run when the mouse hovers over a link.
*/
 const addRedBox = async (evt) => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.executeScript(tabs[0].id, { file: "content.js" }, function (data) {
      console.log("Test 1");
      console.log(evt);

      chrome.tabs.sendMessage(tabs[0].id, evt);
        // Data is an array of values, in case it was executed in multiple tabs/frames
        //download(data[0], "download.html", "text/html");
        //document.getElementById("links").textContent = data[0];
        //document.getElementById("links").style.border = "2px solid red";
    });
});

};


/*
  Function which will run when the mouse unhovers from a link.
*/ 
const removeRedBox = async () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.executeScript(tabs[0].id, {file: "content.js"}, function (data) {
      console.log("Test 2");

      chrome.tabs.sendMessage(tabs[0].id, "removeBox");

      //document.getElementById("links").style.border = "";
    });
});

};




document.addEventListener("DOMContentLoaded", () => {
  // null here defaults to active tab of current window
  /**
   * Find all the links by searching for all the a elements.
   * Add them to the list in the chrome extension.
   */
  chrome.tabs.executeScript(null, {
    code: `
        Array.from(document.querySelectorAll('a')).map(a => a.href);
    `
  }, response => {
    const pageData = response[0];
    console.log(pageData[0]);
    if (!pageData) {
      console.log("Could not get data from page.");
      return;
    }
    
    let listOfLinks = document.getElementById("links");

    
    for(let i = 0; i < pageData.length; i++){
      let a = document.createElement('a');
      let listItem = document.createElement('li');
      a.textContent = pageData[i];
      a.setAttribute('href', pageData[i]);
      listItem.appendChild(a);

      //Add event listeners for each link for when the mouse hovers over it and when it unhovers.
      listItem.addEventListener("mouseover", () => {addRedBox(pageData[i])});
      listItem.addEventListener("mouseout", removeRedBox);
      listOfLinks.appendChild(listItem);
      document.createElement('br');
    }

    

  });

document.getElementById("LinksButton").addEventListener('click', () => {changeContent('ListOfLinks')});
document.getElementById("PathOfTravelButton").addEventListener('click',  () => {changeContent('PathOfTravel')});
document.getElementById("TextBreakDownButton").addEventListener('click',  () => {changeContent('TextBreakDown')});
document.getElementById("Convert").addEventListener('click', () => {textToBulletPoints(document.getElementById("TextInput").value)});
document.getElementById("Clear").addEventListener('click', () => {clearPath()});

document.getElementById("PathOfTravel").style.display = "none";
document.getElementById("TextBreakDown").style.display = "none";


});