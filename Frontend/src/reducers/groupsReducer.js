/* eslint-disable func-names */
import {
  GET_FRIENDS_DETAILS,
  GET_DASHBOARD_DATA,
  GET_YOUOWE_DATA,
  GET_YOUOWED_DATA,
  SETTLEDUP,
  GET_ACTIVEGROUPS_DATA,
  GET_INVITES_DATA,
  GROUP_CREATED,
  EXPENSE_CREATED,
  NOTES_CREATED,
  NOTES_DELETED,
  GET_TRANSACTION_DATA,
  GET_SPLIT_DATA,
  INVITE_ACCEPTED,
  GROUP_LEFT,
} from "../constants/actionTypes";

const initialState = {
  friends: {},
  activeGroupDetails: {},
  invites: {},
  expenseDetails: {},
  splitDetails: {},
  dashboardDetail: {},
  youOwe: {},
  youAreOwed: {},
  message: {},
};

export default function (state = initialState, action) {
  console.log("in group reducer");
  console.log(action.payload);
  switch (action.type) {
    case GET_FRIENDS_DETAILS:
      return {
        ...state,
        friends: action.payload,
      };
    case GET_ACTIVEGROUPS_DATA:
      return {
        ...state,
        activeGroupDetails: action.payload,
      };
    case GET_INVITES_DATA:
      return {
        ...state,
        invites: action.payload,
      };
    case GROUP_CREATED:
      return {
        ...state,
        message: action.payload,
      };
    case GET_DASHBOARD_DATA:
      return {
        ...state,
        dashboardDetail: action.payload,
      };
    case GET_YOUOWE_DATA:
      return {
        ...state,
        youOwe: action.payload,
      };
    case GET_YOUOWED_DATA:
      return {
        ...state,
        youAreOwed: action.payload,
      };
    case SETTLEDUP:
      return {
        ...state,
        message: action.payload,
      };
    case EXPENSE_CREATED:
      return {
        ...state,
        message: action.payload,
      };
    case NOTES_CREATED:
      return {
        ...state,
        message: action.payload,
      };
    case NOTES_DELETED:
      return {
        ...state,
        message: action.payload,
      };
    case GET_TRANSACTION_DATA:
      return {
        ...state,
        expenseDetails: action.payload,
      };
    case GET_SPLIT_DATA:
      return {
        ...state,
        splitDetails: action.payload,
      };
    case INVITE_ACCEPTED:
      return {
        ...state,
        message: action.payload,
      };
    case GROUP_LEFT:
      return {
        ...state,
        message: action.payload,
      };
    default:
      return state;
  }
}
