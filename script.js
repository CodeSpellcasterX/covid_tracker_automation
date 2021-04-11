// script.js file is the actual code that is running
// result.txt will display and store the data of the required states
//  script1.txt is the input area for us

const pup = require('puppeteer');

const fs = require("fs");
let data = fs.readFileSync("script1.txt", "utf-8").split("\r\n"); // to read input from script1.js file
let fans = "";       // data to be stored in result.txt;

if(data.length==2){
    console.log("Enter any state Name");
    return;
}

for (let z = 1; z < data.length - 1; z++) {

    let browserPromise = pup.launch({
        headless: false,
        defaultViewport: false
    });
    let state = data[z];
    let headingarr = []; // array made to contain all headings
    let detailsarrfinal = []; // final details about particular state
    let detailsarr = []; // details of all states
    let tab; // on which we will be working
    let ans = {}; // Final answer will be stored in it
    let statearr = []; // names of states
    let count = 0; // To count the Ranking of the state among others in terms of total confirmed covid cases
    let sitelink = "https://www.covid19india.org/";
    browserPromise.then(function (browser) {
        let pagesPromise = browser.pages();
        return pagesPromise; // promise regarding to bring addresses of all tabs open
    }).then(function (pages) {
        tab = pages[0]; // first tab open
        let pageOpenPromise = tab.goto(sitelink); // visit the site from where we will extract data
        return pageOpenPromise;
    }).then(function () {
        let waitPromise = tab.waitForSelector(".cell.heading", { visible: true }); // waiting for the visibility of headings to put in headingarr... Line(23)
        return waitPromise;
    }).then(function () {
        let allheadingsPromise = tab.$$(".cell.heading"); // promise to have all the headings with this unique class
        return allheadingsPromise;
    }).then(function (data) {
        for (let i of data) {
            let innertext = tab.evaluate(function (ele) {
                return ele.textContent; // promise of extracting inner element from the data for headings
            }, i);
            headingarr.push(innertext);
        }
        return Promise.all(headingarr);
    }).then(function (data) {
        headingarr = data; // all heading we got...  Line(23)
        let allstatesPromise = tab.$$(".state-name.fadeInUp"); // to get states name
        return allstatesPromise;
    }).then(function (data) {
        for (let i of data) {
            let innertext = tab.evaluate(function (ele) {
                return ele.textContent; // promise of extracting inner element from the data for states name
            }, i);
            statearr.push(innertext);
        }
        return Promise.all(statearr);
    }).then(function (data) {
        statearr = data // We got the ranking of all states in India... line(28)
        // console.log(data);
        count = data.indexOf(state); // We got the ranking of the state all over India in terms of total confirmed covid cases.... Line(29)
        // console.log(count);
        return data;
    }).then(function (data) {
        let allstatesPromise = tab.$$(".state-name.fadeInUp"); // promises of treversing over states to collect the covid details of all states
        return allstatesPromise;
    }).then(function (data) {
        for (let i in data) {
            let detailsPromise = tab.$$(".cell.statistic .total"); // promises of all specific details for all states
            return detailsPromise;
        }
    }).then(function (data) {
        for (let i of data) {
            let innertext = tab.evaluate(function (ele) {
                return ele.textContent; // got inner content for all the promises internal data
            }, i);
            detailsarr.push(innertext);
        }
        return Promise.all(detailsarr); // returned the Promises of all internal data
    }).then(function (data) {
        detailsarr = data; // all details we got...  Line(25)
        let start = (count) * 6;
        let end = (count + 1) * 6 - 1; // Mathematics involved to track all data for our specific state
        for (let k = start; k <= end; k++) {
            detailsarrfinal.push(data[k]); // pushing the details which are relevent to us..... line(24)
        }
        for (let a = 0; a < 7; a++) {
            if (a == 0) {
                ans[headingarr[a]] = state; // since 1st property involve state name that can be extracted from state variable
                continue;
            }
            ans[headingarr[a]] = detailsarrfinal[a - 1]; // completing ans object
        }
        return ans;
    }).then(function (arr) {
        if (state === "India") {
            console.log("Rank -> No Rank"); // India will have No rank
            fans = fans + ("Rank -> No Rank");
            fans = fans + "\n";
        } else {
            console.log(`Rank -> ${count + 1}`); // using count we can show the rank of the state in india in terms of highest no. of confirmed covid cases
            fans = fans + (`Rank -> ${count + 1}`);
            fans = fans + "\n";
        }
        if(state!="India"){
            console.log(ranking(count+1));
        }
        fans = fans + JSON.stringify(arr);
        fans = fans + "\n";

        console.log(arr); // our final ans for which this project is made for... line(27)
        return arr;
    }).then(function () {
        tab.close();
    }).catch(function (err) {
        console.log("Check your spelling again..."); // error handling using catch

    });

}

function ranking(rank){
    if(rank<=6){
        return "Crtical";
    }else if(rank<=12){
        return "Worse";
    }else if(rank<=18){
        return "Bad";
    }else if(rank<=24){
        return "Average";
    }else{
        return "Normal"
    }
}

setTimeout(function () {
     fs.writeFileSync("result.txt",fans);   // to store data in result.txt file
    }, 30000);     // this milliseconds can be varied accordingly to the data input, system configuration and internet availability....



