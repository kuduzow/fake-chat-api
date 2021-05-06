//просто подключаем, чтобы в process.env были нужные переменные
require('dotenv').config();

//express application
const express = require('express');

//client for mongoDB
const mongoose = require('mongoose');

//for retrieve request body as JSON
const bodyParser = require('body-parser');

//cors settings
const cors = require('cors');

const https = require('https');

const fs = require("fs");

//connecting to db
try {
  mongoose.connect(process.env.MONGO_SERVER, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  //connected
} catch (e) {
  console.error(`Can't connect to the mongoDB server`);
}

//create express application
const app = express();

//express middleWares
//parse request body as json
app.use(bodyParser.json());

//setting cors policy
//app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(cors());

// middleware, chain /api with index router
app.use('/api', require('./routes/index'));

//listen to the connection
if(process.env.SERVER === "localhost") {
  app.listen(8001, () => {
    console.log('Слушаю http...')
  });
}
else {
  https.createServer({
      key: fs.readFileSync('/etc/ssl/api.intocode.ru.key'),
      cert: fs.readFileSync('/etc/ssl/api.intocode.ru.crt'),
      requestCert: false,
      rejectUnauthorized: false
    }, app).listen(8001, () => {
    console.log("Слушаю на https...")
  })
}
