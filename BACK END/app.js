// "use strict";
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const http = require('http');
const https = require('https');

// const privateKey = fs.readFileSync('/etc/letsencrypt/live/vps.isi-net.org/privkey.pem','utf8');
// const certificate = fs.readFileSync('/etc/letsencrypt/live/vps.isi-net.org/cert.pem','utf8');
// const ca = fs.readFileSync('/etc/letsencrypt/live/vps.isi-net.org/chain.pem','utf8');

// const credentials = {
// 	key: privateKey,
// 	cert: certificate,
//   ca: ca
// };



const api = express();
api.use(bodyParser.urlencoded({ extended: false }))
api.use(bodyParser.json())
api.use(cors({
    origin:['http://localhost/8080','*']
}));


const dbase_gisting = require('./database_config.js'); 
dbase_gisting.query(`create table if not exists gistingics (
  datetime timestamp not null, 
  soilmoisture_1 float, 
  soilmoisture_2 float,
  soilmoisture_3 float, 
  waterflow_1 float,
  waterflow_2 float,  
  waterflow_3 float, 
  waterflow_4 float, 
  waterflow_5 float, 
  waterflow_6 float,
  waterflow_7 float,
  waterflow_8 float,
  waterflow_9 float,
  waterflow_10 float,
  waterflow_11 float,
  waterflow_12 float,
  weight_1 float,
  weight_2 float,
  weight_3 float,
  weight_4 float,
  infrared_1 float, 
  infrared_2 float,
  anemo float,
  winddirect float,
  dht float,
  ph float,
  suhuair float,
  tdsmeter float,
  raingauge float,
  coolingsystem float,
  uvlampu float
 )
  `, function(err, result){
    console.log("Database Gisting Connected");
  });


// API HANLDING
const gisting_appRoute = require('./route.js');
api.use('/', cors(), gisting_appRoute);

api.use('/', cors(), (req, res) => {
    res.status(404);
    res.send('API SUDAH ONLINE | GISTING BACKEND '); // respond 404 if not available
});  

// Starting both http & https servers
const httpServer = http.createServer(api);
//konfigurasi http
// const httpsServer = https.createServer(credentials, api);
// //const httpsServer = https.createServer(credentials, api);

// httpsServer.listen(process.env.API_PORT, () => {
// 	console.log(`HTTP REST-API running on port ${process.env.API_PORT}`);
// });


httpServer.listen(process.env.API_PORT, () => {
	console.log(`HTTPS REST-API running on port  ${process.env.API_PORT}`);
});

const topic = process.env.TOPIC;
const mqtt_connect = require('./mqtt_config.js')
const {incomingData} = require('./controler_mqtt.js') 
  // Subscribe topic to receive data from raspberryPi
  // Data From Gisting
//Subscribe topic to receive API request
mqtt_connect.subscribe(topic, (err) => {
  if (!err) {
    console.log("Subscribed to topic : " + topic); 
  } else throw (err);
});

// Handle message from mqtt
mqtt_connect.on("message", incomingData);