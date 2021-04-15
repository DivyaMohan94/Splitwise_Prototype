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
  notes: [{
    note: { type: String },
    addedBy: { type: Schema.Types.ObjectId, ref: 'Users' },
    addedOn: { type: Date, default: new Date() },
    addedUser: { type: String },
  }],
},
{
  versionKey: false,
});

const Transactions = mongoose.model('Transactions', transactionSchema);
module.exports = Transactions;
