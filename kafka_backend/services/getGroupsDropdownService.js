/* eslint-disable camelcase */

"use strict";

const mongoose = require('mongoose');
const GroupDetails = require('../models/GroupDetailsModel');

const handle_request = async (msg, callback) => {
  console.log("Inside get groups dropdown");
  const userID = mongoose.Types.ObjectId(msg.query.userID);
  GroupDetails.find({
    members: { $elemMatch: { userID, status: 'ok' } },
  }, (error, data) => {
    if (error) {
      console.log("mongo error");
      callback(error, null);
    } else {
      console.log("fetched groups dropdownresult");
      callback(null, data);
    }
  });
};

module.exports.handle_request = handle_request;
