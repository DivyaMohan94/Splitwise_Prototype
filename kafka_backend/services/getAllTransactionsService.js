/* eslint-disable camelcase */

"use strict";

const mongoose = require('mongoose');
const Transactions = require('../models/TransactionModel');

const handle_request = async (msg, callback) => {
  const groupID = mongoose.Types.ObjectId(msg.query.groupID);
  console.log('groupID :', groupID);

  Transactions.aggregate([
    { $match: { groupID } },
    {
      $lookup: {
        from: "users",
        localField: "createdBy",
        foreignField: "_id",
        as: "user",
      },
    }, { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } }],
  (error, data) => {
    if (error) {
      console.log("Cannot fetch transaction details");
      callback(error, null);
    } else {
      console.log("Fetching result");
      callback(null, data);
    }
  });
};

module.exports.handle_request = handle_request;
