import {
  GET_DASHBOARD_DATA, GET_YOUOWE_DATA, GET_YOUOWED_DATA, SETTLEDUP,
} from "../constants/actionTypes";

// eslint-disable-next-line import/prefer-default-export
export function getDashboardDetails(payload) {
  console.log(`get dashboard ${payload}`);
  return { type: GET_DASHBOARD_DATA, payload };
}

export function getYouOweDetails(payload) {
  console.log(`you owe data ${payload}`);
  return { type: GET_YOUOWE_DATA, payload };
}

export function getYouAreOweDetails(payload) {
  console.log(`you are owed data ${payload}`);
  return { type: GET_YOUOWED_DATA, payload };
}

export function settleUp(payload) {
  return { type: SETTLEDUP, payload };
}
