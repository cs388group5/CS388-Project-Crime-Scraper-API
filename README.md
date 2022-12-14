# CS388-Project-Crime-Scraper-API
This code details the crime scraper that I created to take in city variables from the app and return crime data based on the location.

* Setting up sandbox
```
exports.scrapeCrime = async (req,res) => {

    const puppeteer = require('puppeteer');

    let browser = await puppeteer.launch({
        args: [
        '--no-sandbox',
        ],
    });


    let city = req.query.city || req.body.city || "NEWARK";
    //VARS....

    //delay function
    const delay = millis => new Promise((resolve, reject) => {
        setTimeout(_ => resolve(), millis)
    });

```

* Scraping Information

```
var type_of_crime = await page.evaluate(`document.querySelector("#map-page__crime-list").getElementsByTagName('a')[${x}].getElementsByClassName('map-page__crime-list__crime-card-title')[0].textContent`)
        var address = await page.evaluate(`document.querySelector("#map-page__crime-list").getElementsByTagName('a')[${x}].getElementsByClassName('map-page__crime-list__crime-card-address')[0].textContent`)
        var time_and_date = await page.evaluate(`document.querySelector("#map-page__crime-list").getElementsByTagName('a')[${x}].getElementsByClassName('map-page__crime-list__crime-card-date')[0].textContent`)

```

to help puppeteer run efficiently
```
const {join} = require('path');

/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
  // Changes the cache location for Puppeteer.
  cacheDirectory: join(__dirname, '.cache', 'puppeteer'),
}
```
