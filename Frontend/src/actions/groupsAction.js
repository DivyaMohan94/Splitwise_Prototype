import {
  EXPENSE_CREATED,
  NOTES_CREATED,
  NOTES_DELETED,
  GET_TRANSACTION_DATA,
  GET_SPLIT_DATA,
} from "../constants/actionTypes";

// eslint-disable-next-line import/prefer-default-export
export function createExpense(payload) {
  return { type: EXPENSE_CREATED, payload };
}

export function addNotes(payload) {
  return { type: NOTES_CREATED, payload };
}

export function deleteNotes(payload) {
  return { type: NOTES_DELETED, payload };
}

export function getSplitData(payload) {
  return { type: GET_SPLIT_DATA, payload };
}

export function getTransactionData(payload) {
  return { type: GET_TRANSACTION_DATA, payload };
}
