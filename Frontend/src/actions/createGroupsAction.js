import { GET_FRIENDS_DETAILS, GROUP_CREATED } from "../constants/actionTypes";

// eslint-disable-next-line import/prefer-default-export
export function getFriends(payload) {
  console.log(`get friends ${payload}`);
  return { type: GET_FRIENDS_DETAILS, payload };
}

export function createGroup(payload) {
  console.log(`createGroup ${payload}`);
  return { type: GROUP_CREATED, payload };
}
