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

    var array_of_drops = [];


    // You can simply run this to get the browser's pid
    //const browserPID = browser.process().pid    
  
    //creates a page
    const page = await browser.newPage();

    if(city != ""){
        //heads to the passed url.....
        await page.goto(`https://spotcrime.com/map?lat=33.848579747873806&lon=-84.35935615881222&address=${city}`);
        await delay(2000);
        //click search button
        await page.evaluate(`document.querySelector("#map-page__search-btn").click()`)
    }else{
        //heads to the passed url.....
        await page.goto("https://spotcrime.com/map?lat=40.735657&lon=-74.1723667&address=Newark,%20NJ,%20USA");
        await delay(1000);
    }

    //click button
    await delay(1000)
   var list_num =  await page.evaluate(`document.querySelector("#map-page__crime-list").getElementsByTagName('a').length`)
   
   for(var x = 0; x<list_num;x++){

        var type_of_crime = await page.evaluate(`document.querySelector("#map-page__crime-list").getElementsByTagName('a')[${x}].getElementsByClassName('map-page__crime-list__crime-card-title')[0].textContent`)
        var address = await page.evaluate(`document.querySelector("#map-page__crime-list").getElementsByTagName('a')[${x}].getElementsByClassName('map-page__crime-list__crime-card-address')[0].textContent`)
        var time_and_date = await page.evaluate(`document.querySelector("#map-page__crime-list").getElementsByTagName('a')[${x}].getElementsByClassName('map-page__crime-list__crime-card-date')[0].textContent`)


        var scrapedDrop = {
            name:type_of_crime,
            address:address,
            time:time_and_date,

        };
    

        array_of_drops.push(scrapedDrop);
        console.log(scrapedDrop)
        /*
        //console.log(array_of_drops)
        var json = JSON.stringify(array_of_drops);
        // var fs = require('fs');
        fs.writeFile('./datas.json', json, 'utf8', (err)=>{
            if(err){
                console.log(err);
            }
            //.... if no error we succeeded....
        });  */ 

   }

   console.log(array_of_drops)
   //browser.close()
   //kills the process
  // process.kill(browserPID);

   res.status(200).send(array_of_drops)
}


