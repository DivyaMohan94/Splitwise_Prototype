/* eslint-disable import/prefer-default-export */
import { USER_SIGNEDUP } from "../constants/actionTypes";

export function signup(payload) {
  console.log("signup action");
  return { type: USER_SIGNEDUP, payload };
}
