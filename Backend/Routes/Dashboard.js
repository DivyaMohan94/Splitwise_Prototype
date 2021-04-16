const express = require('express');
// const mongoose = require('mongoose');
// const Split = require('../Models/Split');
const { checkAuth } = require("../Util/passport");
const kafka = require('../kafka/client');

const router = express.Router();

router.get("/", checkAuth, (req, res) => {
  console.log("Inside get dashboard details");
  kafka.make_request('getDashboardDetails', req, (err, data) => {
    if (err) {
      res.writeHead(400, {
        "content-type": "text/plain",
      });
      res.end("Cannot fetch recent details");
    } else {
      console.log('fetching dashboard details');
      res.end(JSON.stringify(data));
    }
  });
});

router.get("/AllYouOwe", checkAuth, (req, res) => {
  console.log("Inside get owe");
  kafka.make_request('getAllYouOwe', req, (err, data) => {
    if (err) {
      res.writeHead(400, {
        "content-type": "text/plain",
      });
      res.end("Cannot fetch recent details");
    } else {
      console.log('fetching All you owe details');
      res.end(JSON.stringify(data));
    }
  });
});

router.get("/AllYouAreOwed", checkAuth, (req, res) => {
  console.log("Inside get oall you owed");
  kafka.make_request('getAllYouAreOwed', req, (err, data) => {
    if (err) {
      res.writeHead(400, {
        "content-type": "text/plain",
      });
      res.end("Cannot fetch recent details");
    } else {
      console.log('fetching All you are owed details');
      res.end(JSON.stringify(data));
    }
  });
});

router.put("/settleup", checkAuth, (req, res) => {
  console.log("Inside settle up");
  kafka.make_request('settleUp', req, (err, data) => {
    if (err) {
      res.writeHead(400, {
        "content-type": "text/plain",
      });
      res.end("Cannot settle up");
    } else {
      console.log('settled up');
      res.end(JSON.stringify(data));
    }
  });
});
module.exports = router;
