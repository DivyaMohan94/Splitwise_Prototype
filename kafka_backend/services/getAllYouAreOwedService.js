/* eslint-disable camelcase */

"use strict";

const mongoose = require('mongoose');
const Split = require('../models/Split');

const handle_request = async (msg, callback) => {
  console.log("Inside get you are owed");
  const UserID = mongoose.Types.ObjectId(msg.query.UserID);
  Split.aggregate([
    { $match: { oweToID: UserID, paymentStatus: 'unpaid' } },
    {
      $lookup: {
        from: "users",
        localField: "userID",
        foreignField: "_id",
        as: "defaulter",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "oweToID",
        foreignField: "_id",
        as: "owner",
      },
    },
  ],
  (error, data) => {
    if (error) {
      console.log("Cannot fetch transaction details");
      callback(error, null);
    } else {
      console.log('dashboard data', data);
      callback(null, data);
    }
  });
};

module.exports.handle_request = handle_request;
