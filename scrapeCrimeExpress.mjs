//working with express


import puppeteer from 'puppeteer';

import Parse from 'parse/node.js';

//var Parse = require('parse/node');

Parse.initialize("dIdHdhbewQvn7ZC4HgssIZHZo8B42hB2snaKli8z","pm2DoJuty9zi6tgzAkldrN1Eve7FFzKQHbYIgIjY"); //PASTE HERE YOUR Back4App APPLICATION ID AND YOUR JavaScript KEY
Parse.serverURL = 'https://parseapi.back4app.com/'

const date = new Date();
console.log(date);

const delay = millis => new Promise((resolve, reject) => {
    setTimeout(_ => resolve(), millis)
});


async function saveNewCrime(crime,date,location,description,city_of_crime) {
    //Create your Parse Object
    const crimeReported = new Parse.Object('crime_report');
    //Define its attributes
    // crimeReported.set('objectId', id);
    crimeReported.set('crime_type', crime);
    crimeReported.set('date', date);
    crimeReported.set('user_id', new Parse.User({'objectId': 'zQDsQrQF6N'}));
    crimeReported.set('description', description);
    crimeReported.set('location',location);
    crimeReported.set('city',city_of_crime);
    crimeReported.set('time',date);
    

    try {
      //Save the Object
      const result = await crimeReported.save();
      console.log('New object created with objectId: ' + result.id);
    } catch (error) {
      console.log('Failed to create new object: ' + error.message);
    }
};


function logIn() {
    // Create a new instance of the user class
    var user = Parse.User
        .logIn("raym", "anything").then(function(user) {
            console.log('User created successful with name: ' + user.get("username") + ' and email: ' + user.get("email"));
    }).catch(function(error){
        console.log("Error: " + error.code + " " + error.message);
    });

    return user
}

  

const service = async (city) => {


    //let city = req.query.city || req.body.city || "NEWARK";
    //VARS....

    //delay function
    const delay = millis => new Promise((resolve, reject) => {
        setTimeout(_ => resolve(), millis)
    });


    var array_of_drops = [];

    const browser = await puppeteer.launch({
        headless: true, //false or true
        //executablePath:chrome_doll_driver_path,
        args: ['--window-size=600,600',
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process',
        '--ignore-certifcate-errors',
        '--ignore-certifcate-errors-spki-list',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-infobars'],
        ignoreHTTPSErrors: true
    });
  
    
    // You can simply run this to get the browser's pid
    const browserPID = browser.process().pid    
    
   
    //creates a page
    const page = await browser.newPage();

    try{
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
           var  my_description = type_of_crime+" on " + address + " at " + time_and_date
    
           
            console.log("PUSH HARD YAYYYY");
            saveNewCrime(type_of_crime,time_and_date,address,my_description,city)
            await delay(1100)
        
        
    
            array_of_drops.push(scrapedDrop);
            console.log(scrapedDrop)
    
            /*
            var json = JSON.stringify(array_of_drops);
            fs.writeFile('./datas.json', json, 'utf8', (err)=>{
                if(err){
                    console.log(err);
                }
                //.... if no error we succeeded....
            });
            */   
    
       }
    
       //console.log(array_of_drops)
       browser.close()
       
       //kills the process
       process.kill(browserPID);
    
       return array_of_drops

    }catch(error){
        console.log(error)
    }

   
}

export default service;
