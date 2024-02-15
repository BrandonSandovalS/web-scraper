const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const navigationPromise = page.waitForNavigation({waitUntil: "domcontentloaded"});

    await page.goto('https://cmsweb.cs.csueastbay.edu/psc/CEBPRDF/EMPLOYEE/SA/c/COMMUNITY_ACCESS.CLASS_SEARCH.GBL');

    await navigationPromise;

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

    await page.setViewport({ width: 1920, height: 1080 });
    await page.screenshot({ path: 'page.png' });

    // Get the values of all options
    const optionsValues = await page.$$eval('#SSR_CLSRCH_WRK_CRSE_ATTR_VALUE\\$9 option', options => options.map(option => option.textContent.trim()));

    let courses = [];
    for (let i = 0; i < optionsValues.length; i++){
        let upperDivision = optionsValues[i].substring(0, 4);
        if(upperDivision == "GE U"){
            courses.push(optionsValues[i]);
            //console.log(optionsValues[i]);
        }
    }
    

    await browser.close();
})();
