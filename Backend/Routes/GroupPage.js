const express = require("express");
const mongoose = require('mongoose');
const Transactions = require('../Models/TransactionModel');
const GroupDetails = require('../Models/GroupDetailsModel');
const Split = require('../Models/Split');

const router = express.Router();

router.get("/getActiveGroups", (req, res) => {
  GroupDetails.find({
    members: { $elemMatch: { userID: req.query.UserID, status: 'ok' } },
  }, (error, data) => {
    if (error) {
      res.writeHead(400, {
        "content-type": "text/plain",
      });
      res.end("mongo error");
    } else {
      console.log("Fetching result", data);
      res.status(200).json(data);
    }
  });
});

router.get("/invites", (req, res) => {
  GroupDetails.find({
    members: { $elemMatch: { userID: req.query.UserID, status: 'pending' } },
  }, (error, data) => {
    if (error) {
      res.writeHead(400, {
        "content-type": "text/plain",
      });
      res.end("mongo error");
    } else {
      console.log("Fetching result", data);
      res.status(200).json(data);
    }
  });
});

router.put("/acceptInvites", (req, res) => {
  console.log("Inside accept invites");
  const userID = mongoose.Types.ObjectId(req.body.userID);
  const groupID = mongoose.Types.ObjectId(req.body.groupID);
  console.log(userID);
  console.log(groupID);
  GroupDetails.updateOne(
    {
      _id: groupID,
      "members.userID": userID,
    },
    {
      $set: {
        "members.$.status": 'ok',
      },
    },
    (error, data) => {
      if (error) {
        console.log("Cannot accept invite", error);
        res.writeHead(400, {
          "content-type": "text/plain",
        });
        res.end("Cannot accept invite");
      } else {
        console.log(data);
        res.status(200).json(data);
      }
    },
  );
});

// Add expense - description, total amt, owner id, groupID, currency --> returns transaction id
router.post("/addexpense", (req, res) => {
  const { groupID } = req.body;
  const { groupName } = req.body;
  const { description } = req.body;
  const { paidByID } = req.body;
  const { totalAmount } = req.body;
  let count = 0;
  let splitAmount = 0;
  let paymentStatus = "";
  let transactionID;

  const transactionObj = new Transactions({
    groupID,
    groupName,
    description,
    createdBy: paidByID,
    totalAmount,
  });

  transactionObj.save((transErr, transData) => {
    if (transErr) {
      res.writeHead(400, {
        "content-type": "text/plain",
      });
      console.log("Cannot insert transaction data", transErr);
      res.end("Cannot insert transaction data");
    } else {
      transactionID = transData._id;
      console.log("transssdataaa", transactionID);
      GroupDetails.aggregate([
        // { $match: { _id: groupID } },
        { $unwind: "$members" },
        { $match: { groupName, "members.status": "ok" } }], (error, data) => {
        if (error) {
          console.log("Error fetching result", error);
          res.writeHead(400, {
            "content-type": "text/plain",
          });
          res.end("cannot fetch group details");
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
                res.writeHead(400, {
                  "content-type": "text/plain",
                });
                res.end("Cannot insert split data");
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
                      res.writeHead(400, {
                        "content-type": "text/plain",
                      });
                      res.end("Cannot update split amount");
                    } else {
                      console.log(amtData);
                      // res.writeHead(200, {
                      //   'Content-Type': 'application/json',
                      // });
                      res.end(JSON.stringify(amtData));
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
});

// Get All group transactions - need groupid
router.get("/AllTransaction", (req, res) => {
  const groupID = mongoose.Types.ObjectId(req.query.groupID);
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
      res.writeHead(400, {
        "content-type": "text/plain",
      });
      res.end("Cannot fetch transaction details");
    } else {
      console.log("Fetching result", data);
      res.status(200).json(data);
    }
  });
});

// Get individual transaction -- need transaction id
router.get("/Transaction", (req, res) => {
  const transactionID = mongoose.Types.ObjectId(req.query.TransactionID);
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
      res.writeHead(400, {
        "content-type": "text/plain",
      });
      res.end("Cannot fetch transaction details");
    } else {
      console.log("Fetching result", data);
      res.status(200).json(data);
    }
  });
});

router.get("/getGroupDetails", (req, res) => {
  const groupID = mongoose.Types.ObjectId(req.query.GroupID);
  console.log('groupID :', groupID);

  GroupDetails.aggregate([
    { $match: { _id: groupID } },
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
      res.writeHead(400, {
        "content-type": "text/plain",
      });
      res.end("Cannot fetch transaction details");
    } else {
      console.log("Fetching result", data);
      res.status(200).json(data);
    }
  });
});

