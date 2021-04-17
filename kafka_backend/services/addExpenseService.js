/* eslint-disable camelcase */

"use strict";

const Transactions = require('../models/TransactionModel');
const GroupDetails = require('../models/GroupDetailsModel');
const Split = require('../models/Split');

const handle_request = async (msg, callback) => {
  console.log("Inside add notes");

  const { groupID } = msg.body;
  const { groupName } = msg.body;
  const { description } = msg.body;
  const { paidByID } = msg.body;
  const { totalAmount } = msg.body;
  let count = 0;
  let splitAmount = 0;
  let paymentStatus = "";
  let transactionID;
  const res = {};

  const transactionObj = new Transactions({
    groupID,
    groupName,
    description,
    createdBy: paidByID,
    totalAmount,
  });

  transactionObj.save((transErr, transData) => {
    if (transErr) {
      console.log("Cannot insert transaction data");
      callback(transErr, null);
    } else {
      transactionID = transData._id;
      console.log("transssdataaa", transactionID);
      GroupDetails.aggregate([
        // { $match: { _id: groupID } },
        { $unwind: "$members" },
        { $match: { groupName, "members.status": "ok" } }], (error, data) => {
        if (error) {
          console.log("Error fetching result", error);
          res.status = 400; res.data = "Cannot fetch group details";
          callback(null, res);
        } else {
          console.log("Fetching result", data);
          count = data.length;
          splitAmount = totalAmount / count;
          console.log('splitAmount', splitAmount);
          data.forEach((element) => {
            console.log('eleeee', element.members.userID);
            if (element.members.userID == paidByID) {
              paymentStatus = "paid";
            } else {
              paymentStatus = "unpaid";
            }
            // if (element.members.userID != paidByID) {
            //   paymentStatus = "unpaid";

            const splitObj = new Split({
              transactionID: transData._id,
              groupID,
              groupName,
              description,
              createdBy: paidByID,
              totalAmount,
              splitAmount,
              userID: element.members.userID,
              oweToID: paidByID,
              paymentStatus,
            });
            splitObj.save((splitErr, splitData) => {
              if (splitErr) {
                console.log("Cannot insert split data", splitErr);
                res.status = 400; res.data = "CCannot insert split data";
                callback(null, res);
              } else {
                console.log(splitData);
                Transactions.updateOne(
                  {
                    _id: transactionID,
                  },
                  {
                    $set: {
                      lentAmount: totalAmount - splitAmount,
                    },
                  },
                  (amtError, amtData) => {
                    if (amtError) {
                      console.log("Cannot update split amount");
                      res.status = 400; res.data = "Cannot update split data";
                      callback(null, res);
                    } else {
                      console.log(amtData);
                      res.status = 200; res.data = amtData;
                      callback(null, res);
                    }
                  },
                );
              }
            });
          });// end of for each
        }
      });
    }
  });
};

module.exports.handle_request = handle_request;
