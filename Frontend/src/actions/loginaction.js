import { USER_LOGIN, USER_LOGOUT } from "../constants/actionTypes";

export function userLogin(payload) {
  console.log(`login action payload ${payload}`);
  return { type: USER_LOGIN, payload };
}

export function logout(payload) {
  console.log("logout action");
  return { type: USER_LOGOUT, payload };
}
