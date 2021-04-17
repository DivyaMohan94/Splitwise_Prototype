/* eslint-disable camelcase */

"use strict";

const mongoose = require('mongoose');
const Split = require('../models/Split');

const handle_request = async (msg, callback) => {
  console.log("Inside get owe");
  const userID = mongoose.Types.ObjectId(msg.query.userID);
  const groupID = mongoose.Types.ObjectId(msg.query.groupID);
  Split.aggregate([
    { $match: { userID, groupID, paymentStatus: 'unpaid' } },
  ],
  (error, data) => {
    if (error) {
      console.log("Cannot fetch transaction details");
      callback(error, null);
    } else {
      console.log('owes data', data);
      callback(null, data);
    }
  });
};

module.exports.handle_request = handle_request;
