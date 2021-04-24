const express = require('express');
const mongoose = require('mongoose');
const { checkAuth } = require("../Util/passport");
const Split = require('../Models/Split');
const GroupDetails = require('../Models/GroupDetailsModel');
const kafka = require('../kafka/client');

const router = express.Router();

router.get("/", checkAuth, (req, res) => {
  console.log("Inside get recent activities");
  kafka.make_request('getRecentActivities', req, (err, data) => {
    if (err) {
      res.writeHead(400, {
        "content-type": "text/plain",
      });
      res.end("Cannot fetch recent details");
    } else {
      console.log('recent activity');
      res.end(JSON.stringify(data));
    }
  });
});

router.get("/filterGroup", checkAuth, (req, res) => {
  console.log("Inside get filter activities");
  kafka.make_request('getFilteredGroup', req, (err, data) => {
    if (err) {
      res.writeHead(400, {
        "content-type": "text/plain",
      });
      res.end("Cannot fetch recent details");
    } else {
      console.log('get filtered data');
      res.end(JSON.stringify(data));
    }
  });
});

router.get("/groupsDropdown", checkAuth, (req, res) => {
  console.log("Inside get groups dropdown");
  kafka.make_request('getGroupsDropdown', req, (err, data) => {
    if (err) {
      res.writeHead(400, {
        "content-type": "text/plain",
      });
      res.end("Cannot fetch recent details");
    } else {
      console.log('groups dropdown data');
      res.end(JSON.stringify(data));
    }
  });
});

module.exports = router;