router.get("/getDues", (req, res) => {
  console.log("Inside get owe");
  const userID = mongoose.Types.ObjectId(req.query.userID);
  const groupID = mongoose.Types.ObjectId(req.query.groupID);
  Split.aggregate([
    { $match: { userID, groupID, paymentStatus: 'unpaid' } },
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
  // connection.getConnection((err, conn) => {
  //   if (err) {
  //     console.log('Cannot connect to database');
  //     console.log(err);
  //     throw err;
  //   } else {
  //     console.log('Connection111 successful');
  //     console.log("Inside get due details");
  //     console.log(req.query);
  //     const { GroupID } = req.query;
  //     const { UserID } = req.query;
  //     const check = `SELECT DISTINCT * FROM GroupDetails
  // INNER JOIN Owing ON Owing.GroupID = GroupDetails.GroupID
  // WHERE GroupDetails.GroupID=${mysql.escape(GroupID)} AND Owing.Status="unpaid" AND Owing.UserID <> Owing.OweToID AND Owing.UserID=${mysql.escape(UserID)}`;

  //     conn.query(check, (error, data) => {
  //       if (error) {
  //         res.writeHead(400, {
  //           "content-type": "text/plain",
  //         });
  //         res.end("Sql error");
  //       } else {
  //         console.log("Fetching sql    result");
  //         console.log(data);
  //         res.writeHead(200, {
  //           "Content-type": "application/json",
  //         });
  //         res.end(JSON.stringify(data));
  //         conn.release();
  //       }
  //     });
  //   }
  // });
});

router.put("/leaveGroup", (req, res) => {
  console.log("Inside accept invites");
  const userID = mongoose.Types.ObjectId(req.body.userID);
  const groupID = mongoose.Types.ObjectId(req.body.groupID);
  console.log(userID);
  console.log(groupID);
  GroupDetails.updateOne(
    {
      _id: groupID,
      "members.userID": userID,
    },
    {
      $set: {
        "members.$.status": 'pending',
      },
    },
    (error, data) => {
      if (error) {
        console.log("Cannot accept invite", error);
        res.writeHead(400, {
          "content-type": "text/plain",
        });
        res.end("Cannot accept invite");
      } else {
        console.log(data);
        res.status(200).json(data);
      }
    },
  );
});

router.post("/addNotes", (req, res) => {
  console.log("Inside add notes");
  const userID = mongoose.Types.ObjectId(req.body.userID);
  const transactionID = mongoose.Types.ObjectId(req.body.transactionID);
  const { addedUser } = req.body;
  const { note } = req.body;
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
        res.writeHead(400, {
          "content-type": "text/plain",
        });
        res.end("Cannot add notes");
      } else {
        console.log(data);
        res.status(200).json(data);
      }
    },
  );
});

router.post("/deleteNotes", (req, res) => {
  console.log("Inside delete notes");
  const noteID = mongoose.Types.ObjectId(req.body.noteID);
  const transactionID = mongoose.Types.ObjectId(req.body.transactionID);

  Transactions.updateOne(
    {
      _id: transactionID,
    },
    { $pull: { notes: { _id: noteID } } },
    (error, data) => {
      if (error) {
        console.log("Cannot delete notes", error);
        res.writeHead(400, {
          "content-type": "text/plain",
        });
        res.end("Cannot delete notes");
      } else {
        console.log(data);
        res.status(200).json(data);
      }
    },
  );
});

// router.put("/changeImage", (req, res) => {
//   connection.getConnection((err, conn) => {
//     if (err) {
//       console.log('Cannot connect to database');
//       console.log(err);
//       throw err;
//     } else {
//       console.log('Connection111 successful');
//       console.log("Inside change image");
//       console.log("Req Body : ", req.body);
//       const { Image } = req.body;
//       const { GroupID } = req.body;

//       const imageUpdate = `UPDATE GroupDetails
//   SET Image = ${mysql.escape(Image)}
//   WHERE GroupID = ${mysql.escape(GroupID)}`;

//       console.log(imageUpdate);

//       conn.query(imageUpdate, (error, data) => {
//         if (error) {
//           res.writeHead(400, {
//             "content-type": "text/plain",
//           });
//           res.end("Sql error");
//         } else {
//           console.log(data);
//           res.writeHead(200, {
//             "Content-type": "application/json",
//           });
//           res.end(JSON.stringify(data));
//           conn.release();
//         }
//       });
//     }
//   });
// });

module.exports = router;
