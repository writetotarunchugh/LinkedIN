//let scrapeEmails=document.getElementById('scrapeEmails');
let viewDiv=document.getElementById("ViewData");

// Handler to receive data from Content Script
chrome.runtime.onMessage.addListener((request,sender,sendResponse) => 
{
// Get Data
let Data=request.ExtractData;   

if(Data==null || Data==0)
{
viewDiv.innerHTML="Not a valid page";
}
else
{
    viewDiv.innerHTML=Data;
}

})

//scrapeEmails.addEventListener("click",async()=>{
    window.addEventListener("load",async()=>{  

//Get current active tab

let [tab]=await chrome.tabs.query({active:true, currentWindow:true});

//Execute script to parse emails on page

chrome.scripting.executeScript({
    target:{tabId:tab.id},
    func:scrapeEmailsFromPage,
});

})
// Function to scrape emails
function scrapeEmailsFromPage()
{

//const emailRegEx= /[\w-\.]+@([\w-]+\.)+[\w-]{2,4}/gim;
//Parse emails from the HTML of the page

//let emails=document.body.innerHTML.match(emailRegEx);
//alert(emails);
let ProfileImg=document.body.querySelector(".pv-top-card-profile-picture__image.pv-top-card-profile-picture__image--show.ember-view");  
if(ProfileImg==null)
{
    ProfileImg=document.body.querySelector(".ember-view.profile-photo-edit__preview");
}
let ProfileURL=document.location; 
let Name=document.body.querySelector("h1.text-heading-xlarge.inline.t-24.v-align-middle.break-words").innerText;
let Description=document.body.querySelector("div.text-body-medium.break-words").innerText;
let Address=document.body.querySelector("span.text-body-small.inline.t-black--light.break-words").innerText;
let About=document.body.querySelector("div.inline-show-more-text.inline-show-more-text--is-collapsed.inline-show-more-text--is-collapsed-with-line-clamp.full-width").innerText;
let company=document.body.querySelector("div.inline-show-more-text.inline-show-more-text--is-collapsed.inline-show-more-text--is-collapsed-with-line-clamp.inline");
if(company!=null)
{company=company.innerText;}
else
{
    company="";
}
let Experience=document.body.querySelector("div.display-flex.flex-column.full-width").innerText;
let ExtractData="<br><b>Profile</b> = " + ProfileURL + "<br><b>Name</b> = " + Name + "<br><b>Description</b> = " + Description + "<br><b>Address</b> = " + Address  + "<br><b>Company</b> = " + company + "<br><b>Experience</b> = " + Experience + "<br><b>About</b> = " + About;

if(ProfileImg!=null)
{
    ExtractData="<img src='"+ ProfileImg.src + "'>" + ExtractData;
}
chrome.runtime.sendMessage({ExtractData});
}