const express = require('express');
const mongoose = require('mongoose');
const Split = require('../Models/Split');
const { checkAuth } = require("../Util/passport");

const router = express.Router();

router.get("/", checkAuth, (req, res) => {
  const toReceiveVal = [];
  const toGiveVal = [];
  const dashboardData = {
    toReceiveVal,
    toGiveVal,
  };
  const userID = mongoose.Types.ObjectId(req.query.UserID);
  console.log('userID', req.query.UserID);
  Split.aggregate([
    { $match: { oweToID: userID, paymentStatus: 'unpaid' } },
    {
      $group: {
        _id: null,
        total: {
          $sum: "$splitAmount",
        },
      },
    },
  ],
  (error, data) => {
    if (error) {
      res.writeHead(400, {
        "content-type": "text/plain",
      });
      res.end("Cannot fetch transaction details");
    } else {
      if (data.length > 0) {
        console.log("Fetching result", JSON.stringify((data[0].total)));
        toReceiveVal.push(JSON.stringify((data[0].total)));
      }

      Split.aggregate([
        { $match: { userID, paymentStatus: 'unpaid' } },
        {
          $group: {
            _id: null,
            total: {
              $sum: "$splitAmount",
            },
          },
        },
      ],
      (toGiveError, toGiveData) => {
        if (toGiveError) {
          res.writeHead(400, {
            "content-type": "text/plain",
          });
          res.end("Cannot fetch transaction details");
        } else {
          if (toGiveData.length > 0) {
            console.log("Fetching result", JSON.stringify((toGiveData)));
            toGiveVal.push(JSON.stringify((toGiveData[0].total)));
          }
          console.log('dashboard data', dashboardData);
          res.end(JSON.stringify(dashboardData));
        }
      });
    }
  });
});

router.get("/AllYouOwe", checkAuth, (req, res) => {
  console.log("Inside get owe");
  const UserID = mongoose.Types.ObjectId(req.query.UserID);
  Split.aggregate([
    { $match: { userID: UserID, paymentStatus: 'unpaid' } },
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
      res.writeHead(400, {
        "content-type": "text/plain",
      });
      res.end("Cannot fetch transaction details");
    } else {
      console.log('dashboard data', data);
      res.end(JSON.stringify(data));
    }
  });
});

router.get("/AllYouAreOwed", checkAuth, (req, res) => {
  console.log("Inside get owed");
  const UserID = mongoose.Types.ObjectId(req.query.UserID);
  Split.aggregate([
    { $match: { oweToID: UserID, paymentStatus: 'unpaid' } },
    // {
    //   $group: {
    //     _id: null,
    //     total: {
    //       $sum: "$splitAmount",
    //     },
    //   },
    // },
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
      res.writeHead(400, {
        "content-type": "text/plain",
      });
      res.end("Cannot fetch transaction details");
    } else {
      console.log('dashboard data', data);
      res.end(JSON.stringify(data));
    }
  });
});

router.put("/settleup", checkAuth, (req, res) => {
  console.log("Inside settle up");
  const payerID = mongoose.Types.ObjectId(req.body.payerID);
  const recipientID = mongoose.Types.ObjectId(req.body.recipientID);
  Split.updateOne(
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
        res.writeHead(400, {
          "content-type": "text/plain",
        });
        res.end("Cannot settle up");
      } else {
        console.log(data);
        res.end(JSON.stringify(data));
      }
    },
  );
});
module.exports = router;
