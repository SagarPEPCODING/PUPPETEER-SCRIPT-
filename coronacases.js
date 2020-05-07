let fs=require("fs");
let puppeteer=require("puppeteer");
var path = require("path");

let search_country=process.argv[2];

(async function(){

    try{

        const browser = await puppeteer.launch({ 
            headless: false, 
            defaultViewport: null, 
            slowMo: 1, 
            args: ['--start-maximized', '--disable-notifications'] 
        });

        let pages = await browser.pages();
        let page = pages[0];

        
        await page.goto("https://www.worldometers.info/",{waitUntil: 'networkidle0', timeout:50000});
        

        await page.waitForSelector('.linkunderline' , {
            visible:true
        });

        
        let link = await page.$$eval('.linkunderline > a', am => am.filter(e => e.href).map(e => e.href));
        console.log(link);
        await page.goto(link[0],{waitUntil: 'networkidle0'});

        await page.waitForSelector(".cc-window.cc-banner.cc-type-info.cc-theme-classic.cc-bottom.cc-color-override-1827372716 ",{
            visible:true
        });

       

    let table = await page.$$eval('.table.table-bordered.table-hover.main_table_countries.dataTable.no-footer .mt_a', am => am.filter(e => e.textContent).map(e => e.textContent));
    console.log(table);
    // console.log(table.length);
    
    let links = await page.$$eval('.table.table-bordered.table-hover.main_table_countries.dataTable.no-footer .mt_a', am => am.filter(e => e.href).map(e => e.href));
    console.log(links);
    // console.log(links.length);
    // let tbody = await page.$$('table[0] > tbody')
    // console.log(tbody.length);

    for(let i=0;i<table.length;i++){
        if(search_country === table[i]){
            // console.log(table[i]);
            console.log(links[i]);//https://www.worldometers.info/coronavirus/country/india/
            await page.goto(links[i],{waitUntil: 'networkidle0'});
            break;
        }
    }

    let maincounter = await page.$$eval('#maincounter-wrap', am => am.filter(e => e.textContent).map(e => e.textContent));
    for(let i=0;i<maincounter.length;i++){
        let maincounterans = await maincounter[i].trim();
        // console.log(maincounterans.length);
        let ans = "";
        for(let i=0;i<maincounterans.length;i++){
            if(maincounterans[i] === "\n"){
                ans = ans + "-";
            }else{
                ans = ans + maincounterans[i];
            }
        }
        console.log(ans);
        // console.log(maincounter.length);
    }


    }catch(err){
        if(err){
            console.log("NETWORK PROBLEM");
            console.log(err);
        }
    }

})()