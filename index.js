const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({});
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
    await navigationPromise;

    await new Promise(r => setTimeout(r, 3000))

    // Gets all the course attribule values of the website
    const optionsValues = await page.$$eval('#SSR_CLSRCH_WRK_CRSE_ATTR_VALUE\\$9 option', options => options.map(option => option.textContent.trim()));
    const labelOfOptions = await page.$$eval('#SSR_CLSRCH_WRK_CRSE_ATTR_VALUE\\$9 option', options => options.map(option => option.value.trim()));


    let geNames = [];
    let geValues = [];

    // This goes through the list and only gets the upper division courses
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

    await page.click('#CLASS_SRCH_WRK2_SSR_PB_CLASS_SRCH');
    await navigationPromise;
    await new Promise(r => setTimeout(r, 3000))

    // This is the index for the group boxes of the classes
    let index = 0;
    while (true) {
        // The selector will be the id for the clickable drop down plus the index for which one
        const selector = '#SSR_CLSRSLT_WRK_GROUPBOX2\\$' + index;
        try {
            // This is used to wait for a little bit
            await new Promise(r => setTimeout(r, 500))
            // This will click the selector (dropdown menu)
            await page.click(selector);
            // Increment index 
            index++;
        } catch (error) {
            // Break out of the loop if the selector is not found
            break; 
        }
    }

    await navigationPromise;
    await new Promise(r => setTimeout(r, 500))
    //await page.screenshot({ path: 'stage4(clicking all dropdown menus).png' , fullPage: true});

    /* Gets classname 
    const classname = await page.$eval('#win0divSSR_CLSRCH_MTG1\\$1 > div', el => el.textContent.trim());

    const campus = await page.$eval('#DERIVED_CLSRCH_DESCR\\$1', el => el.textContent.trim());

    const daysTimes = await page.$eval('#MTG_DAYTIME\\$1', el => el.textContent.trim());

    const professor = await page.$eval('#MTG_INSTR\\$1', el => el.textContent.trim());

    const room = await page.$eval('#MTG_ROOM\\$1', el => el.textContent.trim());
    */

    let courses= [];
    index = 0;
    while (true) {
        // The selector is only used to see if we reached the last course in the website
        const selector = '#win0divSSR_CLSRCH_MTG1\\$' + index;
        try {
            // This is used to just get the course name
            const classname = await page.$eval('#win0divSSR_CLSRCH_MTG1\\$' + index + '> div', el => el.textContent.trim());

            // This is used to get in which campus it is in
            const campus = await page.$eval('#DERIVED_CLSRCH_DESCR\\$' + index, el => el.textContent.trim());

            // This is used to get on what day and time the specific course it is in.
            const daysTimes = await page.$eval('#MTG_DAYTIME\\$' + index, el => el.textContent.trim());

            // This is the professors name for the course
            const professor = await page.$eval('#MTG_INSTR\\$' + index, el => el.textContent.trim());

            // This is the room the course will be in
            const room = await page.$eval('#MTG_ROOM\\$' + index, el => el.textContent.trim());

            // This will be all the courses that matches the upper ge you are looking for.
            courses.push([classname, campus, daysTimes, professor, room]);

            // Increment index 
            index++;
        } catch (error) {
            // Break out of the loop if the selector is not found
            break; 
        }
    }

    console.log(courses);

    await browser.close();
})();
