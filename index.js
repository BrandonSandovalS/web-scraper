const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({});
    const page = await browser.newPage();

    const navigationPromise = page.waitForNavigation({waitUntil: "domcontentloaded"});

    await page.goto('https://cmsweb.cs.csueastbay.edu/psc/CEBPRDF/EMPLOYEE/SA/c/COMMUNITY_ACCESS.CLASS_SEARCH.GBL');
    await navigationPromise;

    // Taking a screenshot of the 1st page
    // await page.screenshot({ path: 'stage1.png' , fullPage: true});

    // Get the text content of the selected option in the dropdown menu
    const semester = await page.$eval('#CLASS_SRCH_WRK2_STRM\\$35\\$ option[selected="selected"]', el => el.textContent.trim());
    await navigationPromise;

    let season = semester.substring(0, semester.indexOf(" "));
    let year = parseInt(semester.slice(-4));

    let nextSemester = "";
    if(season == "Spring"){
        nextSemester = "Fall Semester " + year;
    } else {
        year += 1;
        nextSemester = "Spring Semester " + year;
    }

    // Select the desired option in the dropdown
    await page.select('#SSR_CLSRCH_WRK_CRSE_ATTR\\$9', 'EGE');
    await navigationPromise;

    await new Promise(r => setTimeout(r, 3000))

    // Get the values of all options
    const optionsValues = await page.$$eval('#SSR_CLSRCH_WRK_CRSE_ATTR_VALUE\\$9 option', options => options.map(option => option.textContent.trim()));
    const labelOfOptions = await page.$$eval('#SSR_CLSRCH_WRK_CRSE_ATTR_VALUE\\$9 option', options => options.map(option => option.value.trim()));


    let geNames = [];
    let geValues = [];
    for (let i = 0; i < optionsValues.length; i++){
        let upperDivision = optionsValues[i].substring(0, 4);
        if(upperDivision == "GE U"){
            geNames.push(optionsValues[i]);
            geValues.push(labelOfOptions[i]);
        }
    }

    // Click the Course Attribute Value
    await page.select('#SSR_CLSRCH_WRK_CRSE_ATTR_VALUE\\$9', geValues[2]);
    await navigationPromise;
    await new Promise(r => setTimeout(r, 3000))

    // Takes a screenshot of the selected values
    //await page.screenshot({ path: 'stage2.png' , fullPage: true});

    await page.click('#CLASS_SRCH_WRK2_SSR_PB_CLASS_SRCH');
    await navigationPromise;
    await new Promise(r => setTimeout(r, 3000))
    
    // Take a screenshot of the second page
    //await page.screenshot({ path: 'stage3.png' , fullPage: true});

    await browser.close();
})();
