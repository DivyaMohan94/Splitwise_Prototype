/* eslint-disable import/prefer-default-export */
import { PROFILE_UPDATED } from "../constants/actionTypes";

export function updateProfile(payload) {
  return { type: PROFILE_UPDATED, payload };
}
