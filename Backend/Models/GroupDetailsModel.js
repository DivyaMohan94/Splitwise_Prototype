const mongoose = require('mongoose');
// const transactionSchema = require('./TransactionModel');

const { Schema } = mongoose;

const groupDetailsSchema = new Schema({
  groupName: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'Users' },
  // createdByName: { type: String },
  createdOn: { type: Date, default: new Date() },
  image: { type: String, default: null },
  members: [{
    userID: { type: Schema.Types.ObjectId, ref: 'Users' },
    // userName: { type: String },
    // emailID: { type: String },
    // currency: { type: String },
    status: { type: String },
  }],
  // transactions: [{
  //   description: { type: String },
  //   createdBy: { type: Schema.Types.ObjectId, ref: 'Users' },
  //   // createdByName: { type: String },
  //   createdOn: { type: Date, default: new Date() },
  //   totalAmount: { type: Schema.Types.Decimal128 },
  //   split: [{
  //     splitAmount: { type: Schema.Types.Decimal128 },
  //     userID: { type: Schema.Types.ObjectId, ref: 'Users' },
  //     // userName: { type: String },
  //     oweToID: { type: Schema.Types.ObjectId, ref: 'Users' },
  //     // oweToName: { type: String },
  //     paymentStatus: { type: String },
  //     updatedOn: { type: Date, default: new Date() },
  //   }],
  // }],
},
{
  versionKey: false,
});

const GroupDetails = mongoose.model('GroupDetails', groupDetailsSchema);
module.exports = GroupDetails;
