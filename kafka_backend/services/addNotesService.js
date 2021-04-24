/* eslint-disable camelcase */

"use strict";

const mongoose = require('mongoose');
const Transactions = require('../models/TransactionModel');

const handle_request = async (msg, callback) => {
  console.log("Inside add notes");
  const userID = mongoose.Types.ObjectId(msg.body.userID);
  const transactionID = mongoose.Types.ObjectId(msg.body.transactionID);
  const { addedUser } = msg.body;
  const { note } = msg.body;
  console.log(userID);
  const notesObj = {
    note,
    addedBy: userID,
    addedUser,
  };
  Transactions.updateOne(
    {
      _id: transactionID,
    },
    {
      $push: {
        notes: notesObj,
      },
    },
    (error, data) => {
      if (error) {
        console.log("Cannot add notes", error);
        callback(error, null);
      } else {
        console.log("Notes added successfully", notesObj);
        callback(null, data);
      }
    },
  );
};

module.exports.handle_request = handle_request;
