import { GROUP_LEFT, INVITE_ACCEPTED } from "../constants/actionTypes";

// eslint-disable-next-line import/prefer-default-export
export function groupLeft(payload) {
  console.log(`get friends ${payload}`);
  return { type: GROUP_LEFT, payload };
}

export function inviteAccepted(payload) {
  console.log(`createGroup ${payload}`);
  return { type: INVITE_ACCEPTED, payload };
}
