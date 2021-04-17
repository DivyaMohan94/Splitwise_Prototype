/* eslint-disable camelcase */

"use strict";

const mongoose = require('mongoose');
const Transactions = require('../models/TransactionModel');

const handle_request = async (msg, callback) => {
  console.log("Inside delete notes");
  const noteID = mongoose.Types.ObjectId(msg.body.noteID);
  const transactionID = mongoose.Types.ObjectId(msg.body.transactionID);

  Transactions.updateOne(
    {
      _id: transactionID,
    },
    { $pull: { notes: { _id: noteID } } },
    (error, data) => {
      if (error) {
        console.log("Cannot delete notes");
        callback(error, null);
      } else {
        console.log("Deleted notes");
        callback(null, data);
      }
    },
  );
};

module.exports.handle_request = handle_request;
