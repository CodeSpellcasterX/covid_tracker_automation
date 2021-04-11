
const pup = require('puppeteer');

let browserPromise = pup.launch({
    headless: false,
    defaultViewport: false
});
let sitelink = "https://www.covid19india.org/";
let state = "India";  // can be changed for different states

let headingarr = []; // array made to contain all headings
let detailsarrfinal = []; // final details about particular state
let detailsarr = []; // details of all states
let tab; // on which we will be working
let ans = {}; // Final answer will be stored in it
let statearr = []; // names of states
let count = 0; // To count the Ranking of the state among others in terms of total confirmed covid cases
browserPromise.then(function(browser){
    let pagesPromise = browser.pages();
    return pagesPromise; // promise regarding to bring addresses of all tabs open
}).then(function(pages){
    tab = pages[0]; // first tab open
    let pageOpenPromise = tab.goto(sitelink); // visint the site from where we will extract data
    return pageOpenPromise; 
}).then(function(){
    let waitPromise = tab.waitForSelector(".cell.heading", {visible : true}); // waiting for the visibility of headings to put in headingarr... Line(11)
    return waitPromise;
}).then(function(){
    let allheadingsPromise = tab.$$(".cell.heading"); // promise to have all the headings with this unique class
    return allheadingsPromise;
}).then(function(data){
    for(let i of data) {
        let innertext = tab.evaluate(function(ele){
            return ele.textContent; // promise of extracting inner element from the data for headings
        },i);
        headingarr.push(innertext);
    }
    return Promise.all(headingarr);
}).then(function(data){
    headingarr = data; // all heading we got...  Line(11)
    let allstatesPromise = tab.$$(".state-name.fadeInUp"); // to get states name
    return allstatesPromise;
}).then(function(data){
    for(let i of data){
        let innertext = tab.evaluate(function(ele){
            return ele.textContent; // promise of extracting inner element from the data for states name
        },i);
        statearr.push(innertext);
    }
    return Promise.all(statearr);
}).then(function(data){
    statearr = data // We got the ranking of all states in India... line(16)
    // console.log(data);
    count = data.indexOf(state); // We got the ranking of the state all over India in terms of total confirmed covid cases.... Line(17)
    // console.log(count);
    return data;
}).then(function(data){
    let allstatesPromise = tab.$$(".state-name.fadeInUp"); // promises of treversing over states to collect the covid details of all states
    return allstatesPromise;
}).then(function(data){
    for(let i in data){
            let detailsPromise = tab.$$(".cell.statistic .total"); // promises of all specific details for all states
            return detailsPromise;
    }
}).then(function(data){
    for(let i of data){
        let innertext = tab.evaluate(function(ele){
            return ele.textContent; // got inner content for all the promises internal data
        },i);
        detailsarr.push(innertext);
    }
    return Promise.all(detailsarr); // returned the Promises of all internal data
}).then(function(data){
    detailsarr = data; // all details we got...  Line(13)
    let start = (count)*6;
    let end = (count+1)*6-1; // Mathematics involved to track all data for our specific state
    for(let k = start;k<=end;k++){
        detailsarrfinal.push(data[k]); // pushing the details which are relevent to us..... line(12)
    }
    for(let a = 0;a<7;a++){
        if(a==0){
            ans[headingarr[a]] = state; // since 1st property involve state name that can be extracted from state variable
            continue; 
        }
        ans[headingarr[a]] = detailsarrfinal[a-1]; // completing ans object
    }
    return ans;
}).then(function(arr){
    if(state==="India"){
        console.log("Rank -> -----" ); // India will have No rank
    }else{
        console.log(`Rank -> ${count+1}`); // using count we can show the rank of the state in india in terms of highest no. of confirmed covid cases
    }
    console.log(ans); // our final ans for which this project is made for... line(15)
}).catch(function(err){
    console.log("Check your spelling again..."); // error handling using catch
});


