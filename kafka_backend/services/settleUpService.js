/* eslint-disable camelcase */

"use strict";

const mongoose = require('mongoose');
const Split = require('../models/Split');

const handle_request = async (msg, callback) => {
  console.log("Inside settle up");
  const payerID = mongoose.Types.ObjectId(msg.body.payerID);
  const recipientID = mongoose.Types.ObjectId(msg.body.recipientID);
  Split.updateMany(
    {
      userID: payerID,
      oweToID: recipientID,
    },
    {
      $set: {
        paymentStatus: 'paid',
        updatedOn: new Date(),
      },
    },
    (error, data) => {
      if (error) {
        console.log("Cannot settle up");
        callback(error, null);
      } else {
        console.log(data);
        callback(null, data);
      }
    },
  );
};

module.exports.handle_request = handle_request;
