
const pup = require('puppeteer');

let browserPromise = pup.launch({
    headless: false,
    defaultViewport: false
});
let sitelink = "https://www.covid19india.org/";
let state = "India";

let headingarr = [];
let detailsarrfinal = [];
let detailsarr = [];
let tab;
let ans = {};
let statearr = [];
let count = 0;
browserPromise.then(function(browser){
    let pagesPromise = browser.pages();
    return pagesPromise;
}).then(function(pages){
    tab = pages[0];
    let pageOpenPromise = tab.goto(sitelink);
    return pageOpenPromise;
}).then(function(){
    let waitPromise = tab.waitForSelector(".cell.heading", {visible : true});
    return waitPromise;
}).then(function(){
    let allheadingsPromise = tab.$$(".cell.heading");
    return allheadingsPromise;
}).then(function(data){
    for(let i of data) {
        let innertext = tab.evaluate(function(ele){
            return ele.textContent;
        },i);
        headingarr.push(innertext);
    }
    return Promise.all(headingarr);
}).then(function(data){
    headingarr = data;
    let allstatesPromise = tab.$$(".state-name.fadeInUp");
    return allstatesPromise;
}).then(function(data){
    for(let i of data){
        let innertext = tab.evaluate(function(ele){
            return ele.textContent;
        },i);
        statearr.push(innertext);
    }
    return Promise.all(statearr);
}).then(function(data){
    // console.log(data);
    count = data.indexOf(state);
    // console.log(count);
    return data;
}).then(function(data){
    let allstatesPromise = tab.$$(".state-name.fadeInUp");
    return allstatesPromise;
}).then(function(data){
    for(let i in data){
        if(i==count){
            let detailsPromise = tab.$$(".cell.statistic .total");
            return detailsPromise;
        }
    }
}).then(function(data){
    for(let i of data){
        let innertext = tab.evaluate(function(ele){
            return ele.textContent;
        },i);
        detailsarr.push(innertext);
    }
    return Promise.all(detailsarr);
}).then(function(data){
    detailsarr = data;
    let start = (count)*6;
    let end = (count+1)*6-1;
    for(let k = start;k<=end;k++){
        detailsarrfinal.push(data[k]);
    }
    for(let a = 0;a<7;a++){
        if(a==0){
            ans[headingarr[a]] = state;
            continue;
        }
        ans[headingarr[a]] = detailsarrfinal[a-1];
    }
    return ans;
}).then(function(arr){
    if(state==="India"){
        console.log("Rank -> -----" );
    }else{
        console.log(`Rank -> ${count+1}`);
    }
    console.log(ans);
}).catch(function(err){
    console.log(err);
});


