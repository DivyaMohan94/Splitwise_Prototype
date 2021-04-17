/* eslint-disable camelcase */

"use strict";

const mongoose = require('mongoose');
const Split = require('../models/Split');

const handle_request = async (msg, callback) => {
  const transactionID = mongoose.Types.ObjectId(msg.query.TransactionID);
  Split.aggregate([
    { $match: { transactionID } },
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
    }, { $unwind: { path: "$defaulter", preserveNullAndEmptyArrays: true } },
    { $unwind: { path: "$owner", preserveNullAndEmptyArrays: true } }],
  (error, data) => {
    if (error) {
      console.log("Cannot fetch transaction details");
      callback(error, null);
    } else {
      console.log("Fetching result", data);
      callback(null, data);
    }
  });
};

module.exports.handle_request = handle_request;
