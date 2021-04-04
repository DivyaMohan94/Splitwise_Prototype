/* eslint-disable no-console */
//  import the require dependencies
const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./Util/config');

// use cors to allow cross origin resource sharing
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

// use express session to maintain session data
app.use(
  session({
    secret: 'cmpe273_Splitwise',
    resave: false,
    saveUninitialized: false,
    duration: 60 * 60 * 1000, // Overall duration of Session : 30 minutes : 1800 seconds
    activeDuration: 5 * 60 * 1000,
  }),
);

app.use(bodyParser.json());

// Allow Access Control
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,HEAD,OPTIONS,POST,PUT,DELETE',
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers',
  );
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  poolSize: 500,
  bufferMaxEntries: 0,
};

mongoose.connect(config.mongoURI, options, (err, res) => {
  if (err) {
    // console.log(err);
    console.log('cannot connect to mongo db');
  } else {
    // console.log(res);
    console.log('connection successful');
  }
});
mongoose.set("debug", (collectionName, method, query, doc) => {
  console.log(`${collectionName}.${method}`, JSON.stringify(query), doc);
});
// Routing
const login = require('./Routes/Login.js');
const signUp = require('./Routes/Signup.js');
const dashboard = require('./Routes/Dashboard.js');
const profile = require('./Routes/Profile.js');
const createGroup = require('./Routes/CreateGroup.js');
const group = require('./Routes/GroupPage.js');
const recent = require('./Routes/RecentActivity.js');

// Route config
app.use('/login', login);
app.use('/signup', signUp);
app.use('/dashboard', dashboard);
app.use('/profile', profile);
app.use('/creategroup', createGroup);
app.use('/group', group);
app.use('/recent', recent);

// start your server on port 3001
app.listen(3001);
console.log('Server Listening on port 3001');
