//express application
const express = require('express');

//client for mongoDB
const mongoose = require('mongoose');

//for retrieve request body as JSON
const bodyParser = require('body-parser');

//cors settings
const cors = require('cors');

//connecting to db
try {
  mongoose.connect("mongodb+srv://fakeChat:fake123@cluster0.bmwz4.mongodb.net/chat?retryWrites=true&w=majority", {
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
app.listen(8001, () => {
  console.log('Server has been started...')
});
