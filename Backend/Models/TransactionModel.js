const mongoose = require('mongoose');

const { Schema } = mongoose;

const transactionSchema = new Schema({
  groupID: { type: Schema.Types.ObjectId, ref: 'GroupDetails' },
  groupName: { type: String, required: true },
  description: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
  createdOn: { type: Date, default: new Date() },
  totalAmount: { type: Number, required: true },
  lentAmount: { type: Number },

  // split: [{
  //   splitAmount: { type: Schema.Types.Decimal128, required: true },
  //   userID: { type: Schema.Types.ObjectId },
  //   oweToID: { type: Schema.Types.ObjectId },
  //   paymentStatus: { type: String, required: true },
  //   updatedOn: { type: Date, default: new Date() },
  // }],
},
{
  versionKey: false,
});

const Transactions = mongoose.model('Transactions', transactionSchema);
module.exports = Transactions;
