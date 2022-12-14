
//this allows us to run the bots and deploy them to google cloud functions
//to test this on our local machine we run  -> ( curl localhost:5000/newark ) in the terminal
// Note - To run on local machine makesure app.listen() in uncommented and that export const run = app is commented those are for running on google cloud functions.

//more info and tutorial i went off
//https://blog.logrocket.com/creating-puppeteer-microservice-deploy-google-cloud-functions
import express from 'express';
import service from './scrapeCrimeExpress.mjs';

const app = express();

//if running on my computer and want to initiate through curl  ex : curl localhost:5000/newark we need this listener below to be uncommented
app.listen(5000);

app.get('/:city', async (req, res) => {
  const { city } = req.params;
  //const  city  = "newark";
  try {
    const response = await service(city);
    res.status(200).send(response);
  } catch (e) {
    res.status(500).send(e);
  }
});

//if needs to be active in a cloud function then we need this as the entry point
//export const run = app;


