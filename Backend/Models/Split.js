const mongoose = require('mongoose');

const { Schema } = mongoose;

const splitSchema = new Schema({
  transactionID: { type: Schema.Types.ObjectId, ref: 'Transactions' },
  groupID: { type: Schema.Types.ObjectId, ref: 'GroupDetails' },
  groupName: { type: String, required: true },
  description: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'Users' },
  createdOn: { type: Date, default: new Date() },
  totalAmount: { type: Number, required: true },
  splitAmount: { type: Number, required: true },
  userID: { type: Schema.Types.ObjectId },
  oweToID: { type: Schema.Types.ObjectId },
  paymentStatus: { type: String, required: true },
  updatedOn: { type: Date, default: new Date() },
},
{
  versionKey: false,
});

const Split = mongoose.model('Split', splitSchema);
module.exports = Split;
